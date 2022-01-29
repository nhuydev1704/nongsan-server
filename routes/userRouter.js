const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const express = require('express');

const router = express.Router();

router.get('/search', auth, userCtrl.searchUser);
router.get('/user/:id', auth, userCtrl.getUser);
router.patch('/addcart', auth, userCtrl.addCart);

module.exports = router;
