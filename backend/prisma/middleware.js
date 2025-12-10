const { PrismaClient } = require("@prisma/client");
const base = new PrismaClient();

async function updateServicePriceRange(prisma, serviceId) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      Rooms: { select: { price_per_night: true } },
      Tours: { select: { service_price: true } },
      Tickets: { select: { price: true } },
      Menus: {
        select: {
          MenuItems: { select: { price: true } },
        },
      },
    },
  });

  if (!service) return;

  const prices = [
    ...(service.Rooms ?? []).map((r) => Number(r.price_per_night)),
    ...(service.Tours ?? []).map((t) => Number(t.service_price)),
    ...(service.Tickets ?? []).map((t) => Number(t.price)),
    ...(service.Menus ?? []).flatMap((m) => (m.MenuItems ?? []).map((i) => Number(i.price))),
  ].filter((p) => typeof p === "number" && p > 0);

  if (prices.length === 0) {
    await prisma.service.update({
      where: { id: serviceId },
      data: { price_min: null, price_max: null },
    });
    return;
  }

  const price_min = Math.min(...prices);
  const price_max = Math.max(...prices);

  await prisma.service.update({
    where: { id: serviceId },
    data: { price_min, price_max },
  });
}

const prisma = base.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const targets = ["Room", "Tour", "Ticket", "MenuItem"];
        if (!targets.includes(model)) return query(args);

        const result = await query(args);

        if (["create", "update", "delete"].includes(operation)) {
          let serviceId = args.data?.service_id || args.where?.service_id || result?.service_id;

          if (!serviceId && model === "MenuItem") {
            const menuId = args.data?.menu_id || args.where?.menu_id || result?.menu_id;

            if (menuId) {
              const menu = await base.menu.findUnique({
                where: { id: menuId },
                select: { service_id: true },
              });
              serviceId = menu?.service_id;
            }
          }

          if (serviceId) await updateServicePriceRange(base, serviceId);
        }

        return result;
      },
    },
  },
});

module.exports = prisma;
