import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const DEPOSIT_METHODS_SETTING_KEY = "deposit.methods";

const proofFieldSchema = z.object({
  id: z.string().trim().min(2).max(80),
  label: z.string().trim().min(2).max(120),
  type: z.enum(["TEXT", "NUMBER", "EMAIL", "TEL", "SELECT", "TEXTAREA", "DATE"]).default("TEXT"),
  required: z.boolean().default(false),
  placeholder: z.string().trim().max(160).optional(),
  helpText: z.string().trim().max(240).optional(),
  options: z.array(z.string().trim().min(1).max(80)).default([])
});

const methodBaseSchema = z.object({
  id: z.string().trim().min(2).max(80),
  type: z.enum(["BANK", "CRYPTO", "CARD"]),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).default(""),
  enabled: z.boolean().default(true),
  status: z.enum(["ACTIVE", "COMING_SOON", "DISABLED"]).default("ACTIVE"),
  currency: z.string().trim().min(2).max(12).default("USD"),
  minimumAmount: z.coerce.number().nonnegative().optional(),
  postingWindow: z.string().trim().max(160).optional(),
  instructions: z.string().trim().max(1000).optional(),
  requireReference: z.boolean().optional(),
  requireTransactionHash: z.boolean().optional(),
  requireReceiptUpload: z.boolean().optional(),
  proofInstructions: z.string().trim().max(500).optional(),
  proofFields: z.array(proofFieldSchema).default([])
});

const bankMethodSchema = methodBaseSchema.extend({
  type: z.literal("BANK"),
  bankName: z.string().trim().min(2).max(120),
  accountName: z.string().trim().min(2).max(160),
  accountNumber: z.string().trim().min(2).max(80),
  sortCode: z.string().trim().max(40).optional(),
  iban: z.string().trim().max(80).optional(),
  swift: z.string().trim().max(40).optional(),
  branch: z.string().trim().max(120).optional()
});

const cryptoMethodSchema = methodBaseSchema.extend({
  type: z.literal("CRYPTO"),
  network: z.string().trim().min(2).max(80),
  address: z.string().trim().min(8).max(240),
  tagOrMemo: z.string().trim().max(120).optional()
});

const cardMethodSchema = methodBaseSchema.extend({
  type: z.literal("CARD"),
  enabled: z.boolean().default(false),
  status: z.enum(["COMING_SOON", "DISABLED", "ACTIVE"]).default("COMING_SOON"),
  networks: z.array(z.string().trim().min(2).max(40)).default(["VISA", "Mastercard", "Verve", "AmEx"])
});

export const depositMethodSchema = z.discriminatedUnion("type", [
  bankMethodSchema,
  cryptoMethodSchema,
  cardMethodSchema
]);

export const depositMethodsSettingSchema = z.object({
  methods: z.array(depositMethodSchema).default([])
});

export type DepositMethod = z.infer<typeof depositMethodSchema>;
export type DepositMethodsSetting = z.infer<typeof depositMethodsSettingSchema>;

export const defaultDepositMethodsSetting: DepositMethodsSetting = {
  methods: [
    {
      id: "bank-london-primary",
      type: "BANK",
      name: "London bank transfer",
      description: "Primary client funding account for bank transfers.",
      enabled: true,
      status: "ACTIVE",
      currency: "USD",
      bankName: "BullPort Settlement Bank",
      accountName: "BullPort Client Funding",
      accountNumber: "BP-CLIENT-0001",
      sortCode: "20-18-45",
      iban: "GB29 BULL 2026 0000 0001 01",
      swift: "BULLGB22",
      postingWindow: "Within 1 business day after finance confirmation",
      instructions: "Use your BullPort account number as the payment reference.",
      requireReference: true,
      requireTransactionHash: false,
      requireReceiptUpload: true,
      proofInstructions: "Enter the bank transfer reference and upload the receipt or payment screenshot.",
      proofFields: [
        { id: "senderName", label: "Sender name", type: "TEXT", required: true, placeholder: "Name on the sending account", options: [] },
        { id: "senderBank", label: "Sending bank", type: "TEXT", required: false, placeholder: "Bank funds came from", options: [] },
        { id: "transferDate", label: "Transfer date", type: "DATE", required: true, options: [] }
      ]
    },
    {
      id: "crypto-usdt-trc20",
      type: "CRYPTO",
      name: "USDT",
      description: "USDT funding on TRC20 for faster wallet top-ups.",
      enabled: true,
      status: "ACTIVE",
      currency: "USDT",
      network: "TRC20",
      address: "TBUllPortDemoFundingWallet000000000001",
      postingWindow: "After chain and finance confirmation",
      instructions: "Send only USDT on TRC20 and submit the transaction hash from this portal.",
      requireReference: false,
      requireTransactionHash: true,
      requireReceiptUpload: true,
      proofInstructions: "Enter the blockchain transaction hash and upload a transfer screenshot if available.",
      proofFields: [
        { id: "sentAsset", label: "Asset sent", type: "SELECT", required: true, options: ["USDT", "BTC", "ETH"] },
        { id: "sourceWallet", label: "Source wallet", type: "TEXT", required: false, placeholder: "Optional sending wallet address", options: [] }
      ]
    },
    {
      id: "card-instant",
      type: "CARD",
      name: "Pay with card",
      description: "Instant debit and credit card funding will be enabled in a later release.",
      enabled: false,
      status: "COMING_SOON",
      currency: "USD",
      networks: ["VISA", "Mastercard", "Verve", "AmEx"],
      postingWindow: "Coming soon",
      instructions: "Card funding is not enabled for this beta.",
      requireReference: false,
      requireTransactionHash: false,
      requireReceiptUpload: false,
      proofInstructions: "Card proof is not required until instant funding is enabled.",
      proofFields: []
    }
  ]
};

export function normalizeDepositMethods(value: unknown): DepositMethodsSetting {
  const parsed = depositMethodsSettingSchema.safeParse(value);
  if (parsed.success) {
    return {
      methods: parsed.data.methods.map((method) => ({
        ...method,
        requireReference: method.requireReference ?? (method.type === "BANK"),
        requireTransactionHash: method.requireTransactionHash ?? (method.type === "CRYPTO"),
        requireReceiptUpload: method.requireReceiptUpload ?? (method.type !== "CARD"),
        proofInstructions: method.proofInstructions || (method.type === "CRYPTO"
          ? "Enter the blockchain transaction hash and upload a transfer screenshot if available."
          : method.type === "BANK"
            ? "Enter the bank transfer reference and upload the receipt or payment screenshot."
            : "Card proof is not required until instant funding is enabled."),
        proofFields: method.proofFields || []
      }))
    };
  }
  return defaultDepositMethodsSetting;
}

export function clientVisibleDepositMethods(value: unknown) {
  const setting = normalizeDepositMethods(value);
  return {
    methods: setting.methods.filter((method) => method.status !== "DISABLED")
  };
}

export async function getDepositMethodsSetting() {
  const setting = await prisma.systemSetting.findUnique({ where: { key: DEPOSIT_METHODS_SETTING_KEY } });
  if (setting) return normalizeDepositMethods(setting.value);
  const created = await prisma.systemSetting.create({
    data: {
      key: DEPOSIT_METHODS_SETTING_KEY,
      value: defaultDepositMethodsSetting as unknown as Prisma.InputJsonValue,
      description: "Accepted client wallet funding routes including bank, crypto and card availability."
    }
  });
  return normalizeDepositMethods(created.value);
}

export async function upsertDepositMethodsSetting(value: unknown, updatedBy?: string, description?: string) {
  const normalized = depositMethodsSettingSchema.parse(value);
  return prisma.systemSetting.upsert({
    where: { key: DEPOSIT_METHODS_SETTING_KEY },
    update: {
      value: normalized as unknown as Prisma.InputJsonValue,
      description,
      updatedBy
    },
    create: {
      key: DEPOSIT_METHODS_SETTING_KEY,
      value: normalized as unknown as Prisma.InputJsonValue,
      description,
      updatedBy
    }
  });
}

export function findDepositMethod(value: unknown, methodType: string, rail: string) {
  const railValue = String(rail || "").toLowerCase();
  return normalizeDepositMethods(value).methods.find((method) => {
    if (method.type !== methodType || method.status !== "ACTIVE" || method.enabled === false) return false;
    if (method.id.toLowerCase() === railValue || method.name.toLowerCase() === railValue) return true;
    if (method.type === "BANK") return railValue === "bank transfer" || method.bankName.toLowerCase() === railValue;
    if (method.type === "CRYPTO") return method.network.toLowerCase() === railValue || method.currency.toLowerCase() === railValue;
    return false;
  });
}

export function collectDepositProofData(method: DepositMethod, payload: Record<string, unknown>) {
  const fields: Record<string, string[]> = {};
  const values: Record<string, string> = {};
  for (const field of method.proofFields || []) {
    const raw = payload[field.id];
    const value = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw).trim();
    if (field.required && !value) fields[field.id] = [`${field.label} is required`];
    if (value) values[field.id] = value;
  }
  return { fields, values };
}
