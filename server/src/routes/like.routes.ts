import { Router } from 'express';

import { registerLike, deleteLike } from '../controllers/like.controllers.js';

const router: Router = Router();

router.post('/like', registerLike);
router.delete('/unlike', deleteLike);

export default router;
