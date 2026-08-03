import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/overview', AnalyticsController.getOverview);

export default router;
