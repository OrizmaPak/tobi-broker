import { describe, expect, it } from "vitest";
import { buildKycChecklist, requiredDocumentSides, summarizeKycChecklist } from "./kyc.service";

const requirements = [
  {
    id: "identity",
    code: "GOVERNMENT_ID",
    documentType: "Government-issued ID",
    description: "Valid identity document",
    uploadMode: "FRONT_BACK",
    isRequired: true,
    isActive: true,
    sortOrder: 10
  },
  {
    id: "address",
    code: "PROOF_OF_ADDRESS",
    documentType: "Proof of address",
    description: "Recent address document",
    uploadMode: "FRONT_ONLY",
    isRequired: true,
    isActive: true,
    sortOrder: 20
  },
  {
    id: "funds",
    code: "SOURCE_OF_FUNDS",
    documentType: "Source of funds",
    description: "Funding evidence",
    uploadMode: "FRONT_ONLY",
    isRequired: false,
    isActive: true,
    sortOrder: 30
  }
];

describe("KYC requirements", () => {
  it("expands front-and-back requirements into separate upload slots", () => {
    expect(requiredDocumentSides("FRONT_BACK")).toEqual(["FRONT", "BACK"]);
    expect(requiredDocumentSides("FRONT_ONLY")).toEqual(["FRONT"]);
    const checklist = buildKycChecklist(requirements, []);
    expect(checklist[0].requiredSides).toEqual(["FRONT", "BACK"]);
    expect(summarizeKycChecklist(checklist)).toMatchObject({ requiredDocuments: 3, uploadedDocuments: 0, verifiedDocuments: 0, uploadComplete: false, reviewComplete: false });
  });

  it("uses the latest upload for each requirement side", () => {
    const oldFront = { id: "old", requirementId: "identity", side: "FRONT", status: "REJECTED", uploadedAt: new Date("2026-01-01") };
    const newFront = { id: "new", requirementId: "identity", side: "FRONT", status: "VERIFIED", uploadedAt: new Date("2026-02-01") };
    const back = { id: "back", requirementId: "identity", side: "BACK", status: "VERIFIED", uploadedAt: new Date("2026-02-01") };
    const address = { id: "address-file", requirementId: "address", side: "FRONT", status: "PENDING", uploadedAt: new Date("2026-02-01") };
    const checklist = buildKycChecklist(requirements, [oldFront, newFront, back, address]);
    expect(checklist[0].uploads[0].document?.id).toBe("new");
    expect(summarizeKycChecklist(checklist)).toMatchObject({ requiredDocuments: 3, uploadedDocuments: 3, verifiedDocuments: 2, uploadComplete: true, reviewComplete: false });
  });

  it("does not let an optional document block overall completion", () => {
    const documents = [
      { id: "front", requirementId: "identity", side: "FRONT", status: "VERIFIED", uploadedAt: new Date() },
      { id: "back", requirementId: "identity", side: "BACK", status: "VERIFIED", uploadedAt: new Date() },
      { id: "address", requirementId: "address", side: "FRONT", status: "VERIFIED", uploadedAt: new Date() }
    ];
    const summary = summarizeKycChecklist(buildKycChecklist(requirements, documents));
    expect(summary).toMatchObject({ requiredDocuments: 3, uploadedDocuments: 3, verifiedDocuments: 3, uploadComplete: true, reviewComplete: true });
  });

  it("requires a replacement when the latest upload was rejected", () => {
    const documents = [
      { id: "front", requirementId: "identity", side: "FRONT", status: "REJECTED", uploadedAt: new Date() },
      { id: "back", requirementId: "identity", side: "BACK", status: "VERIFIED", uploadedAt: new Date() },
      { id: "address", requirementId: "address", side: "FRONT", status: "VERIFIED", uploadedAt: new Date() }
    ];
    const summary = summarizeKycChecklist(buildKycChecklist(requirements, documents));
    expect(summary).toMatchObject({ requiredDocuments: 3, uploadedDocuments: 2, verifiedDocuments: 2, uploadComplete: false, reviewComplete: false });
  });
});
