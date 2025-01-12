import express, { Router } from 'express';

import { upload } from '../config/storage.js';
import { getUser, updateUser, updateUserProfileImage } from '../controllers/user.controllers.js';

const router: Router = express.Router();

router.get('/get/:userId', getUser);
router.patch('/update', updateUser);
router.patch('/update-profile-image', upload.single('profileImage'), updateUserProfileImage);

export default router;
