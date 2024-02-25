const express = require('express');

const { loginController } = require('../controllers/auth/LoginController');
const { logoutController } = require('../controllers/auth/LogoutController');
const { checkBan, loginLimiter, requireJwtAuth } = require('../middleware');

const router = express.Router();

//Local
router.post('/logout', requireJwtAuth, logoutController);
router.post('/login', loginLimiter, checkBan, requireJwtAuth, loginController);
//router.post('/refresh', refreshController);
//router.post('/register', registerLimiter, checkBan, validateRegistration, registrationController);
//router.post('/requestPasswordReset', resetPasswordRequestController);
//router.post('/resetPassword', resetPasswordController);

module.exports = router;
