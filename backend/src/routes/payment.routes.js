const { Router } = require("express");
const PaymentController = require("../controllers/payment.controller");
const validate = require("../middlewares/validate.middleware");
const authorize = require("../middlewares/auth.middleware");
const requiredRoles = require("../middlewares/role.middleware");
const { createPaymentSchema } = require("../validators/payment.validator");

const router = Router();

router.get("/vnpay/return", PaymentController.handleVNPayReturn);
router.get("/vnpay/ipn", PaymentController.handleVNPayIPN);

router.use(authorize);
router.use(requiredRoles("TRAVELER"));

router.post("/", validate(createPaymentSchema), PaymentController.createPayment);
router.get("/", PaymentController.getPayments);
router.get("/:id", PaymentController.getPayment);

//Blockchain
const blockchainRouter = Router();

blockchainRouter.post(
  "/execute",
  authorize,
  requiredRoles("TRAVELER"),
  PaymentController.executeBlockchainPayment,
);

blockchainRouter.get("/balance/:walletAddress", authorize, PaymentController.getWalletBalance);

blockchainRouter.post(
  "/connect",
  authorize,
  requiredRoles("TRAVELER"),
  PaymentController.connectWallet,
);

blockchainRouter.post(
  "/disconnect",
  authorize,
  requiredRoles("TRAVELER"),
  PaymentController.disconnectWallet,
);

blockchainRouter.get(
  "/transactions",
  authorize,
  requiredRoles("TRAVELER"),
  PaymentController.getBlockchainTransactions,
);

blockchainRouter.get("/verify/:txHash", authorize, PaymentController.verifyTransaction);

router.use("/blockchain", blockchainRouter);

module.exports = router;
