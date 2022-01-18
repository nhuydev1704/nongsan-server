import userCtrl from '../controllers/userCtrl.js';
import auth from '../middleware/auth.js';
import express from 'express';

const router = express.Router();

router.get('/search', auth, userCtrl.searchUser);
router.get('/user/:id', auth, userCtrl.getUser);

export default router;
