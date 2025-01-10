import express from 'express';

import { register, signIn, signOut, authCheck } from '../controllers/auth.controllers';

const router: express.Router = express.Router();

router.post('/register', register);
router.post('/signin', signIn);
router.get('/check', authCheck);
router.post('/logout', signOut);

export default router;
