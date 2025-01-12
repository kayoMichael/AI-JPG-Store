import express from 'express';

import {
  register,
  signIn,
  signOut,
  authCheck,
  changePassword,
} from '../controllers/auth.controllers.js';

const router: express.Router = express.Router();

router.post('/register', register);
router.post('/signin', signIn);
router.get('/check', authCheck);
router.post('/logout', signOut);
router.put('/update', changePassword);

export default router;
