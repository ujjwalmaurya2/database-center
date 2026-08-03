import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { RegisterDTO, LoginDTO, RefreshTokenDTO } from './auth.dto';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';

const router = Router();

router.post('/register', validateRequest(RegisterDTO), AuthController.register);
router.post('/login', validateRequest(LoginDTO), AuthController.login);
router.post('/refresh', validateRequest(RefreshTokenDTO), AuthController.refreshToken);
router.get('/me', authenticateJWT, AuthController.getProfile);
router.post('/logout', authenticateJWT, AuthController.logout);

// Protected admin endpoint example testing RBAC middleware
router.get('/admin-test', authenticateJWT, requireRole('ADMIN'), (req, res) => {
  res.json({ success: true, message: 'RBAC verification passed: Admin access granted' });
});

export default router;
