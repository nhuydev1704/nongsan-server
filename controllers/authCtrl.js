import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
            const refresh_token = createRefreshToken({ id: newUser._id });

            // create cookie refresh_token
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: `/api/refresh_token`,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
            });

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
            const refresh_token = createRefreshToken({ id: user._id });

            // create cookie refresh_token
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: `/api/refresh_token`,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
            });

            res.json({ msg: 'Đăng nhập thành công', access_token, user: { ...user._doc, password: '' } });
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

export default authCtrl;
