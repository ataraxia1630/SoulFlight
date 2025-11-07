const { Router } = require("express");
const { PartnerRegistrationController } = require("../controllers/partnerRegistration.controller");
// const validate = require('../middlewares/validate.middleware');

const router = Router();

router.post("/applicants", PartnerRegistrationController.sendApplicant);

router.post("/drafts", PartnerRegistrationController.saveDraft);

router.get("/drafts", PartnerRegistrationController.getDrafts);

router.get("/applicants", PartnerRegistrationController.getApplicants);

router.delete("/drafts/:draft_id", PartnerRegistrationController.deleteDraft);

router.get("/applicants/reviewed", PartnerRegistrationController.getReviewedApplicants);

router.put("/applicants/:applicant_id", PartnerRegistrationController.updateApplicant);

router.get("/applicants/all", PartnerRegistrationController.getAllApplicants);

router.post("/applicants/:applicant_id/review", PartnerRegistrationController.reviewApplicant);

module.exports = router;
