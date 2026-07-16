import type { Prisma } from "@prisma/client";
import { Resend } from "resend";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";

export async function notifyClient(input: {
  clientId: string;
  title: string;
  body: string;
  category: string;
  actionUrl?: string;
  email?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const notification = await tx.notification.create({
      data: {
        clientId: input.clientId,
        title: input.title,
        body: input.body,
        category: input.category,
        actionUrl: input.actionUrl,
        deliveries: {
          create: [
            { channel: "IN_APP", recipient: input.clientId, status: "SENT", sentAt: new Date() },
            ...(input.email ? [{ channel: "EMAIL" as const, recipient: input.email, status: "PENDING" as const }] : [])
          ]
        }
      }
    });
    if (input.email) {
      await tx.outboxEvent.create({
        data: {
          type: "SEND_EMAIL",
          payload: {
            notificationId: notification.id,
            to: input.email,
            subject: input.title,
            text: input.body
          }
        }
      });
    }
    return notification;
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
