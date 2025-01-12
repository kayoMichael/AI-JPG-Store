// user.routes.ts
import express, { Router } from 'express';

import { getUser, updateUser, updateUserProfileImage } from '../controllers/user.controllers.js';

const router: Router = express.Router();

router.get('/get/:userId', getUser);
router.patch('/update', updateUser);
router.patch('/update-profile-image', updateUserProfileImage);

export default router;
