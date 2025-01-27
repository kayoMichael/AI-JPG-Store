import express, { Router } from 'express';

import { upload } from '../config/storage.js';
import { getUser, updateUser, updateUserProfileImage } from '../controllers/user.controllers.js';
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

export default router;
