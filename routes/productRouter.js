const productCtrl = require('../controllers/productCtrl');

const auth = require('../middleware/auth');
const express = require('express');

const router = express.Router();

router
    .get('/product', productCtrl.getAllProducts)
    .post('/product', productCtrl.store)
    .get('/all_pro', productCtrl.getFullProducts);

router
    .put('/product/:id', productCtrl.updateProduct)
    .get('/product/:id', productCtrl.show)
    .put('/products/:id', productCtrl.update)
    .patch('/products/:id', productCtrl.reviews)
    .delete('/product/:id', productCtrl.delete);

module.exports = router;
