const CloudinaryService = require("../services/cloudinary.service");
const { ImageDTO, MultipleImagesDTO } = require("../dtos/cloudinary.dto");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

const CloudinaryController = {
  uploadSingle: catchAsync(async (req, res, _next) => {
    const { folder } = req.body;
    const result = await CloudinaryService.uploadSingle(req.file.buffer, {
      folder,
    });
    return res.status(201).json(ApiResponse.success(new ImageDTO(result)));
  }),

  uploadMultiple: catchAsync(async (req, res, _next) => {
    const { folder } = req.body;
    const results = await CloudinaryService.uploadMultiple(
      req.files.map((file) => file.buffer),
      { folder },
    );
    return res.status(201).json(ApiResponse.success(new MultipleImagesDTO(results)));
  }),

  uploadFromUrl: catchAsync(async (req, res, _next) => {
    const { url, folder } = req.body;
    const result = await CloudinaryService.uploadFromUrl(url, {
      folder,
    });
    return res.status(201).json(ApiResponse.success(new ImageDTO(result)));
  }),

  generateUrl: catchAsync(async (req, res, _next) => {
    const { public_id, width, height } = req.query;
    const url = CloudinaryService.generateUrl(public_id, {
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
    const response = {
      public_id,
      url,
      raw_url: CloudinaryService.generateUrl(public_id, { raw: true }),
    };
    return res.status(200).json(ApiResponse.success(response));
  }),

  deleteImage: catchAsync(async (req, res, _next) => {
    const { public_id } = req.body;
    await CloudinaryService.deleteImage(public_id);
    return res.status(200).json(ApiResponse.success());
  }),

  deleteMultiple: catchAsync(async (req, res, _next) => {
    const { public_ids } = req.body;
    await CloudinaryService.deleteMultiple(public_ids);
    return res.status(200).json(ApiResponse.success());
  }),

  updateImage: catchAsync(async (req, res, _next) => {
    const { old_public_id, folder } = req.body;
    if (old_public_id) {
      await CloudinaryService.deleteImage(old_public_id).catch(() => {});
    }
    const result = await CloudinaryService.uploadSingle(req.file.buffer, {
      folder,
    });
    return res.status(200).json(ApiResponse.success(new ImageDTO(result)));
  }),
};

module.exports = CloudinaryController;
