const { Router } = require("express");
const { ItineraryController } = require("../controllers/itinerary.controller");
// const { createSchema, updateSchema } = require('../validators/menu.validator');
// const validate = require('../middlewares/validate.middleware');
const authorize = require("../middlewares/auth.middleware");

const router = Router();

router.post("/generate", authorize, ItineraryController.generate);
router.get("/", authorize, ItineraryController.getAll);
router.get("/:id", authorize, ItineraryController.getById);
router.patch("/:id", authorize, ItineraryController.update);
router.delete(":id", authorize, ItineraryController.delete);

router.post("/day/:dayId/activity", authorize, ItineraryController.addActivity);
router.patch("/activity/:activityId", authorize, ItineraryController.editActivity);
router.delete("/activity/:activityId", authorize, ItineraryController.deleteActivity);
router.post("/activity/:activityId/alternatives", authorize, ItineraryController.alterActivity);
router.put("/activity/:activityId/replace", authorize, ItineraryController.replaceActivity);
router.get("/activity/:activityId/reviews", authorize, ItineraryController.getReviews);
router.post("/:id/share", authorize, ItineraryController.share);

module.exports = router;
