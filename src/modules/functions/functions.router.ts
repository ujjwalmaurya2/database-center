import { Router } from 'express';
import { FunctionsController } from './functions.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', FunctionsController.list);
router.post('/', FunctionsController.create);
router.patch('/:id', FunctionsController.update);
router.delete('/:id', FunctionsController.delete);
router.post('/:id/invoke', FunctionsController.invoke);

export default router;
