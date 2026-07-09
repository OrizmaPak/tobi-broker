import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("AdminPass123!", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@bullport.local" },
    update: {},
    create: {
      name: "Operations Admin",
      email: "admin@bullport.local",
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });

  const clients = [
    ["BP-447215", "Tobi Adeyemi", "tobi.adeyemi@example.com", "Premium Managed", "MODERATE"],
    ["BP-447216", "Amara Okafor", "amara.okafor@example.com", "Balanced Growth", "MODERATE"],
    ["BP-447217", "Nosa Bello", "nosa.bello@example.com", "Dividend Income", "LOW"],
    ["BP-447218", "Ife Martins", "ife.martins@example.com", "Equity Growth", "HIGH"],
    ["BP-447219", "Musa Danladi", "musa.danladi@example.com", "Premium Managed", "CUSTOM"]
  ] as const;

  for (const row of clients) {
    const client = await prisma.client.upsert({
      where: { accountNumber: row[0] },
      update: {},
      create: {
        accountNumber: row[0],
        name: row[1],
        email: row[2],
        tier: row[3],
        riskLevel: row[4],
        status: "ACTIVE"
      }
    });

    await prisma.walletAccount.upsert({
      where: { clientId: client.id },
      update: {},
      create: {
        clientId: client.id,
        balance: 18420,
        available: 17920
      }
    });
  }

  const products = [
    ["Conservative Income", "LOW", 1000, "Monthly", "PUBLISHED"],
    ["Balanced Growth", "MODERATE", 2500, "Quarterly", "PUBLISHED"],
    ["Commodity Opportunity", "HIGH", 5000, "Quarterly", "REVIEW"],
    ["Dividend Income", "MODERATE", 3500, "Monthly / quarterly", "PUBLISHED"],
    ["Equity Growth", "HIGH", 4000, "Optional", "PUBLISHED"],
    ["Premium Managed", "CUSTOM", 25000, "Custom", "PUBLISHED"]
  ] as const;

  for (const row of products) {
    await prisma.portfolioProduct.upsert({
      where: { name: row[0] },
      update: {},
      create: {
        name: row[0],
        riskLevel: row[1],
        minimum: row[2],
        payoutRule: row[3],
        status: row[4],
        description: `${row[0]} broker-managed portfolio product. Returns are projected and market-based, never guaranteed.`
      }
    });
  }

  const tobi = await prisma.client.findUniqueOrThrow({ where: { accountNumber: "BP-447215" } });
  const nosa = await prisma.client.findUniqueOrThrow({ where: { accountNumber: "BP-447217" } });
  const premium = await prisma.portfolioProduct.findUniqueOrThrow({ where: { name: "Premium Managed" } });

  await prisma.kycReview.create({
    data: {
      clientId: tobi.id,
      requirement: "Proof of address",
      documentRef: "utility-bill-june-2026.pdf",
      status: "IN_REVIEW",
      reviewer: "Compliance"
    }
  });

  await prisma.deposit.upsert({
    where: { reference: "DEP-9013" },
    update: {},
    create: {
      reference: "DEP-9013",
      clientId: tobi.id,
      method: "Crypto USDT",
      rail: "TRC20",
      amount: 3500,
      received: 3500,
      status: "IN_REVIEW"
    }
  });

  await prisma.withdrawal.upsert({
    where: { reference: "WDR-3381" },
    update: {},
    create: {
      reference: "WDR-3381",
      clientId: nosa.id,
      destination: "Verified bank account",
      amount: 2400,
      status: "IN_REVIEW"
    }
  });

  await prisma.clientInvestment.create({
    data: {
      clientId: tobi.id,
      productId: premium.id,
      investedAmount: 42000,
      currentValue: 47180,
      status: "ACTIVE",
      nextAction: "Top-up requested"
    }
  });

  await prisma.supportTicket.upsert({
    where: { ticketNo: "BP-1208" },
    update: {},
    create: {
      ticketNo: "BP-1208",
      clientId: nosa.id,
      subject: "Withdrawal timing clarification",
      owner: "Finance",
      status: "AWAITING_BROKER",
      priority: "High"
    }
  });

  await prisma.auditLog.create({
    data: {
      actorName: "System",
      action: "seedDemoData",
      entityType: "System",
      metadata: { source: "prisma/seed.ts" }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
