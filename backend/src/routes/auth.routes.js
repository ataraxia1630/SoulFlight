const { Router } = require('express');
const { AuthController } = require('../controllers/auth.controller');

const router = Router();

// Sign up, log in với social media, type = google/facebook/twitter
router.post('/signup/:type', AuthController.signup);
router.post('/login/:type', AuthController.signup);

// Sign up: 4 bước: gửi otp qua mail -> (gửi lại otp) -> xác thực otp -> đăng ký
router.post('/send-otp', AuthController.sendOtp);
router.post('/resend-otp', AuthController.resendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/signup', AuthController.signup);

// Log in (chưa có quên mật khẩu -> reset)
router.post('/login', AuthController.login);

module.exports = router;
