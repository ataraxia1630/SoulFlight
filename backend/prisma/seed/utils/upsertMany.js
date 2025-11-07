async function upsertMany(_prisma, model, data, uniqueFields, beforeCreate) {
  for (const item of data) {
    const where = {};

    if (uniqueFields.length === 1) {
      where[uniqueFields[0]] = item[uniqueFields[0]];
    } else {
      where[uniqueFields.join("_")] = Object.fromEntries(uniqueFields.map((f) => [f, item[f]]));
    }

    const existing = await model.findUnique({ where }).catch(() => null);
    const record = beforeCreate ? await beforeCreate(item) : item;

    if (existing) {
      await model.update({
        where,
        data: record,
      });
    } else {
      await model.create({ data: record });
    }
  }
}

module.exports = { upsertMany };
