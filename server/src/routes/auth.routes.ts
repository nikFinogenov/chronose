import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
// import { authMiddleware } from '../middlewares/Auth';

const router = Router();


// Register route
router.post('/register', AuthController.register.bind(AuthController));

// Confirm email route
router.get('/confirm-email/:token', AuthController.confirmEmail.bind(AuthController));

// Login route
router.post('/login', AuthController.login.bind(AuthController));

// Logout route with middleware
router.post('/logout', AuthController.logout.bind(AuthController));

// Password reset request route
router.post('/password-reset', AuthController.sendResetLink.bind(AuthController));

// Confirm new password route
router.post('/password-reset/:token', AuthController.confirmNewPassword.bind(AuthController));

export default router;
