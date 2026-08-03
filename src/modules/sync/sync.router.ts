import { Router } from 'express';
import { SyncController } from './sync.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/status', SyncController.getStatus);
router.post('/trigger', SyncController.triggerSync);
router.post('/pause', SyncController.pauseQueue);
router.post('/resume', SyncController.resumeQueue);
router.post('/retry-failed', SyncController.retryFailed);

export default router;
