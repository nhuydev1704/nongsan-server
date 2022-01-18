import Users from '../models/userModel.js';

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
};

export default userCtrl;
