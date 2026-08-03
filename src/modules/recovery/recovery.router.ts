import { Router } from 'express';
import { RecoveryController } from './recovery.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/snapshots', RecoveryController.list);
router.post('/snapshots', RecoveryController.create);
router.post('/snapshots/:id/rollback', RecoveryController.rollback);

export default router;
