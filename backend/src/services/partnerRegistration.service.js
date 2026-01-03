const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");
const { nanoid } = require("nanoid");
const RoomService = require("./room.service");
const { TourService } = require("./tour.service");
const { MenuService } = require("./menu.service");
const { MenuItemService } = require("./menuItem.service");
const TicketService = require("./ticket.service");

const Action = {
  SEND: "SEND",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  REQUIRE_INFO: "REQUIRE_INFO",
  UPDATE: "UPDATE",
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
  // ========== PROVIDER APIs ==========

  sendApplicant: async (provider_id, services) => {
    const registration = await prisma.registration.create({
      data: {
        id: nanoid(),
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

    return registration;
  },

  saveDraft: async (provider_id, services, draft_id) => {
    if (draft_id) {
      const existingDraft = await prisma.registration.findFirst({
        where: {
          id: draft_id,
          provider_id,
          status: RegistrationStatus.DRAFT,
        },
      });

      if (!existingDraft) {
        throw new AppError("Draft not found or cannot be updated", ERROR_CODES.NOT_FOUND);
      }

      const updatedDraft = await prisma.registration.update({
        where: { id: draft_id },
        data: { metadata: services },
      });

      return updatedDraft;
    } else {
      const newDraft = await prisma.registration.create({
        data: {
          id: nanoid(),
          provider_id,
          metadata: services,
          status: RegistrationStatus.DRAFT,
        },
      });
      return newDraft;
    }
  },

  getDraftsByProviderId: async (provider_id) => {
    const drafts = await prisma.registration.findMany({
      where: {
        provider_id,
        status: RegistrationStatus.DRAFT,
      },
      orderBy: { updated_at: "desc" },
    });
    return drafts;
  },

  getApplicantsByProviderId: async (provider_id) => {
    const applicants = await prisma.registration.findMany({
      where: {
        provider_id,
        status: {
          in: [RegistrationStatus.PENDING, RegistrationStatus.INFO_REQUIRED],
        },
      },
      include: {
        approvalHistories: {
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
      orderBy: { updated_at: "desc" },
    });
    return applicants;
  },

  deleteDraftById: async (id, provider_id) => {
    const draft = await prisma.registration.findFirst({
      where: { id, provider_id, status: RegistrationStatus.DRAFT },
    });

    if (!draft) {
      throw new AppError("Draft not found or cannot be deleted", ERROR_CODES.NOT_FOUND);
    }

    await prisma.registration.delete({ where: { id } });
    return { success: true };
  },

  getReviewedApplicantsByProviderId: async (provider_id) => {
    const reviewedApplicants = await prisma.registration.findMany({
      where: {
        provider_id,
        status: {
          in: [RegistrationStatus.APPROVED, RegistrationStatus.REJECTED],
        },
      },
      include: {
        approvalHistories: {
          orderBy: { created_at: "desc" },
        },
      },
      orderBy: { updated_at: "desc" },
    });
    return reviewedApplicants;
  },

  updateApplicant: async (registration_id, provider_id, metadata) => {
    const registration = await prisma.registration.findFirst({
      where: {
        id: registration_id,
        provider_id,
      },
    });

    if (!registration) {
      throw new AppError("Registration not found", ERROR_CODES.NOT_FOUND);
    }

    if (registration.status !== RegistrationStatus.INFO_REQUIRED) {
      throw new AppError(
        "Cannot update registration unless status is INFO_REQUIRED",
        ERROR_CODES.BAD_REQUEST,
      );
    }

    const updatedRegistration = await prisma.registration.update({
      where: { id: registration_id },
      data: {
        metadata,
        status: RegistrationStatus.PENDING,
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

  // ========== ADMIN APIs ==========

  getAllApplicants: async (status) => {
    const where = {
      status: {
        not: RegistrationStatus.DRAFT,
      },
    };

    if (status) {
      where.status = status;
    }
    const [applicants] = await Promise.all([
      prisma.registration.findMany({
        where,
        include: {
          approvalHistories: {
            orderBy: { created_at: "desc" },
          },
          provider: { include: { user: true } },
        },
        orderBy: { created_at: "desc" },
      }),
    ]);
    return applicants;
  },

  getApplicantById: async (registration_id) => {
    const applicant = await prisma.registration.findUnique({
      where: { id: registration_id },
      include: {
        approvalHistories: {
          orderBy: { created_at: "desc" },
        },
        provider: { include: { user: true } },
      },
    });

    if (!applicant) {
      throw new AppError("Registration not found", ERROR_CODES.NOT_FOUND);
    }

    return applicant;
  },

  reviewApplicant: async (registration_id, status, admin_feedback) => {
    const registration = await prisma.registration.findUnique({
      where: { id: registration_id },
    });

    if (!registration) {
      throw new AppError("Registration not found", ERROR_CODES.NOT_FOUND);
    }

    if (registration.status === RegistrationStatus.DRAFT) {
      throw new AppError("Cannot review draft applications", ERROR_CODES.BAD_REQUEST);
    }

    const updatedRegistration = await prisma.registration.update({
      where: { id: registration_id },
      data: { status },
    });

    await prisma.approvalHistory.create({
      data: {
        registration_id,
        action: mapStatusToAction(status),
        note: admin_feedback,
        by: ActionTaker.ADMIN,
      },
    });

    // If approved, create actual service records
    if (status === RegistrationStatus.APPROVED) {
      await this.createServicesFromRegistration(registration);
    }

    return updatedRegistration;
  },

  // ========== HELPER: Create Services from Approved Registration ==========
  createServicesFromRegistration: async (registration) => {
    const { metadata, provider_id } = registration;
    const services = Array.isArray(metadata) ? metadata : [metadata];

    for (const serviceData of services) {
      try {
        const {
          model,
          serviceName,
          description,
          location,
          formattedAddress,
          tags,
          modelTag,
          rooms,
          tours,
          menus,
          tickets,
        } = serviceData;

        const type = await prisma.serviceType.findUnique({
          where: { name: model },
        });

        const service = await prisma.service.create({
          data: {
            name: serviceName,
            description: description || null,
            location: formattedAddress || location,
            provider_id,
            model_tag: modelTag || null,
            type_id: type.id,
          },
        });

        if (tags && tags.length > 0) {
          await prisma.serviceOnTag.createMany({
            data: tags.map((tag_id) => ({
              service_id: service.id,
              tag_id: Number(tag_id),
            })),
            skipDuplicates: true,
          });
        }

        if (rooms && rooms.length > 0) {
          for (const room of rooms) {
            const roomFiles = await this._prepareImageFiles(room.images || []);

            const roomData = {
              service_id: service.id,
              name: room.name,
              description: room.description || null,
              price_per_night: Number(room.price),
              bed_number: Number(room.bedCount) || 1,
              max_adult_number: Number(room.guestAdult) || 2,
              max_children_number: Number(room.guestChild) || 0,
              pet_allowed: room.petAllowed || false,
              total_rooms: Number(room.totalRooms) || 1,
              size_sqm: room.size ? Number(room.size) : null,
              view_type: room.viewType || null,
            };

            await RoomService.create(roomData, roomFiles);
          }
        }

        if (tours && tours.length > 0) {
          for (const tour of tours) {
            const tourData = {
              service_id: service.id,
              name: tour.name,
              description: tour.description || null,
              service_price: Number(tour.price),
              total_price: Number(tour.price),
              start_time: new Date(tour.startTime),
              end_time: new Date(tour.endTime),
              max_participants: Number(tour.maxParticipants) || 10,
              places: tour.places || [],
              // thiếu tourplaces
            };

            await TourService.create(tourData);
          }
        }

        if (menus && menus.length > 0) {
          for (const menu of menus) {
            const coverFile = menu.coverImage
              ? await this._prepareImageFile(menu.coverImage)
              : null;

            const menuData = {
              service_id: service.id,
              name: menu.name,
              description: menu.description || null,
            };

            const createdMenu = await MenuService.create(menuData, coverFile);

            if (menu.items && menu.items.length > 0) {
              for (const item of menu.items) {
                const itemImageFile = item.image ? await this._prepareImageFile(item.image) : null;

                const itemData = {
                  menu_id: createdMenu.id,
                  name: item.name,
                  description: item.description || null,
                  price: Number(item.price),
                  unit: item.unit || "PORTION",
                  status: "AVAILABLE",
                };

                await MenuItemService.create(itemData, itemImageFile);
              }
            }
          }
        }

        if (tickets && tickets.length > 0) {
          for (const ticket of tickets) {
            const ticketData = {
              service_id: service.id,
              name: ticket.name,
              description: ticket.description || null,
              price: Number(ticket.price),
              place_id: Number(ticket.placeId),
            };

            await TicketService.create(ticketData);
          }
        }
      } catch (error) {
        console.error(`Failed to create service from registration:`, error);
        throw error;
      }
    }
  },

  // Helper: Convert base64 to file buffer for Cloudinary
  _prepareImageFile: async (base64String) => {
    if (!base64String || !base64String.startsWith("data:")) {
      return null;
    }

    try {
      const base64Data = base64String.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      return {
        buffer,
        mimetype: base64String.split(";")[0].split(":")[1],
      };
    } catch (error) {
      console.error("Failed to convert base64 to buffer:", error);
      return null;
    }
  },

  _prepareImageFiles: async (base64Array) => {
    if (!Array.isArray(base64Array) || base64Array.length === 0) {
      return [];
    }

    const files = [];
    for (const base64 of base64Array) {
      const file = await this._prepareImageFile(base64);
      if (file) {
        files.push(file);
      }
    }
    return files;
  },
};

module.exports = { PartnerRegistrationService };
