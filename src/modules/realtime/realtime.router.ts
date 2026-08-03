import { Router } from 'express';
import { RealtimeController } from './realtime.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/channels', RealtimeController.listChannels);
router.post('/broadcast', RealtimeController.broadcast);

export default router;
