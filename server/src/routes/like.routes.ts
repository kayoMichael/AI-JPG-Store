import { Router } from 'express';

import {
  registerLike,
  deleteLike,
  getLike,
  getUserLikes,
} from '../controllers/like.controllers.js';

const router: Router = Router();

router.post('/register', registerLike);
router.delete('/delete', deleteLike);
router.get('/get', getLike);
router.get('/getUserLike', getUserLikes);

export default router;
