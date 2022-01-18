import Users from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(500).json({ msg: 'Bạn không có quyền truy cập!' });

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) return res.status(500).json({ msg: 'Bạn không có quyền truy cập!' });

        const user = await Users.findOne({ _id: decoded.id });

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

export default auth;
