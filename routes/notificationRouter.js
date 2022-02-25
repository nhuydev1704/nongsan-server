const express = require('express');
const notificationCtrl = require('../controllers/notificationCtrl');

const router = express.Router();

router.get('/noti', notificationCtrl.get);
router.post('/noti', notificationCtrl.store);

module.exports = router;
