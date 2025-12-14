const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/ticket.controller");
const validate = require("../middlewares/validate.middleware");
const { createTicketSchema, updateTicketSchema } = require("../validators/ticket.validator");

router.get("/", TicketController.getAll);
router.post("/", validate(createTicketSchema), TicketController.create);
router.get("/:id", TicketController.getById);
router.put("/:id", validate(updateTicketSchema), TicketController.update);
router.delete("/:id", TicketController.delete);
router.get("/service/:serviceId", TicketController.getByService);
router.get("/provider/:providerId", TicketController.getByProvider);
router.get("/:ticketId/availability", TicketController.checkAvailability);
router.get("/available/:serviceId", TicketController.getAvailable);

module.exports = router;
