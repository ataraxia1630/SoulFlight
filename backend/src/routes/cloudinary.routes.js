const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  singleUploadSchema,
  multipleUploadSchema,
  deleteSchema,
  updateSchema,
  multipleDeleteSchema
} = require("../validators/cloudinary.validator");
const CloudinaryController = require("../controllers/cloudinary.controller");

router.post(
  "/single",
  upload.single("image"),
  validate(singleUploadSchema),
  CloudinaryController.uploadSingle
);

router.post(
  "/multiple",
  upload.array("images", 10),
  validate(multipleUploadSchema),
  CloudinaryController.uploadMultiple
);

router.get("/url", CloudinaryController.generateUrl);

router.delete("/", validate(deleteSchema), CloudinaryController.deleteImage);

router.delete(
  "/delete-multiple",
  validate(multipleDeleteSchema),
  CloudinaryController.deleteMultiple
);

router.put(
  "/",
  upload.single("image"),
  validate(updateSchema),
  CloudinaryController.updateImage
);

module.exports = router;
