const { Router } = require("express");
const { PartnerRegistrationController } = require("../controllers/partnerRegistration.controller");
const authorize = require("../middlewares/auth.middleware");

const router = Router();
router.use(authorize);

router.post("/applicants", PartnerRegistrationController.sendApplicant);

router.post("/drafts", PartnerRegistrationController.saveDraft);

router.get("/drafts", PartnerRegistrationController.getDrafts);

router.get("/applicants", PartnerRegistrationController.getApplicants);

router.delete("/drafts/:draft_id", PartnerRegistrationController.deleteDraft);

router.get("/applicants/reviewed", PartnerRegistrationController.getReviewedApplicants);

router.put("/applicants/:applicant_id", PartnerRegistrationController.updateApplicant);

router.get("/applicants/all", PartnerRegistrationController.getAllApplicants);

router.get("/applicants/:applicant_id", PartnerRegistrationController.getApplicantById);

router.post("/applicants/:applicant_id/review", PartnerRegistrationController.reviewApplicant);

module.exports = router;
