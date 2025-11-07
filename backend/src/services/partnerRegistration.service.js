const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const Action = {
  SEND: "SEND",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  REQUIRE_INFO: "REQUIRE_INFO",
  UPDATE: "UPDATE", // này mới thêm nè
};

const RegistrationStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  INFO_REQUIRED: "INFO_REQUIRED",
  REJECTED: "REJECTED",
};

const ActionTaker = {
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
};

const STATUS_TO_ACTION = {
  [RegistrationStatus.APPROVED]: Action.APPROVE,
  [RegistrationStatus.INFO_REQUIRED]: Action.REQUIRE_INFO,
  [RegistrationStatus.REJECTED]: Action.REJECT,
};

function mapStatusToAction(status) {
  return STATUS_TO_ACTION[status] || null;
}

const PartnerRegistrationService = {
  // PROVIDER
  sendApplicant: async (provider_id, services) => {
    await prisma.registration.create({
      data: {
        provider_id,
        metadata: services,
        status: RegistrationStatus.PENDING,
      },
    });
    await prisma.approvalHistory.create({
      data: {
        registration_id: registration.id,
        action: Action.SEND,
        by: ActionTaker.PROVIDER,
      },
    });
  },

  saveDraft: async (provider_id, services, draft_id) => {
    if (draft_id) {
      const updatedDraft = await prisma.registration.updateMany({
        where: {
          id: draft_id,
          provider_id,
          status: RegistrationStatus.DRAFT,
        },
        data: {
          metadata: services,
        },
      });
      if (updatedDraft.count === 0) {
        throw new AppError("Draft not found or cannot be updated", ERROR_CODES.NOT_FOUND);
      }
      return updatedDraft;
    } else {
      const newDraft = await prisma.registration.create({
        data: {
          provider_id,
          metadata: services,
          status: "DRAFT",
        },
      });
      return newDraft;
    }
  },

  getDraftsByProviderId: async (provider_id) => {
    const drafts = await prisma.registration.findMany({
      where: {
        provider_id,
        status: "DRAFT",
      },
    });
    if (drafts.length === 0) {
      throw new AppError("Draft not found", ERROR_CODES.NOT_FOUND);
    }
    return drafts;
  },

  getApplicantsByProviderId: async (provider_id) => {
    const applicants = await prisma.registration.findMany({
      where: {
        provider_id,
        status: {
          not: "DRAFT",
        },
      },
    });
    if (applicants.length === 0) {
      throw new AppError("Applicants not found", ERROR_CODES.NOT_FOUND);
    }
    return applicants;
  },

  deleteDraftById: async (id, provider_id) => {
    const draft = await prisma.registration.deleteMany({
      where: {
        id,
        provider_id,
        status: "DRAFT",
      },
    });
    if (draft.count === 0) {
      throw new AppError("Draft not found or cannot be deleted", ERROR_CODES.NOT_FOUND);
    }
    return draft;
  },

  getReviewedApplicantsByProviderId: async (provider_id) => {
    const reviewedApplicants = await prisma.registration.findMany({
      where: {
        provider_id,
        status: {
          not: ["DRAFT", "PENDING"],
        },
      },
      include: {
        approvalHistories: true,
      },
    });
    if (reviewedApplicants.length === 0) {
      throw new AppError("Reviewed applicants not found", ERROR_CODES.NOT_FOUND);
    }
    return reviewedApplicants;
  },

  updateApplicant: async (registration_id, provider_id, metadata) => {
    const registration = await prisma.registration.findUnique({
      where: {
        id: registration_id,
        provider_id,
      },
    });

    if (!registration) {
      throw new AppError("Registration not found", ERROR_CODES.NOT_FOUND);
    }

    if (registration.status !== "INFO_REQUIRED") {
      throw new AppError(
        "Cannot update registration unless status is INFO_REQUIRED",
        ERROR_CODES.BAD_REQUEST,
      );
    }
    const updatedRegistration = await prisma.registration.update({
      where: {
        id: registration_id,
      },
      data: {
        metadata,
        status: "PENDING",
      },
    });

    await prisma.approvalHistory.create({
      data: {
        registration_id,
        action: Action.UPDATE,
        by: ActionTaker.PROVIDER,
      },
    });

    return updatedRegistration;
  },

  // ADMIN
  getAllApplicants: async () => {
    const applicants = await prisma.registration.findMany({
      where: {
        status: {
          not: "DRAFT",
        },
      },
    });
    if (applicants.length === 0) {
      throw new AppError("Applicants not found", ERROR_CODES.NOT_FOUND);
    }
    return applicants;
  },

  // temporary function for admin to review applicant
  reviewApplicant: async (registration_id, status, admin_feedback) => {
    const registration = await prisma.registration.findUnique({
      where: {
        id: registration_id,
      },
    });
    if (!registration) {
      throw new AppError("Registration not found", ERROR_CODES.NOT_FOUND);
    }
    const updatedRegistration = await prisma.registration.update({
      where: {
        id: registration_id,
      },
      data: {
        status,
      },
    });

    await prisma.approvalHistory.create({
      data: {
        registration_id,
        action: mapStatusToAction(status),
        note: admin_feedback,
        by: ActionTaker.ADMIN,
      },
    });

    return updatedRegistration;
  },
};

module.exports = { PartnerRegistrationService };
