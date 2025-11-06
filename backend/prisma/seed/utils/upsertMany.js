async function upsertMany(_prisma, model, data, uniqueFields) {
  for (const item of data) {
    const where = {};
    if (uniqueFields.length === 1) {
      where[uniqueFields[0]] = item[uniqueFields[0]];
    } else {
      const compositeKey = uniqueFields.join("_");
      where[compositeKey] = {};
      for (const field of uniqueFields) {
        where[compositeKey][field] = item[field];
      }
    }

    const existing = await model.findUnique({ where }).catch(() => null);

    if (existing) {
      await model.update({
        where,
        data: item,
      });
    } else {
      await model.create({ data: item });
    }
  }
}

module.exports = { upsertMany };
