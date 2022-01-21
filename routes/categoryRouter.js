const express = require('express');
const categoryCtrl = require('../controllers/categoryCtrl');

const router = express.Router();

router
    .get('/category', categoryCtrl.getAll)
    .post('/category', categoryCtrl.store)
    .post('/category/children', categoryCtrl.storeChildren);

module.exports = router;
