import { Prisma } from "@prisma/client";
import { createHash } from "node:crypto";
import { Resend } from "resend";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { requiredDocumentSides } from "./kyc.service";

export const ADMIN_NOTIFICATION_RECIPIENT_ID = "admin-board";
export const CLIENT_NOTIFICATION_RECIPIENT_TYPE = "CLIENT";
export const ADMIN_NOTIFICATION_RECIPIENT_TYPE = "ADMIN";

type NotificationRecipientType = "CLIENT" | "ADMIN";
type NotificationSeverity = "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
type NotificationTx = Prisma.TransactionClient;

type NotificationEntity = {
  type: string;
  id: string;
};

type NotifyBaseInput = {
  title: string;
  body: string;
  category: string;
  actionUrl?: string;
  eventKey?: string;
  severity?: NotificationSeverity;
  entity?: NotificationEntity;
  metadata?: Prisma.InputJsonValue;
  dedupeKey?: string;
};

type NotifyCreateInput = NotifyBaseInput & {
  recipientType: NotificationRecipientType;
  recipientId: string;
  clientId?: string;
  emailRecipient?: string;
};

export type NotifyClientInput = NotifyBaseInput & {
  clientId: string;
  email?: string | boolean;
};

export type NotifyAdminInput = NotifyBaseInput & {
  clientId?: string;
};

export type NotificationInboxRecipient = {
  recipientType: NotificationRecipientType;
  recipientId: string;
};

function shortHash(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function emailNotificationsEnabled(preferences: unknown) {
  return !(preferences && typeof preferences === "object" && !Array.isArray(preferences) && (preferences as { emailNotifications?: unknown }).emailNotifications === false);
}

async function clientEmailRecipient(tx: NotificationTx, input: NotifyClientInput) {
  if (!input.email) return undefined;
  const client = await tx.client.findUnique({ where: { id: input.clientId }, select: { email: true, preferences: true } });
  if (client && !emailNotificationsEnabled(client.preferences)) return undefined;
  if (typeof input.email === "string") return input.email;
  return client?.email;
}

function notificationDeliveryRecipient(input: Pick<NotifyCreateInput, "recipientType" | "recipientId">) {
  return `${input.recipientType.toLowerCase()}:${input.recipientId}`;
}

export function kycReviewReadyDedupeKey(caseId: string, requiredDocumentIds: string[]) {
  return `kyc.review_ready:${caseId}:${shortHash(requiredDocumentIds.slice().sort().join("|"))}`;
}

export async function createNotificationTx(tx: NotificationTx, input: NotifyCreateInput) {
  if (input.dedupeKey) {
    const existing = await tx.notification.findUnique({ where: { dedupeKey: input.dedupeKey } });
    if (existing) return existing;
  }

  try {
    const notification = await tx.notification.create({
      data: {
        clientId: input.clientId,
        recipientType: input.recipientType,
        recipientId: input.recipientId,
        eventKey: input.eventKey,
        severity: input.severity || "INFO",
        title: input.title,
        body: input.body,
        category: input.category,
        actionUrl: input.actionUrl,
        entityType: input.entity?.type,
        entityId: input.entity?.id,
        metadata: input.metadata,
        dedupeKey: input.dedupeKey,
        deliveries: {
          create: [
            { channel: "IN_APP", recipient: notificationDeliveryRecipient(input), status: "SENT", sentAt: new Date() },
            ...(input.emailRecipient ? [{ channel: "EMAIL" as const, recipient: input.emailRecipient, status: "PENDING" as const }] : [])
          ]
        }
      }
    });

    if (input.emailRecipient) {
      await tx.outboxEvent.create({
        data: {
          type: "SEND_EMAIL",
          payload: {
            notificationId: notification.id,
            to: input.emailRecipient,
            subject: input.title,
            text: input.body
          }
        }
      });
    }
    return notification;
  } catch (error) {
    if (input.dedupeKey && error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return tx.notification.findUniqueOrThrow({ where: { dedupeKey: input.dedupeKey } });
    }
    throw error;
  }
}

export async function notifyClientTx(tx: NotificationTx, input: NotifyClientInput) {
  return createNotificationTx(tx, {
    ...input,
    recipientType: CLIENT_NOTIFICATION_RECIPIENT_TYPE,
    recipientId: input.clientId,
    clientId: input.clientId,
    emailRecipient: await clientEmailRecipient(tx, input)
  });
}

export async function notifyClient(input: NotifyClientInput) {
  return prisma.$transaction((tx) => notifyClientTx(tx, input));
}

export async function notifyAdminTx(tx: NotificationTx, input: NotifyAdminInput) {
  return createNotificationTx(tx, {
    ...input,
    recipientType: ADMIN_NOTIFICATION_RECIPIENT_TYPE,
    recipientId: ADMIN_NOTIFICATION_RECIPIENT_ID,
    clientId: input.clientId
  });
}

export async function notifyAdmin(input: NotifyAdminInput) {
  return prisma.$transaction((tx) => notifyAdminTx(tx, input));
}

export async function notifyKycReviewReadyTx(tx: NotificationTx, input: {
  caseId: string;
  clientId: string;
  clientName: string;
  accountNumber: string;
  level: string;
  requiredDocumentIds: string[];
  summary: Prisma.InputJsonObject;
}) {
  return notifyAdminTx(tx, {
    clientId: input.clientId,
    eventKey: "kyc.review_ready",
    category: "KYC",
    severity: "INFO",
    title: "KYC ready for review",
    body: `${input.clientName} (${input.accountNumber}) submitted ${input.level} KYC for compliance review.`,
    actionUrl: `kyc-review.html?id=${input.caseId}`,
    entity: { type: "KycCase", id: input.caseId },
    metadata: {
      clientId: input.clientId,
      accountNumber: input.accountNumber,
      level: input.level,
      requiredDocumentIds: input.requiredDocumentIds,
      summary: input.summary
    },
    dedupeKey: kycReviewReadyDedupeKey(input.caseId, input.requiredDocumentIds)
  });
}

export async function notifyClientsMissingKycRequirementTx(tx: NotificationTx, requirement: {
  id: string;
  documentType: string;
  uploadMode: string;
}) {
  const sides = requiredDocumentSides(requirement.uploadMode);
  const cases = await tx.kycCase.findMany({
    where: { status: { in: ["DRAFT", "SUBMITTED", "PENDING", "IN_REVIEW", "RESUBMISSION_REQUIRED"] } },
    include: {
      client: { select: { id: true, email: true, preferences: true } },
      documents: { where: { requirementId: requirement.id }, orderBy: { uploadedAt: "desc" } }
    }
  });
  let recipients = 0;
  for (const kycCase of cases) {
    const missingSides = sides.filter((side) => {
      const latest = kycCase.documents.find((document) => document.side === side);
      return !latest || latest.status === "REJECTED";
    });
    if (!missingSides.length) continue;
    await notifyClientTx(tx, {
      clientId: kycCase.clientId,
      email: true,
      eventKey: "kyc.requirement_missing",
      category: "KYC",
      severity: "WARNING",
      title: "New KYC document required",
      body: `${requirement.documentType} is now required for your verification. Upload the missing ${missingSides.map((side) => side.toLowerCase()).join(" and ")} file${missingSides.length === 1 ? "" : "s"}.`,
      actionUrl: "kyc.html",
      entity: { type: "KycDocumentRequirement", id: requirement.id },
      metadata: { caseId: kycCase.id, requirementId: requirement.id, missingSides },
      dedupeKey: `kyc.requirement_missing:${requirement.id}:${kycCase.id}:${missingSides.join("-")}`
    });
    recipients += 1;
  }
  return recipients;
}

export async function notificationInbox(input: NotificationInboxRecipient & { limit?: number }) {
  const limit = Math.min(Math.max(input.limit || 20, 1), 100);
  const where = { recipientType: input.recipientType, recipientId: input.recipientId };
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { client: { select: { id: true, accountNumber: true, name: true, email: true } } }
    }),
    prisma.notification.count({ where: { ...where, readAt: null } })
  ]);
  return { unreadCount, notifications };
}

export async function markNotificationRead(input: NotificationInboxRecipient & { id: string }) {
  const row = await prisma.notification.findFirst({
    where: { id: input.id, recipientType: input.recipientType, recipientId: input.recipientId }
  });
  if (!row) return null;
  if (row.readAt) return row;
  return prisma.notification.update({ where: { id: row.id }, data: { readAt: new Date() } });
}

export async function markAllNotificationsRead(input: NotificationInboxRecipient) {
  return prisma.notification.updateMany({
    where: { recipientType: input.recipientType, recipientId: input.recipientId, readAt: null },
    data: { readAt: new Date() }
  });
}

export async function processNotificationOutbox(limit = 25) {
  const events = await prisma.outboxEvent.findMany({
    where: { status: "PENDING", nextAttemptAt: { lte: new Date() } },
    orderBy: { createdAt: "asc" },
    take: limit
  });
  const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  const results: Array<{ id: string; status: string }> = [];
  for (const event of events) {
    const payload = event.payload as Prisma.JsonObject;
    if (event.type !== "SEND_EMAIL") {
      await prisma.outboxEvent.update({ where: { id: event.id }, data: { status: "COMPLETED", processedAt: new Date() } });
      results.push({ id: event.id, status: "SKIPPED" });
      continue;
    }
    if (!resend) {
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: { status: "PENDING", lastError: "RESEND_API_KEY is not configured", nextAttemptAt: new Date(Date.now() + 60 * 60 * 1000) }
      });
      if (payload.notificationId) {
        await prisma.notificationDelivery.updateMany({
          where: { notificationId: String(payload.notificationId), channel: "EMAIL" },
          data: { status: "PENDING", lastError: "Email provider is not configured" }
        });
      }
      results.push({ id: event.id, status: "WAITING_FOR_PROVIDER" });
      continue;
    }
    try {
      const response = await resend.emails.send({
        from: env.RESEND_FROM,
        to: String(payload.to),
        subject: String(payload.subject),
        text: String(payload.text),
        ...(payload.replyTo ? { replyTo: String(payload.replyTo) } : {})
      });
      await prisma.$transaction(async (tx) => {
        await tx.outboxEvent.update({ where: { id: event.id }, data: { status: "COMPLETED", attempts: { increment: 1 }, processedAt: new Date(), lastError: null } });
        if (payload.notificationId) {
          await tx.notificationDelivery.updateMany({
            where: { notificationId: String(payload.notificationId), channel: "EMAIL" },
            data: { status: "SENT", attempts: { increment: 1 }, providerId: response.data?.id, sentAt: new Date(), lastError: null }
          });
        }
      });
      results.push({ id: event.id, status: "SENT" });
    } catch (error) {
      const attempts = event.attempts + 1;
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: attempts >= 5 ? "FAILED" : "PENDING",
          attempts,
          lastError: error instanceof Error ? error.message : "Email delivery failed",
          nextAttemptAt: new Date(Date.now() + Math.min(2 ** attempts * 60_000, 60 * 60_000))
        }
      });
      results.push({ id: event.id, status: "RETRY" });
    }
  }
  return results;
}
