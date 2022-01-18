const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const express = require('express');

const router = express.Router();

router.get('/search', auth, userCtrl.searchUser);
router.get('/user/:id', auth, userCtrl.getUser);

module.exports = router;
