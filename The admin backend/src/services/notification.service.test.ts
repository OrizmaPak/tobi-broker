import { describe, expect, it, vi } from "vitest";
import { prisma } from "../lib/prisma";
import { ADMIN_NOTIFICATION_RECIPIENT_ID, createNotificationTx, kycReviewReadyDedupeKey, markNotificationRead, notifyAdminTx, notifyClientTx } from "./notification.service";

function fakeNotificationTx(options: { existing?: unknown; client?: unknown } = {}) {
  const notification = {
    findUnique: vi.fn().mockResolvedValue(options.existing || null),
    findUniqueOrThrow: vi.fn(),
    create: vi.fn().mockImplementation(async (input) => ({ id: "notification-1", ...input.data }))
  };
  return {
    notification,
    notificationDelivery: { updateMany: vi.fn() },
    outboxEvent: { create: vi.fn() },
    client: { findUnique: vi.fn().mockResolvedValue(options.client || null) }
  } as any;
}

describe("notification gateway", () => {
  it("builds stable KYC review dedupe keys from the uploaded document set", () => {
    const first = kycReviewReadyDedupeKey("case-1", ["doc-b", "doc-a"]);
    const repeated = kycReviewReadyDedupeKey("case-1", ["doc-a", "doc-b"]);
    const replacement = kycReviewReadyDedupeKey("case-1", ["doc-a", "doc-c"]);

    expect(first).toBe(repeated);
    expect(first).not.toBe(replacement);
  });

  it("targets client notifications and queues email outbox work when email is enabled", async () => {
    const tx = fakeNotificationTx({ client: { email: "client@example.com", preferences: { emailNotifications: true } } });

    await notifyClientTx(tx, {
      clientId: "client-1",
      email: true,
      title: "KYC document needs attention",
      body: "Replace the rejected identity document.",
      category: "KYC",
      actionUrl: "kyc.html",
      eventKey: "kyc.document.rejected",
      severity: "WARNING",
      dedupeKey: "dedupe-client"
    });

    expect(tx.notification.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        recipientType: "CLIENT",
        recipientId: "client-1",
        clientId: "client-1",
        eventKey: "kyc.document.rejected",
        severity: "WARNING",
        deliveries: {
          create: [
            expect.objectContaining({ channel: "IN_APP", recipient: "client:client-1", status: "SENT" }),
            expect.objectContaining({ channel: "EMAIL", recipient: "client@example.com", status: "PENDING" })
          ]
        }
      })
    }));
    expect(tx.outboxEvent.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        type: "SEND_EMAIL",
        payload: expect.objectContaining({ notificationId: "notification-1", to: "client@example.com" })
      })
    }));
  });

  it("does not create email delivery or outbox work when client email notifications are disabled", async () => {
    const tx = fakeNotificationTx({ client: { email: "client@example.com", preferences: { emailNotifications: false } } });

    await notifyClientTx(tx, {
      clientId: "client-1",
      email: true,
      title: "KYC approved",
      body: "Your verification is approved.",
      category: "KYC"
    });

    expect(tx.notification.create.mock.calls[0][0].data.deliveries.create).toEqual([
      expect.objectContaining({ channel: "IN_APP", recipient: "client:client-1", status: "SENT" })
    ]);
    expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });

  it("targets the shared admin inbox without creating email work", async () => {
    const tx = fakeNotificationTx();

    await notifyAdminTx(tx, {
      clientId: "client-1",
      title: "KYC ready for review",
      body: "A client submitted documents.",
      category: "KYC",
      actionUrl: "kyc-review.html?id=case-1",
      eventKey: "kyc.review_ready",
      dedupeKey: "dedupe-admin"
    });

    expect(tx.notification.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        recipientType: "ADMIN",
        recipientId: ADMIN_NOTIFICATION_RECIPIENT_ID,
        clientId: "client-1",
        deliveries: {
          create: [
            expect.objectContaining({ channel: "IN_APP", recipient: "admin:" + ADMIN_NOTIFICATION_RECIPIENT_ID, status: "SENT" })
          ]
        }
      })
    }));
    expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });

  it("returns an existing notification when a dedupe key has already been used", async () => {
    const existing = { id: "existing-notification", dedupeKey: "dedupe-existing" };
    const tx = fakeNotificationTx({ existing });

    const result = await createNotificationTx(tx, {
      recipientType: "ADMIN",
      recipientId: ADMIN_NOTIFICATION_RECIPIENT_ID,
      title: "KYC ready for review",
      body: "A client submitted documents.",
      category: "KYC",
      dedupeKey: "dedupe-existing"
    });

    expect(result).toBe(existing);
    expect(tx.notification.create).not.toHaveBeenCalled();
    expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });

  it("scopes read updates to the requested recipient inbox", async () => {
    const findFirst = vi.spyOn(prisma.notification, "findFirst").mockResolvedValue(null as any);
    const update = vi.spyOn(prisma.notification, "update").mockResolvedValue({ id: "notification-1" } as any);

    const result = await markNotificationRead({
      recipientType: "ADMIN",
      recipientId: ADMIN_NOTIFICATION_RECIPIENT_ID,
      id: "client-notification"
    });

    expect(result).toBeNull();
    expect(findFirst).toHaveBeenCalledWith({
      where: {
        id: "client-notification",
        recipientType: "ADMIN",
        recipientId: ADMIN_NOTIFICATION_RECIPIENT_ID
      }
    });
    expect(update).not.toHaveBeenCalled();

    findFirst.mockRestore();
    update.mockRestore();
  });
});
