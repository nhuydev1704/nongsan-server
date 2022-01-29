const express = require('express');
const categoryCtrl = require('../controllers/categoryCtrl');

const router = express.Router();

router
    .get('/category', categoryCtrl.getAll)
    .post('/category', categoryCtrl.store)
    .post('/category/children', categoryCtrl.storeChildren);

router
    .delete('/category/:id', categoryCtrl.delete)
    .delete('/category/children/:id', categoryCtrl.deleteChildren)
    .put('/category/:id', categoryCtrl.update)
    .put('/category/children/:id', categoryCtrl.updateChildren);

module.exports = router;
