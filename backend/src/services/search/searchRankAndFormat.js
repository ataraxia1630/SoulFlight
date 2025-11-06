const { calculateRelevanceScore } = require("./calculateRelevanceScore");
const { UniversalSearchBuilder } = require("./UniversalSearchBuilder");
const { buildIntent } = require("./buildIntent");

const rankAndFormat = (items, intent, DTO) => {
  return DTO(
    items
      .map((i) => ({ ...i, _score: calculateRelevanceScore(i, intent) }))
      .sort((a, b) => b._score - a._score)
      .map(({ _score, ...i }) => i),
  );
};

const searchEntity = async (options) => {
  const { keyword, location, priceMin, priceMax, guests, filters, builderFn, prismaFn, DTO } =
    options;

  const intent = buildIntent(keyword, location, priceMin, priceMax, guests, filters);
  console.log(`Final Intent (${DTO.name}):`, intent);

  const builder = new UniversalSearchBuilder();
  if (builderFn) builderFn(builder, intent);

  const items = await prismaFn(builder.build());
  return rankAndFormat(items, intent, DTO);
};

module.exports = { searchEntity };
