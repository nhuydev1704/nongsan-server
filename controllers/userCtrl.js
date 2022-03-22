const Users = require('../models/userModel');
const Payments = require('../models/paymentModel');
const APIFeature = require('../service/APIFeature');

const userCtrl = {
    // create function search user
    searchUser: async (req, res) => {
        const { username } = req.query;
        try {
            const user = await Users.find({ username: { $regex: username } })
                .limit(10)
                .select('fullname username avatar');

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    // create function get user
    getUser: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await Users.findById(id).select('-password');
            if (!user) return res.status(500).json({ msg: 'Không tìm thấy người dùng' });

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(400).json({ msg: 'User không tồn tại.' });

            await Users.findOneAndUpdate(
                { _id: req.user.id },
                {
                    cart: req.body.cart,
                }
            );

            return res.json({ msg: 'Thêm giỏ hàng thành công' });
        } catch (err) {
            return res.status(500).json({ msgerr: err.message });
        }
    },
    checkUser: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'Tài khoản không tồn tại, Đăng ký.' });

            return res.json({ msg: 'User tồn tại.' });
        } catch (err) {
            return res.status(500).json({ msgerr: err.message });
        }
    },
    history: async (req, res) => {
        try {
            const history = new APIFeature(Payments.find({ user_id: req.user.id }), req.query).filtering();

            const historys = await history.query;

            res.json(historys);
        } catch (err) {
            return res.status(500).json({ msgerr: err.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(400).json({ msg: 'User không tồn tại.' });

            await Users.findOneAndUpdate(
                { _id: req.user.id },
                {
                    username: req.body.username,
                    mobile: req.body.phone,
                    address: req.body.address,
                    avatar: req.body.avatar,
                    website: req.body.website,
                    story: req.body.story,
                    gender: req.body.gender,
                }
            );

            return res.json({ msg: 'Cập nhật thành công' });
        } catch (err) {
            return res.status(500).json({ msgerr: err.message });
        }
    },
};

module.exports = userCtrl;
