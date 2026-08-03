import { Router } from 'express';
import { GoogleAuthController } from './auth.google.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.get('/google', GoogleAuthController.initiateAuth);
router.get('/google/callback', GoogleAuthController.handleCallback);
router.get('/google/status', authenticateJWT, GoogleAuthController.getStatus);
router.post('/google/disconnect', authenticateJWT, GoogleAuthController.disconnect);

export default router;
