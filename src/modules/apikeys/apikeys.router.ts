import { Router } from 'express';
import { ApiKeysController } from './apikeys.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', ApiKeysController.list);
router.post('/', ApiKeysController.create);
router.delete('/:id', ApiKeysController.delete);

export default router;
