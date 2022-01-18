import productCtrl from '../controllers/productCtrl.js';

import auth from '../middleware/auth.js';
import express from 'express';

const router = express.Router();

router.get('/product', productCtrl.getAllProducts).post('/product', productCtrl.store);

router.put('/product/:id', productCtrl.updateProduct);

export default router;
