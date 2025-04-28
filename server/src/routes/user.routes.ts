import express, { Router } from 'express';

import { upload } from '../config/storage.js';
import {
  getUser,
  getUserLimit,
  updateUser,
  updateUserProfileImage,
  useUserLimit,
} from '../controllers/user.controllers.js';
import requireAuth from '../middleware/auth.js';

const router: Router = express.Router();

router.get('/get/:userId', getUser);
router.patch('/update', requireAuth, updateUser);
router.patch(
  '/update-profile-image',
  requireAuth,
  upload.single('profileImage'),
  updateUserProfileImage
);
router.get('/limit', requireAuth, getUserLimit);
router.post('/limit/decrement', requireAuth, useUserLimit);

export default router;
