import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const WITHDRAWAL_METHODS_SETTING_KEY = "withdrawal.methods";

const fieldSchema = z.object({
  id: z.string().trim().min(2).max(80),
  label: z.string().trim().min(2).max(120),
  type: z.enum(["TEXT", "NUMBER", "EMAIL", "TEL", "SELECT", "TEXTAREA"]).default("TEXT"),
  required: z.boolean().default(true),
  placeholder: z.string().trim().max(160).optional(),
  helpText: z.string().trim().max(240).optional(),
  options: z.array(z.string().trim().min(1).max(80)).default([])
});

const methodSchema = z.object({
  id: z.string().trim().min(2).max(80),
  type: z.enum(["BANK", "CRYPTO"]),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).default(""),
  enabled: z.boolean().default(true),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  currency: z.string().trim().min(2).max(12).default("USD"),
  reviewWindow: z.string().trim().max(160).optional(),
  cooldownHours: z.coerce.number().int().min(0).max(720).default(24),
  instructions: z.string().trim().max(1000).optional(),
  fields: z.array(fieldSchema).default([])
});

export const withdrawalMethodsSettingSchema = z.object({
  methods: z.array(methodSchema).default([])
});

export type WithdrawalMethod = z.infer<typeof methodSchema>;
export type WithdrawalField = z.infer<typeof fieldSchema>;
export type WithdrawalMethodsSetting = z.infer<typeof withdrawalMethodsSettingSchema>;

const fixedBankFieldIds = new Set(["bankName", "accountNumber"]);

function customFieldsForMethod(method: WithdrawalMethod) {
  if (method.type !== "BANK") return method.fields;
  return method.fields.filter((field) => !fixedBankFieldIds.has(field.id));
}

export const defaultWithdrawalMethodsSetting: WithdrawalMethodsSetting = {
  methods: [
    {
      id: "bank-withdrawal-primary",
      type: "BANK",
      name: "Bank withdrawal",
      description: "Withdraw cleared USD balance to a reviewed bank account.",
      enabled: true,
      status: "ACTIVE",
      currency: "USD",
      reviewWindow: "Same business day after finance review",
      cooldownHours: 24,
      instructions: "Add the bank details exactly as they appear on the receiving bank account.",
      fields: [
        { id: "accountName", label: "Account name", type: "TEXT", required: true, placeholder: "Name on bank account", options: [] },
        { id: "sortCode", label: "Sort code / routing number", type: "TEXT", required: false, placeholder: "Optional local bank code", options: [] },
        { id: "bankCountry", label: "Bank country", type: "TEXT", required: true, placeholder: "United Kingdom", options: [] }
      ]
    },
    {
      id: "crypto-withdrawal-primary",
      type: "CRYPTO",
      name: "Crypto withdrawal",
      description: "Withdraw to a screened crypto wallet destination.",
      enabled: true,
      status: "ACTIVE",
      currency: "USDT",
      reviewWindow: "Enhanced review before release",
      cooldownHours: 48,
      instructions: "Confirm the network carefully. Crypto withdrawals sent to a wrong network cannot be recovered.",
      fields: [
        { id: "currency", label: "Asset", type: "SELECT", required: true, options: ["USDT", "BTC", "ETH"] },
        { id: "cryptoNetwork", label: "Network", type: "SELECT", required: true, options: ["TRC20", "ERC20", "BTC", "ETH"] },
        { id: "walletAddress", label: "Wallet address", type: "TEXT", required: true, placeholder: "Paste the full wallet address", options: [] },
        { id: "walletLabel", label: "Wallet label", type: "TEXT", required: false, placeholder: "Personal cold wallet", options: [] }
      ]
    }
  ]
};

export function normalizeWithdrawalMethods(value: unknown): WithdrawalMethodsSetting {
  const parsed = withdrawalMethodsSettingSchema.safeParse(value);
  if (parsed.success) {
    return {
      methods: parsed.data.methods.map((method) => ({
        ...method,
        fields: customFieldsForMethod(method)
      }))
    };
  }
  return defaultWithdrawalMethodsSetting;
}

export function clientVisibleWithdrawalMethods(value: unknown) {
  const setting = normalizeWithdrawalMethods(value);
  return {
    methods: setting.methods.filter((method) => method.enabled !== false && method.status !== "DISABLED")
  };
}

export async function getWithdrawalMethodsSetting() {
  const setting = await prisma.systemSetting.findUnique({ where: { key: WITHDRAWAL_METHODS_SETTING_KEY } });
  if (setting) return normalizeWithdrawalMethods(setting.value);
  const created = await prisma.systemSetting.create({
    data: {
      key: WITHDRAWAL_METHODS_SETTING_KEY,
      value: defaultWithdrawalMethodsSetting as unknown as Prisma.InputJsonValue,
      description: "Accepted client withdrawal routes and beneficiary verification field requirements."
    }
  });
  return normalizeWithdrawalMethods(created.value);
}

export async function upsertWithdrawalMethodsSetting(value: unknown, updatedBy?: string, description?: string) {
  const normalized = withdrawalMethodsSettingSchema.parse(value);
  return prisma.systemSetting.upsert({
    where: { key: WITHDRAWAL_METHODS_SETTING_KEY },
    update: {
      value: normalized as unknown as Prisma.InputJsonValue,
      description,
      updatedBy
    },
    create: {
      key: WITHDRAWAL_METHODS_SETTING_KEY,
      value: normalized as unknown as Prisma.InputJsonValue,
      description,
      updatedBy
    }
  });
}

export function findWithdrawalMethod(value: unknown, type: string, methodId?: string | null) {
  const methods = normalizeWithdrawalMethods(value).methods.filter((method) => method.type === type && method.enabled !== false && method.status !== "DISABLED");
  if (methodId) {
    const requested = String(methodId).toLowerCase();
    const exact = methods.find((method) => method.id.toLowerCase() === requested || method.name.toLowerCase() === requested);
    if (exact) return exact;
  }
  return methods[0] || null;
}

export function collectWithdrawalVerificationData(method: WithdrawalMethod, payload: Record<string, unknown>) {
  const fields: Record<string, string[]> = {};
  const values: Record<string, string> = {};
  if (method.type === "BANK") {
    for (const fixedField of [
      { id: "bankName", label: "Bank name" },
      { id: "accountNumber", label: "Bank account number" }
    ]) {
      const raw = payload[fixedField.id];
      const value = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw).trim();
      if (!value) fields[fixedField.id] = [`${fixedField.label} is required`];
      else values[fixedField.id] = value;
    }
  }
  for (const field of method.fields) {
    const raw = payload[field.id];
    const value = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw).trim();
    if (field.required && !value) fields[field.id] = [`${field.label} is required`];
    if (value) values[field.id] = value;
  }
  return { fields, values };
}
