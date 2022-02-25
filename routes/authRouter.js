const authCtrl = require('../controllers/authCtrl');
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', authCtrl.register);

router.post('/login', authCtrl.login);

router.post('/logout', authCtrl.logout);

router.post('/reset', auth, authCtrl.resetPassword);

router.get('/refresh_token', authCtrl.generateAccessToken);

module.exports = router;
