import { Router } from 'express';

import { registerLike, getLike, getUserLikes } from '../controllers/like.controllers.js';

const router: Router = Router();

router.post('/register', registerLike);
router.get('/get', getLike);
router.get('/getUserLike', getUserLikes);

export default router;
