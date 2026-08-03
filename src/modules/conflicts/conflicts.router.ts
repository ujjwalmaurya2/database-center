import { Router } from 'express';
import { ConflictsController } from './conflicts.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', ConflictsController.list);
router.get('/:id/diff', ConflictsController.getDiff);
router.post('/:id/resolve', ConflictsController.resolve);

export default router;
