import express, { Router } from 'express';

import { upload } from '../config/storage.js';
import {
  getImagesById,
  getAllImages,
  deleteImage,
  register,
} from '../controllers/image.controllers.js';
import requireAuth from '../middleware/auth.js';

const router: Router = express.Router();

router.post('/create', requireAuth, upload.single('image'), register);
router.get('/get/:imageId', getImagesById);
router.delete('/delete/:imageId', requireAuth, deleteImage);
router.get('/get', getAllImages);

export default router;
