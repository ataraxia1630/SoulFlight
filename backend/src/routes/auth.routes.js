const { Router } = require("express");
const { AuthController } = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const {
  sendOtpSchema,
  verifyOtpSchema,
  createUserSchema,
  createTravelerSchema,
  createProviderSchema,
  loginSchema,
} = require("../validators/auth.validator");

const router = Router();

// Sign up, log in với social media, type = google/facebook/twitter
router.post("/signup/:type", AuthController.signupWithSocialMedia);
router.post("/login/:type", AuthController.loginWithSocialMedia);

// Sign up: 4 bước: gửi otp qua mail -> (gửi lại otp) -> xác thực otp -> đăng ký
router.post("/send-otp", validate(sendOtpSchema), AuthController.sendOtp);
router.post("/resend-otp", validate(sendOtpSchema), AuthController.resendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);
router.post("/create-user", validate(createUserSchema), AuthController.createUser);
router.post("/create-traveler", validate(createTravelerSchema), AuthController.createTraveler);
router.post("/create-provider", validate(createProviderSchema), AuthController.createProvider);

// Log in (chưa có quên mật khẩu -> reset)
router.post("/login", validate(loginSchema), AuthController.login);

module.exports = router;
