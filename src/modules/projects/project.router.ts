import { Router } from 'express';
import { ProjectController } from './project.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { CreateProjectDTO, UpdateProjectDTO, SetEnvVarDTO } from './project.dto';

const router = Router();

// All project routes require authentication
router.use(authenticateJWT);

router.post('/', validateRequest(CreateProjectDTO), ProjectController.create);
router.get('/', ProjectController.list);
router.get('/:id', ProjectController.getById);
router.patch('/:id', validateRequest(UpdateProjectDTO), ProjectController.update);
router.delete('/:id', requireRole('OWNER'), ProjectController.delete);
router.post('/:id/restore', requireRole('OWNER'), ProjectController.restore);

// Project Config & Env Vars Routes
router.get('/:id/env', ProjectController.getEnv);
router.post('/:id/env', validateRequest(SetEnvVarDTO), ProjectController.setEnv);
router.delete('/:id/env/:key', ProjectController.deleteEnv);

export default router;
