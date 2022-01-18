const productCtrl = require('../controllers/productCtrl');

const auth = require('../middleware/auth');
const express = require('express');

const router = express.Router();

router.get('/product', productCtrl.getAllProducts).post('/product', productCtrl.store);

router.put('/product/:id', productCtrl.updateProduct);

module.exports = router;
