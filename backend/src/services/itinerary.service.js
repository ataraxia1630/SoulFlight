const geminiService = require("./planner/gemini.service");
const photoService = require("./planner/photo.service");
const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");

const ItineraryService = {
  generate: async (traveler_id, data) => {
    const { destination, start_date, end_date, budget, preferences, special_request, title } = data;

    console.log(`Generating itinerary for traveler ${traveler_id} ...`);
    const aiItinerary = await geminiService.generateItinerary({
      destination,
      startDate: start_date,
      endDate: end_date,
      budget,
      preferences,
      specialRequests: special_request,
    });
    console.log("✅ AI generation complete");

    console.log("Fetching photos...");
    for (const day of aiItinerary.days) {
      for (const activity of day.activities) {
        const photo = await photoService.getActivityPhoto(
          activity.photoKeywords || activity.title,
          destination,
        );

        if (photo) {
          activity.photoUrl = photo.url;
          activity.photoSmallUrl = photo.urlSmall;
          activity.photographer = photo.photographer;
          activity.photoSource = photo.source;
        }

        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }
    console.log("✅ Photos fetched");

    console.log("💾 Saving to database...");
    const savedItinerary = await prisma.itinerary.create({
      data: {
        traveler_id,
        title: title || `${destination} Trip`,
        destination,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        budget,
        preferences,
        special_request,
        status: "DRAFT",
        ai_summary: aiItinerary.itinerarySummary,
        ai_tips: aiItinerary.travelTips || [],
        budget_breakdown: aiItinerary.budgetBreakdown,
        days: {
          create: aiItinerary.days.map((day) => ({
            day_number: day.dayNumber,
            date: new Date(day.date),
            theme: day.theme,
            activities: {
              create: day.activities.map((act, idx) => ({
                order: idx,
                time: act.time,
                duration: act.duration,
                title: act.title,
                exact_address: act.exactAddress,
                description: act.description,
                type: mapActivityType(act.type),
                source: "AI_GENERATED",
                latitude: act.coordinates?.lat,
                longitude: act.coordinates?.lon,
                estimated_cost: act.estimatedCost,
                price_level: act.priceLevel,
                estimated_rating: act.estimatedRating,
                popular_times: act.popularTimes,
                local_tips: act.localTips || [],
                photo_url: act.photoUrl,
                photo_small_url: act.photoSmallUrl,
                photographer: act.photographer,
                photo_source: act.photoSource,
                cuisine: act.cuisine,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: {
            activities: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { day_number: "asc" },
        },
      },
    });
    console.log("✅ Itinerary saved:", savedItinerary.id);

    return savedItinerary;
  },

  getAll: async (traveler_id, status, limit, offset) => {
    const where = { traveler_id };
    if (status) {
      where.status = status.toUpperCase();
    }

    const itineraries = await prisma.itinerary.findMany({
      where,
      include: {
        days: {
          include: {
            activities: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { day_number: "asc" },
        },
      },
      orderBy: { created_at: "desc" },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const total = await prisma.itinerary.count({ where });

    return {
      itineraries,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    };
  },

  getById: async (id, traveler_id) => {
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id,
        OR: [{ traveler_id }, { shared_with: { some: { shared_with_traveler_id: traveler_id } } }],
      },
      include: {
        days: {
          include: {
            activities: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { day_number: "asc" },
        },
        traveler: {
          select: {
            id: true,
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!itinerary) {
      throw new AppError(404, "Itinerary not found", "Itinerary not found");
    }

    return itinerary;
  },

  update: async (id, traveler_id, data) => {
    const { title, status, is_favorite, cover_image_url } = data;

    const existing = await prisma.itinerary.findFirst({
      where: { id, traveler_id },
    });

    if (!existing) {
      throw new AppError(
        404,
        "Itinerary not found or unauthorized",
        "Itinerary not found or unauthorized",
      );
    }

    const updated = await prisma.itinerary.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(status && { status: status.toUpperCase() }),
        ...(typeof is_favorite === "boolean" && { is_favorite }),
        ...(cover_image_url && { cover_image_url }),
      },
      include: {
        days: {
          include: { activities: true },
          orderBy: { day_number: "asc" },
        },
      },
    });

    return updated;
  },

  delete: async (id, traveler_id) => {
    const existing = await prisma.itinerary.findFirst({
      where: { id, traveler_id },
    });

    if (!existing) {
      throw new AppError(
        404,
        "Itinerary not found or unauthorized",
        "Itinerary not found or unauthorized",
      );
    }

    await prisma.itinerary.delete({ where: { id } });
  },

  addActivity: async (dayId, traveler_id) => {
    const day = await prisma.itineraryDay.findFirst({
      where: {
        id: dayId,
        itinerary: { traveler_id },
      },
      include: { activities: true },
    });

    if (!day) {
      throw new AppError(404, "Day not found or unauthorized", "Day not found or unauthorized");
    }

    const maxOrder = Math.max(...day.activities.map((a) => a.order), -1);

    const newActivity = await prisma.itineraryActivity.create({
      data: {
        day_id: dayId,
        order: maxOrder + 1,
        time: activityData.time,
        duration: activityData.duration,
        title: activityData.title,
        description: activityData.description,
        exact_address: activityData.exact_address,
        type: activityData.type || "OTHER",
        source: "USER_ADDED",
        estimated_cost: activityData.estimated_cost,
        latitude: activityData.latitude,
        longitude: activityData.longitude,
        user_notes: activityData.user_notes,
      },
    });
    return newActivity;
  },

  editActivity: async (activityId, traveler_id, updates) => {
    const activity = await prisma.itineraryActivity.findFirst({
      where: {
        id: activityId,
        day: { itinerary: { traveler_id } },
      },
    });

    if (!activity) {
      throw new AppError(404, "Day not found or unauthorized", "Day not found or unauthorized");
    }

    const updated = await prisma.itineraryActivity.update({
      where: { id: activityId },
      data: {
        ...(updates.time && { time: updates.time }),
        ...(updates.user_notes && { user_notes: updates.user_notes }),
        ...(typeof updates.is_completed === "boolean" && {
          is_completed: updates.is_completed,
        }),
        ...(updates.user_rating && { user_rating: updates.user_rating }),
        ...(updates.actual_cost !== undefined && {
          actual_cost: updates.actual_cost,
        }),
      },
    });

    return updated;
  },

  deleteActivity: async (activityId, traveler_id) => {
    const activity = await prisma.itineraryActivity.findFirst({
      where: {
        id: activityId,
        day: { itinerary: { traveler_id } },
      },
    });

    if (!activity) {
      throw new AppError(404, "Day not found or unauthorized", "Day not found or unauthorized");
    }

    await prisma.itineraryActivity.delete({ where: { id: activityId } });
  },

  alterActivity: async (activityId, traveler_id) => {
    const activity = await prisma.itineraryActivity.findFirst({
      where: {
        id: activityId,
        day: { itinerary: { traveler_id } },
      },
      include: {
        day: { include: { itinerary: true } },
      },
    });

    if (!activity) {
      throw new AppError(404, "Activity not found", "Activity not found");
    }

    console.log("🔄 Generating alternatives for:", activity.title);

    const alternativesData = await geminiService.generateAlternatives(
      activity,
      activity.day.itinerary.destination,
      activity.day.itinerary.preferences,
    );

    for (const alt of alternativesData.alternatives) {
      const photo = await photoService.getActivityPhoto(
        alt.photoKeywords || alt.title,
        activity.day.itinerary.destination,
      );
      if (photo) alt.photo = photo;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    return alternativesData;
  },

  replaceActivity: async (activityId, traveler_id, newData) => {
    const activity = await prisma.itineraryActivity.findFirst({
      where: {
        id: activityId,
        day: { itinerary: { traveler_id } },
      },
    });

    if (!activity) {
      throw new AppError(404, "Activity not found", "Activity not found");
    }

    const updated = await prisma.itineraryActivity.update({
      where: { id: activityId },
      data: {
        title: newData.title,
        exact_address: newData.exactAddress,
        description: newData.description,
        type: mapActivityType(newData.type),
        cuisine: newData.cuisine,
        estimated_cost: newData.estimatedCost,
        price_level: newData.priceLevel,
        latitude: newData.coordinates?.lat,
        longitude: newData.coordinates?.lon,
        estimated_rating: newData.estimatedRating,
        local_tips: newData.localTips || [],
        photo_url: newData.photo?.url,
        photo_small_url: newData.photo?.urlSmall,
        photographer: newData.photo?.photographer,
        photo_source: newData.photo?.source,
        source: "AI_GENERATED",
      },
    });

    return updated;
  },

  getReviews: async (activityId) => {
    const activity = await prisma.itineraryActivity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new AppError(404, "Activity not found", "Activity not found");
    }

    if (activity.cached_reviews) {
      return res.json(activity.cached_reviews);
    }

    console.log("💬 Generating reviews for:", activity.title);
    const reviewsData = await geminiService.generateReviews(activity);

    await prisma.itineraryActivity.update({
      where: { id: activityId },
      data: { cached_reviews: reviewsData },
    });

    return reviewsData;
  },

  share: async (id, traveler_id, share_with_traveler_id, can_edit) => {
    const itinerary = await prisma.itinerary.findFirst({
      where: { id, traveler_id },
    });

    if (!itinerary) {
      throw new AppError(404, "Itinerary not found", "Itinerary not found");
    }

    const shared = await prisma.sharedItinerary.create({
      data: {
        itinerary_id: id,
        shared_with_traveler_id: share_with_traveler_id,
        can_edit: can_edit || false,
      },
    });

    return shared;
  },
};

module.exports = { ItineraryService };

function mapActivityType(aiType) {
  const typeMap = {
    restaurant: "RESTAURANT",
    tourist_attraction: "ATTRACTION",
    attraction: "ATTRACTION",
    accommodation: "ACCOMMODATION",
    hotel: "ACCOMMODATION",
    transport: "TRANSPORT",
    shopping: "SHOPPING",
    shopping_mall: "SHOPPING",
    entertainment: "ENTERTAINMENT",
    park: "ATTRACTION",
    museum: "ATTRACTION",
  };
  return typeMap[aiType] || "OTHER";
}
