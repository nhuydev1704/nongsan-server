const authCtrl = require('../controllers/authCtrl');
const express = require('express');
const auth = require('../middleware/auth');
const historySearchCtrl = require('../controllers/historySearchCtrl');

const router = express.Router();

router.post('/register', authCtrl.register);

router.post('/login', authCtrl.login);

router.post('/logout', authCtrl.logout);

router.post('/reset', auth, authCtrl.resetPassword);

router.get('/refresh_token', authCtrl.generateAccessToken);

router.get('/history_search', auth, historySearchCtrl.get).post('/history_search', historySearchCtrl.store);
router.delete('/history_search/:id', historySearchCtrl.delete);

module.exports = router;
