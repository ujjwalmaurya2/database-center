import { Router } from 'express';
import { StorageController } from './storage.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { parseFileUpload } from '../../middleware/upload.middleware';

const router = Router();

// Storage operations require authentication
router.use(authenticateJWT);

router.get('/status', StorageController.getStatus);
router.get('/quota', StorageController.getQuota);
router.post('/upload', parseFileUpload, StorageController.uploadFile);
router.get('/files/:id/download', StorageController.downloadFile);
router.patch('/files/:id', StorageController.renameFile);
router.delete('/files/:id', StorageController.deleteFile);

export default router;
