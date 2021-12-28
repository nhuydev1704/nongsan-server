import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authCtrl = {
    register: async (req, res) => {
        try {
            const { fullname, username, email, password, gender } = req.body;

            let newUserName = username.toLowerCase().replace(/ /g, '');

            const user_name = await Users.findOne({ username: newUserName });
            if (user_name) return res.status(400).json({ msg: 'Tài khoản đã tồn tại' });

            const user_email = await Users.findOne({ email });
            if (user_email) return res.status(400).json({ msg: 'Email đã tồn tại' });

            if (password.length < 6) return res.status(400).json({ msg: 'Mật khẩu phải ít hơn 6 ký tự' });

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = new Users({
                fullname,
                username: newUserName,
                email,
                password: passwordHash,
                gender,
            });

            const access_token = createAccessToken({ id: newUser._id });
            const refresh_token = createRefreshToken({ id: newUser._id });

            // create cookie refresh_token
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000,
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

            const user = await Users.findOne({ email }).populate('followers following', '-password');
            if (!user) return res.status(400).json({ msg: 'Email không tồn tại' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Mật khẩu không đúng' });

            const access_token = createAccessToken({ id: user._id });
            const refresh_token = createRefreshToken({ id: user._id });

            // create cookie refresh_token
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000,
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
            if (!refresh_token) return res.status(400).json({ msg: 'Hãy đăng nhập' });

            // verify refresh_token
            jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return res.status(400).json({ msg: 'Hãy đăng nhập' });

                // get user from payload
                const user = Users.findById(payload.id)
                    .select('-password')
                    .populate('followers following', '-password');
                if (!user) return res.status(400).json({ msg: 'Hãy đăng nhập' });

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
