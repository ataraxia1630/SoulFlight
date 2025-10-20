const cloudinary = require("../configs/cloudinary");
const streamifier = require("streamifier");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");
const { ImageDTO, MultipleImagesDTO } = require("../dtos/cloudinary.dto");

const DEFAULT_TRANSFORMATION = {
  width: 800,
  height: 600,
  crop: "fill",
  gravity: "auto",
};

const DEFAULT_QUALITY = {
  quality: "auto",
  format: "auto",
};

const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "gif", "webp"];
const DEFAULT_FOLDER = "uploads";

const CloudinaryService = {
  generateUrl(publicId, options = {}) {
    if (!publicId) {
      throw new AppError(
        ERROR_CODES.INVALID_INPUT.statusCode,
        ERROR_CODES.INVALID_INPUT.message,
        ERROR_CODES.INVALID_INPUT.code,
      );
    }

    const transformations = options.raw
      ? {}
      : [
          {
            ...DEFAULT_TRANSFORMATION,
            width: options.width || DEFAULT_TRANSFORMATION.width,
            height: options.height || DEFAULT_TRANSFORMATION.height,
          },
          DEFAULT_QUALITY,
        ];

    return cloudinary.url(publicId, {
      secure: true,
      transformation: transformations,
    });
  },

  _validateBuffer(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
      throw new AppError(
        ERROR_CODES.INVALID_INPUT.statusCode,
        ERROR_CODES.INVALID_INPUT.message,
        ERROR_CODES.INVALID_INPUT.code,
      );
    }
  },

  _getUploadConfig(options = {}) {
    return {
      folder: options.folder || DEFAULT_FOLDER,
      resource_type: "auto",
      allowed_formats: ALLOWED_IMAGE_FORMATS,
      transformation: options.transformation || [],
    };
  },

  uploadSingle(buffer, options = {}) {
    this._validateBuffer(buffer);

    return new Promise((resolve, reject) => {
      const uploadConfig = this._getUploadConfig(options);

      const uploadStream = cloudinary.uploader.upload_stream(uploadConfig, (error, result) => {
        if (error) {
          return reject(
            new AppError(
              ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.statusCode,
              ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.message,
              ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.code,
            ),
          );
        }

        result.generated_url = this.generateUrl(result.public_id, options);
        resolve(new ImageDTO(result));
      });

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  },

  _validateImageUrl(response) {
    if (!response.ok) {
      throw new AppError(
        ERROR_CODES.INVALID_URL.statusCode,
        ERROR_CODES.INVALID_URL.message,
        ERROR_CODES.INVALID_URL.code,
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("image")) {
      throw new AppError(
        ERROR_CODES.INVALID_URL.statusCode,
        ERROR_CODES.INVALID_URL.message,
        ERROR_CODES.INVALID_URL.code,
      );
    }
  },

  uploadFromUrl: async (url, options = {}) => {
    try {
      const response = await fetch(url);
      this._validateImageUrl(response);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return await this.uploadSingle(buffer, options);
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      throw new AppError(
        ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.statusCode,
        ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.message,
        ERROR_CODES.CLOUDINARY_UPLOAD_FAILED.code,
      );
    }
  },

  uploadMultiple: async (buffers, options = {}) => {
    const uploadPromises = buffers.map((buffer) => this.uploadSingle(buffer, options));
    const results = await Promise.all(uploadPromises);

    return new MultipleImagesDTO(results);
  },

  deleteImage: async (publicId) => {
    if (!publicId) {
      return true;
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new AppError(
        ERROR_CODES.IMAGE_NOT_FOUND.statusCode,
        ERROR_CODES.IMAGE_NOT_FOUND.message,
        ERROR_CODES.IMAGE_NOT_FOUND.code,
      );
    }

    return true;
  },

  deleteMultiple: async (publicIds) => {
    const deletePromises = publicIds.map((id) => this.deleteImage(id));
    const results = await Promise.all(deletePromises);

    return results.every((success) => success);
  },

  imageExists: async (publicId) => {
    try {
      const resource = await cloudinary.api.resource(publicId);
      return !!resource && resource.resource_type !== "not_found";
    } catch (error) {
      return false;
    }
  },
};

module.exports = CloudinaryService;
