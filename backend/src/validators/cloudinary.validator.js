const Joi = require("joi");

const folderSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9_/-]+$/)
  .optional()
  .default("uploads");

const singleUploadSchema = Joi.object({
  folder: folderSchema,
  image: Joi.any().custom((value, helpers) => {
    const { req } = helpers.prefs.context || {};
    if (!req?.file) {
      return helpers.error("any.required", { code: "IMAGE_REQUIRED" });
    }
    return value;
  }),
});

const multipleUploadSchema = Joi.object({
  folder: folderSchema,
  images: Joi.any().custom((value, helpers) => {
    const { req } = helpers.prefs.context || {};
    if (!req?.files || req.files.length === 0) {
      return helpers.error("any.required", { code: "IMAGES_REQUIRED" });
    }
    if (req.files.length > 10) {
      return helpers.error("array.max", { code: "TOO_MANY_IMAGES", limit: 10 });
    }
    return value;
  }),
});

const deleteSchema = Joi.object({
  public_id: Joi.string().required().error(new Error("PUBLIC_ID_REQUIRED")),
});

const multipleDeleteSchema = Joi.object({
  public_ids: Joi.array()
    .items(Joi.string().required())
    .min(2)
    .required()
    .error(new Error("PUBLIC_IDS_REQUIRED")),
});

const updateSchema = Joi.object({
  folder: folderSchema,
  old_public_id: Joi.string().optional(),
  image: Joi.any().custom((value, helpers) => {
    const { req } = helpers.prefs.context || {};
    if (!req?.file) {
      return helpers.error("any.required", { code: "IMAGE_REQUIRED" });
    }
    return value;
  }),
});

module.exports = {
  singleUploadSchema,
  multipleUploadSchema,
  deleteSchema,
  multipleDeleteSchema,
  updateSchema,
};
