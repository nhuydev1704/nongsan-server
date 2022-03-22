const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const express = require('express');
const commentCtrl = require('../controllers/commentCtrl');

const router = express.Router();

router.get('/comments/:id', commentCtrl.getComments);

router.get('/search', auth, userCtrl.searchUser);

router.get('/user_info', auth, userCtrl.getUser);

router.post('/user', auth, userCtrl.updateUser);

router.patch('/addcart', auth, userCtrl.addCart);

router.get('/history', auth, userCtrl.history);

router.post('/check_user', userCtrl.checkUser);

module.exports = router;
