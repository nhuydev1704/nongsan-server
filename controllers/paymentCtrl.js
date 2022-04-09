const Payments = require('../models/paymentModel');
const Users = require('../models/userModel');
const Products = require('../models/productModel');
const APIFeature = require('../service/APIFeature');

const paymentCtrl = {
    getPayments: async (req, res) => {
        try {
            const payment = new APIFeature(Payments.find(), req.query).filtering();

            const payments = await payment.query;
            res.json(payments);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updatePayment: async (req, res) => {
        try {
            const { id } = req.params;
            const payment = await Payments.findById(id);
            if (!payment) return res.status(400).json({ msg: 'Không tìm thấy giao dịch' });

            const { status } = req.body;

            // find id and update payment
            await Payments.findOneAndUpdate(
                { _id: id },
                {
                    status,
                }
            );

            res.json({ msg: 'Chuyển trạng thái thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deletePayment: async (req, res) => {
        try {
            const { id } = req.params;
            const payment = await Payments.findById(id);
            if (!payment) return res.status(400).json({ msg: 'Không tìm thấy giao dịch' });

            // find id and delete payment
            await Payments.findOneAndDelete({ _id: id });

            res.json({ msg: 'Xóa thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    createPayment: async (req, res) => {
        try {
            const user = await Users.findById(req.body.user).select('username email');

            if (!user) return res.status(400).json({ msg: 'User không tồn tại.' });

            const { cart, address, priceCheckout, name, phone, type } = req.body;
            const { _id, email } = user;
            const newPayment = new Payments({
                user_id: _id,
                name,
                phone,
                email,
                address,
                cart,
                priceCheckout,
                status: type === 'payment' ? '2' : '1',
                type,
            });

            cart.filter((item) => {
                return sold(item._id, item.quantity, item.sold);
            });

            await newPayment.save();

            res.json({ msg: 'Đặt hàng thành công!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

const sold = async (id, quantity, oldSold) => {
    await Products.findOneAndUpdate(
        { _id: id },
        {
            sold: quantity + oldSold,
        }
    );
};

module.exports = paymentCtrl;
