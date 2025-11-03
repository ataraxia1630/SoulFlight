async function upsertMany(_prisma, model, data, uniqueFields) {
  for (const item of data) {
    const where = {};
    uniqueFields.forEach((field) => {
      where[field] = item[field];
    });

    await model.upsert({
      where: { [`${uniqueFields.join("_")}`]: where },
      update: {},
      create: item,
    });
  }
}

module.exports = { upsertMany };
