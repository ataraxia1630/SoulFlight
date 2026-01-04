const { PartnerRegistrationService } = require("../services/partnerRegistration.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

const PartnerRegistrationController = {
  sendApplicant: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const { services } = req.body;
    console.log("Received services:", services);
    const registration = await PartnerRegistrationService.sendApplicant(provider_id, services);
    res.status(200).json(ApiResponse.success(registration));
  }),

  saveDraft: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const { services, draft_id } = req.body;
    const draft = await PartnerRegistrationService.saveDraft(provider_id, services, draft_id);
    res.status(200).json(ApiResponse.success(draft));
  }),

  getDrafts: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const draft = await PartnerRegistrationService.getDraftsByProviderId(provider_id);
    res.status(200).json(ApiResponse.success(draft));
  }),

  getApplicants: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const applicants = await PartnerRegistrationService.getApplicantsByProviderId(provider_id);
    res.status(200).json(ApiResponse.success(applicants));
  }),

  deleteDraft: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const { draft_id } = req.params;
    await PartnerRegistrationService.deleteDraftById(draft_id, provider_id);
    res.status(200).json(ApiResponse.success(true, "Draft deleted successfully", null));
  }),

  getReviewedApplicants: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const applicants =
      await PartnerRegistrationService.getReviewedApplicantsByProviderId(provider_id);
    res.status(200).json(ApiResponse.success(applicants));
  }),

  updateApplicant: catchAsync(async (req, res, _next) => {
    const provider_id = req.user.id;
    const { applicant_id: registration_id } = req.params;
    const { metadata } = req.body;
    await PartnerRegistrationService.updateApplicant(registration_id, provider_id, metadata);
    res.status(200).json(ApiResponse.success());
  }),

  getAllApplicants: catchAsync(async (req, res, _next) => {
    const { status } = req.query;
    const applicants = await PartnerRegistrationService.getAllApplicants(status);
    console.log("Applicants fetched in controller:", applicants);
    res.status(200).json(ApiResponse.success(applicants));
  }),

  getApplicantById: catchAsync(async (req, res, _next) => {
    const { applicant_id } = req.params;
    const applicant = await PartnerRegistrationService.getApplicantById(applicant_id);
    res.status(200).json(ApiResponse.success(applicant));
  }),

  reviewApplicant: catchAsync(async (req, res, _next) => {
    const { applicant_id } = req.params;
    const { status, admin_feedback } = req.body;
    await PartnerRegistrationService.reviewApplicant(applicant_id, status, admin_feedback);
    res.status(200).json(ApiResponse.success());
  }),
};

module.exports = { PartnerRegistrationController };
