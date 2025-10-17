const cloudinary = require("../configs/cloudinary");
const streamifier = require("streamifier");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const CloudinaryService = {
  generateUrl(publicId, options = {}) {
    try {
      const transformations = options.raw
        ? {}
        : [
            {
              width: options.width || 800,
              height: options.height || 600,
              crop: "fill",
              gravity: "auto",
            },
            { quality: "auto", format: "auto" },
          ];
      return cloudinary.url(publicId, {
        secure: true,
        transformation: transformations,
      });
    } catch (error) {
      throw new AppError(
        ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.statusCode,
        ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.message,
        ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.code
      );
    }
  },

  async uploadSingle(buffer, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || "uploads",
          resource_type: "auto",
          allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
          transformation: options.transformation || [],
        },
        (error, result) => {
          if (error) {
            reject(
              new AppError(
                ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.statusCode,
                ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.message,
                ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.code
              )
            );
          } else {
            resolve(result);
          }
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  },

  async uploadMultiple(buffers, options = {}) {
    try {
      return await Promise.all(
        buffers.map((buffer) => this.uploadSingle(buffer, options))
      );
    } catch (error) {
      throw error;
    }
  },

  async deleteImage(publicId) {
    if (!publicId) return true;
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== "ok") {
        throw new AppError(
          ERROR_CODES.IMAGE_NOT_FOUND.statusCode,
          ERROR_CODES.IMAGE_NOT_FOUND.message,
          ERROR_CODES.IMAGE_NOT_FOUND.code
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  },

  async deleteMultiple(publicIds) {
    try {
      const results = await Promise.all(
        publicIds.map((id) => this.deleteImage(id))
      );
      return results.every((success) => success);
    } catch (error) {
      throw error;
    }
  },

  async imageExists(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return !!result && result.resource_type !== "not_found";
    } catch {
      return false;
    }
  },
};

module.exports = CloudinaryService;
