const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authCtrl = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const user_name = await Users.findOne({ username });
            if (user_name) return res.status(400).json({ msg: 'Tài khoản đã tồn tại' });

            const user_email = await Users.findOne({ email });
            if (user_email) return res.status(400).json({ msg: 'Email đã tồn tại' });

            if (password.length < 6) return res.status(400).json({ msg: 'Mật khẩu phải ít hơn 6 ký tự' });

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = new Users({
                username,
                email,
                password: passwordHash,
            });

            const access_token = createAccessToken({ id: newUser._id });
            const refresh_token = generateRefreshToken({ id: newUser._id }, res);

            await newUser.save();

            res.json({ msg: 'Đăng ký thành công', access_token, user: { ...newUser._doc, password: '' } });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'Email không tồn tại' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Mật khẩu không đúng' });

            const access_token = createAccessToken({ id: user._id });
            const refresh_token = generateRefreshToken({ id: user._id }, res);

            res.json({
                msg: 'Đăng nhập thành công',
                refresh_token,
                access_token,
                user: { ...user._doc, password: '' },
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    logout: async (req, res) => {
        try {
            // clear cookie
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
            return res.json({ msg: 'Đăng xuất thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    generateAccessToken: async (req, res) => {
        try {
            // get refresh_token from cookie
            // return res.json({ msg: req.cookies });
            const refresh_token = req.cookies.refreshtoken;
            if (!refresh_token) return res.status(401).json({ msg: 'Hãy đăng nhập' });

            // verify refresh_token
            jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
                if (err) return res.status(402).json({ msg: 'Hãy đăng nhập' });

                // get user from payload
                const user = await Users.findById(payload.id).select('-password');
                if (!user) return res.status(403).json({ msg: 'Hãy đăng nhập' });

                // create new access_token
                const access_token = createAccessToken({ id: payload.id });

                // return access_token
                return res.json({ user, access_token });
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;

            // check old password
            const user = await Users.findById(req.user.id);

            if (!user) return res.status(404).json({ msg: 'Không tìm thấy người dùng' });

            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isMatch) return res.status(401).json({ msg: 'Mật khẩu cũ không đúng' });

            const passwordHash = await bcrypt.hash(newPassword, 12);

            await Users.findOneAndUpdate(
                { _id: req.user.id },
                {
                    password: passwordHash,
                }
            );

            res.json({ msg: 'Đổi mật khẩu thành công!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};
const generateRefreshToken = (payload, res) => {
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    res.cookie('refreshtoken', refresh_token, {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        path: `/api/refresh_token`,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    return refresh_token;
};

const createAccessToken = (payload) => {
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    return access_token;
};

// create createRefreshToken
const createRefreshToken = (payload) => {
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
    return refresh_token;
};

module.exports = authCtrl;
