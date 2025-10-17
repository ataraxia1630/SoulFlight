const CloudinaryService = require("../services/cloudinary.service");
const {
  ImageResponseDTO,
  MultipleImagesResponseDTO,
} = require("../dtos/cloudinary.dto");
const catchAsync = require("../utils/catchAsync");

const CloudinaryController = {
  uploadSingle: catchAsync(async (req, res, next) => {
    const { folder } = req.body;

    const result = await CloudinaryService.uploadSingle(req.file.buffer, {
      folder,
    });

    const response = new ImageResponseDTO(result);
    res.status(201).json({
      status: "success",
      data: response,
    });
  }),

  uploadMultiple: catchAsync(async (req, res, next) => {
    const { folder } = req.body;

    const results = await CloudinaryService.uploadMultiple(
      req.files.map((file) => file.buffer),
      { folder }
    );

    const response = new MultipleImagesResponseDTO(results);
    res.status(201).json({
      status: "success",
      data: response,
    });
  }),

  generateUrl: catchAsync(async (req, res, next) => {
    const { public_id, width, height } = req.query;

    const url = CloudinaryService.generateUrl(public_id, {
      width: parseInt(width),
      height: parseInt(height),
    });

    const response = {
      public_id,
      url,
      raw_url: CloudinaryService.generateUrl(public_id, { raw: true }),
    };
    res.status(200).json({ status: "success", data: response });
  }),

  deleteImage: catchAsync(async (req, res, next) => {
    const { public_id } = req.body;
    await CloudinaryService.deleteImage(public_id);
    res.status(200).json({ status: "success" });
  }),

  deleteMultiple: catchAsync(async (req, res, next) => {
    const { public_ids } = req.body;
    await CloudinaryService.deleteMultiple(public_ids);
    res.status(200).json({ status: "success" });
  }),

  updateImage: catchAsync(async (req, res, next) => {
    const { old_public_id, folder } = req.body;

    if (old_public_id) {
      await CloudinaryService.deleteImage(old_public_id).catch(() => {});
    }

    const result = await CloudinaryService.uploadSingle(req.file.buffer, {
      folder,
    });

    const response = new ImageResponseDTO(result);
    res.status(200).json({ status: "success", data: response });
  }),
};

module.exports = CloudinaryController;
