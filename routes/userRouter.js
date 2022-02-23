const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const express = require('express');
const commentCtrl = require('../controllers/commentCtrl');

const router = express.Router();

router.get('/comments/:id', commentCtrl.getComments);

router.get('/search', auth, userCtrl.searchUser);
router.get('/user/:id', auth, userCtrl.getUser);

router.post('/user', auth, userCtrl.updateUser);

router.patch('/addcart', auth, userCtrl.addCart);

router.get('/history', auth, userCtrl.history);

module.exports = router;
