const { PartnerRegistrationService } = require("../services/partnerRegistration.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

const PartnerRegistrationController = {
  sendApplicant: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const { services } = req.body;
    await PartnerRegistrationService.sendApplicant(provider_id, services);
    res.status(200).json(new ApiResponse(true, "Applicant sent successfully", null));
  }),

  saveDraft: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const { services, draft_id } = req.body;
    await PartnerRegistrationService.saveDraft(provider_id, services, draft_id);
    res.status(200).json(new ApiResponse(true, "Draft saved successfully", null));
  }),

  getDrafts: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const draft = await PartnerRegistrationService.getDraftsByProviderId(provider_id);
    res.status(200).json(new ApiResponse(true, "Draft retrieved successfully", draft));
  }),

  getApplicants: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const applicants = await PartnerRegistrationService.getApplicantsByProviderId(provider_id);
    res.status(200).json(new ApiResponse(true, "Applicants retrieved succe ssfully", applicants));
  }),

  deleteDraft: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const { draft_id } = req.params;
    await PartnerRegistrationService.deleteDraftById(draft_id, provider_id);
    res.status(200).json(new ApiResponse(true, "Draft deleted successfully", null));
  }),

  getReviewedApplicants: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const applicants =
      await PartnerRegistrationService.getReviewedApplicantsByProviderId(provider_id);
    res
      .status(200)
      .json(new ApiResponse(true, "Reviewed applicants retrieved successfully", applicants));
  }),

  updateApplicant: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const { applicant_id: registration_id } = req.params;
    const { metadata } = req.body;
    await PartnerRegistrationService.updateApplicant(registration_id, provider_id, metadata);
    res.status(200).json(new ApiResponse(true, "Applicant updated successfully", null));
  }),

  getAllApplicants: catchAsync(async (_req, res, _next) => {
    const applicants = await PartnerRegistrationService.getAllApplicants();
    res
      .status(200)
      .json(new ApiResponse(true, "All applicants retrieved successfully", applicants));
  }),

  reviewApplicant: catchAsync(async (req, res, _next) => {
    const { registration_id, status, admin_feedback } = req.body;
    await PartnerRegistrationService.reviewApplicant(registration_id, status, admin_feedback);
    res.status(200).json(new ApiResponse(true, "Applicant reviewed successfully", null));
  }),
};

module.exports = { PartnerRegistrationController };
