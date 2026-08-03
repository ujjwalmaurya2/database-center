import { Router } from 'express';
import { DatabaseController } from './database.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/tables', DatabaseController.getTables);
router.get('/tables/:name/data', DatabaseController.getTableData);
router.post('/query', DatabaseController.query);

export default router;
