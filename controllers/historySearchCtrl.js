const HistorySearch = require('../models/historySearchModel');

const historySearchCtrl = {
    get: async (req, res) => {
        try {
            const historySearch = await HistorySearch.find({ user: req.user.id }).populate('user');
            res.json(historySearch);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const historySearch = await HistorySearch.findById(req.params.id);
            if (!historySearch) return res.status(404).json({ msg: 'Không tìm thấy historySearch' });

            await historySearch.remove();
            res.json({ msg: 'Xóa thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    store: async (req, res) => {
        try {
            const newHistorySearch = new HistorySearch({
                user: req.body.user,
                name: req.body.name,
            });
            await newHistorySearch.save();
            res.json({ msg: 'Thêm thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = historySearchCtrl;
