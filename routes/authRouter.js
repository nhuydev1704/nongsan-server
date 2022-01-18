import authCtrl from '../controllers/authCtrl.js';
import express from 'express';

const router = express.Router();

router.post('/register', authCtrl.register);

router.post('/login', authCtrl.login);

router.post('/logout', authCtrl.logout);

router.get('/refresh_token', authCtrl.generateAccessToken);

export default router;
