const express = require('express');
const bannerCtrl = require('../controllers/bannerCtrl');

const router = express.Router();

router.get('/banner', bannerCtrl.get).post('/banner', bannerCtrl.store).get('/banner/:id', bannerCtrl.show);

router.delete('/banner/:id', bannerCtrl.delete).put('/banner/:id', bannerCtrl.update);

module.exports = router;
