import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.get('/me', protect, getMe);

export default router;
