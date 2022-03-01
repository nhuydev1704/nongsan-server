const Banner = require('../models/bannerModel');

const bannerCtrl = {
    get: async (req, res) => {
        try {
            const banner = await Banner.find();
            res.json(banner);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    show: async (req, res) => {
        try {
            const banner = await Banner.findById(req.params.id);
            if (!banner) return res.status(404).json({ msg: 'Không tìm thấy banner' });

            res.json(banner);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const banner = await Banner.findById(req.params.id);
            if (!banner) return res.status(404).json({ msg: 'Không tìm thấy banner' });

            banner.image = req.body.image;
            banner.category = req.body.category;
            banner.title = req.body.title;

            await banner.save();
            res.json({ msg: 'Cập nhật thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const banner = await Banner.findById(req.params.id);
            if (!banner) return res.status(404).json({ msg: 'Không tìm thấy banner' });

            await banner.remove();
            res.json({ msg: 'Xóa thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    store: async (req, res) => {
        console.log('req.body.category', req.body.category);
        try {
            const newBanner = new Banner({
                image: req.body.image,
                category: req.body.category,
                title: req.body.title,
            });
            await newBanner.save();
            res.json({ msg: 'Thêm thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = bannerCtrl;
