async function upsertMany(_prisma, model, data, uniqueField) {
  for (const item of data) {
    await model.upsert({
      where: { [uniqueField]: item[uniqueField] },
      update: {},
      create: item,
    });
  }
}

module.exports = { upsertMany };
