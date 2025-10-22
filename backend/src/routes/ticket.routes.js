const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/ticket.controller");
const validate = require("../middlewares/validate.middleware");
const { createTicketSchema, updateTicketSchema } = require("../validators/ticket.validator");

router.get("/", TicketController.getAll);
router.post("/", validate(createTicketSchema), TicketController.create);
router.get("/:id", TicketController.getOne);
router.put("/:id", validate(updateTicketSchema), TicketController.update);
router.delete("/:id", TicketController.delete);

module.exports = router;
