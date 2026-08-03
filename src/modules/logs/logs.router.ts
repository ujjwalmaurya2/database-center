import { Router } from 'express';
import { LogsController } from './logs.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', LogsController.list);

export default router;
