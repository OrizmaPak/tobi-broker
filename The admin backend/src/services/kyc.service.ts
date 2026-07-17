export const KYC_UPLOAD_MODES = ["FRONT_ONLY", "FRONT_BACK"] as const;
export const KYC_DOCUMENT_SIDES = ["FRONT", "BACK"] as const;

type Requirement = {
  id: string;
  code: string;
  documentType: string;
  description: string;
  uploadMode: string;
  isRequired: boolean;
  isActive: boolean;
  sortOrder: number;
};

type Document = {
  id: string;
  requirementId: string | null;
  side: string;
  status: string;
  uploadedAt: Date;
  [key: string]: unknown;
};

export function requiredDocumentSides(uploadMode: string) {
  return uploadMode === "FRONT_BACK" ? ["FRONT", "BACK"] : ["FRONT"];
}

export function buildKycChecklist(requirements: Requirement[], documents: Document[]) {
  return requirements
    .filter((requirement) => requirement.isActive)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.documentType.localeCompare(right.documentType))
    .map((requirement) => {
      const sides = requiredDocumentSides(requirement.uploadMode);
      const uploads = sides.map((side) => {
        const document = documents
          .filter((item) => item.requirementId === requirement.id && item.side === side)
          .sort((left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime())[0] || null;
        return { side, document };
      });
      return {
        ...requirement,
        requiredSides: sides,
        uploads,
        uploadComplete: uploads.every((upload) => Boolean(upload.document) && upload.document?.status !== "REJECTED"),
        reviewComplete: uploads.every((upload) => upload.document?.status === "VERIFIED")
      };
    });
}

export function summarizeKycChecklist(checklist: ReturnType<typeof buildKycChecklist>) {
  const required = checklist.filter((item) => item.isRequired);
  const requiredSlots = required.flatMap((item) => item.uploads);
  const uploadedSlots = requiredSlots.filter((item) => Boolean(item.document) && item.document?.status !== "REJECTED");
  const verifiedSlots = requiredSlots.filter((item) => item.document?.status === "VERIFIED");
  return {
    requiredDocuments: requiredSlots.length,
    uploadedDocuments: uploadedSlots.length,
    verifiedDocuments: verifiedSlots.length,
    uploadComplete: requiredSlots.length === uploadedSlots.length,
    reviewComplete: requiredSlots.length === verifiedSlots.length
  };
}
