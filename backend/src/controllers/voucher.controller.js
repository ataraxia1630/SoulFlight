const { VoucherService } = require("../services/voucher.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const { VoucherDTO } = require("../dtos/voucher.dto");

const VoucherController = {
  getAvailableVouchers: catchAsync(async (req, res) => {
    const { serviceId } = req.query;

    const vouchers = await VoucherService.getAvailableVouchers({
      serviceId: serviceId ? Number(serviceId) : null,
    });

    res.json(ApiResponse.success(VoucherDTO.fromList(vouchers)));
  }),

  checkVoucher: catchAsync(async (req, res) => {
    const { code, serviceId, totalAmount } = req.body;

    const result = await VoucherService.checkVoucher(
      code,
      serviceId ? Number(serviceId) : null,
      parseFloat(totalAmount) || 0,
    );

    res.json(
      ApiResponse.success({
        valid: result.valid,
        voucher: result.valid ? VoucherDTO.fromModel(result.voucher) : null,
        errors: result.errors,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      }),
    );
  }),

  getVoucher: catchAsync(async (req, res) => {
    const { id } = req.params;
    const voucher = await VoucherService.getVoucherById(Number(id));

    res.json(ApiResponse.success(VoucherDTO.fromModel(voucher)));
  }),
};

const ProviderVoucherController = {
  getMyVouchers: catchAsync(async (req, res) => {
    const providerId = req.user.id;
    const { status } = req.query;

    const vouchers = await VoucherService.getProviderVouchers(providerId, {
      status,
    });

    res.json(ApiResponse.success(VoucherDTO.fromList(vouchers)));
  }),

  createVoucher: catchAsync(async (req, res) => {
    const providerId = req.user.id;
    const voucher = await VoucherService.createVoucher(providerId, false, req.body);

    res.status(201).json(
      ApiResponse.success({
        message: "Voucher đã được tạo",
        voucher: VoucherDTO.fromModel(voucher),
      }),
    );
  }),

  updateVoucher: catchAsync(async (req, res) => {
    const providerId = req.user.id;
    const { id } = req.params;

    const voucher = await VoucherService.updateVoucher(Number(id), providerId, false, req.body);

    res.json(
      ApiResponse.success({
        message: "Voucher đã được cập nhật",
        voucher: VoucherDTO.fromModel(voucher),
      }),
    );
  }),

  deleteVoucher: catchAsync(async (req, res) => {
    const providerId = req.user.id;
    const { id } = req.params;

    await VoucherService.deleteVoucher(Number(id), providerId, false);

    res.json(
      ApiResponse.success({
        message: "Voucher đã được xóa",
      }),
    );
  }),

  getVoucherStats: catchAsync(async (req, res) => {
    const providerId = req.user.id;
    const { id } = req.params;

    const stats = await VoucherService.getVoucherStats(Number(id), providerId, false);

    res.json(ApiResponse.success(stats));
  }),
};

const AdminVoucherController = {
  getAllVouchers: catchAsync(async (req, res) => {
    const { status, isGlobal, serviceId } = req.query;

    const vouchers = await VoucherService.getAllVouchers({
      status,
      isGlobal,
      serviceId,
    });

    res.json(ApiResponse.success(VoucherDTO.fromList(vouchers)));
  }),

  createVoucher: catchAsync(async (req, res) => {
    const adminId = req.user.id;
    const voucher = await VoucherService.createVoucher(adminId, true, req.body);

    res.status(201).json(
      ApiResponse.success({
        message: "Voucher đã được tạo",
        voucher: VoucherDTO.fromModel(voucher),
      }),
    );
  }),

  updateVoucher: catchAsync(async (req, res) => {
    const adminId = req.user.id;
    const { id } = req.params;

    const voucher = await VoucherService.updateVoucher(Number(id), adminId, true, req.body);

    res.json(
      ApiResponse.success({
        message: "Voucher đã được cập nhật",
        voucher: VoucherDTO.fromModel(voucher),
      }),
    );
  }),

  deleteVoucher: catchAsync(async (req, res) => {
    const adminId = req.user.id;
    const { id } = req.params;

    await VoucherService.deleteVoucher(Number(id), adminId, true);

    res.json(
      ApiResponse.success({
        message: "Voucher đã được xóa",
      }),
    );
  }),

  getVoucherStats: catchAsync(async (req, res) => {
    const adminId = req.user.id;
    const { id } = req.params;

    const stats = await VoucherService.getVoucherStats(Number(id), adminId, true);

    res.json(ApiResponse.success(stats));
  }),
};

module.exports = {
  VoucherController,
  ProviderVoucherController,
  AdminVoucherController,
};
