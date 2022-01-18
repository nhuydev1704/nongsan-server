import express from 'express';
import categoryCtrl from '../controllers/categoryCtrl.js';

const router = express.Router();

router.get('/category', categoryCtrl.getAll).post('/category', categoryCtrl.store);

export default router;
