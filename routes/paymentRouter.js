const router = require('express').Router();
const paymentCtrl = require('../controllers/paymentCtrl');
const auth = require('../middleware/auth');

router.route('/payment').get(paymentCtrl.getPayments).post(auth, paymentCtrl.createPayment);

router.route('/payment/:id').put(auth, paymentCtrl.updatePayment).delete(paymentCtrl.deletePayment);

module.exports = router;
