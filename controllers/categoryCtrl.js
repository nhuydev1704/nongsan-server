const Category = require('../models/categoryModel');

const categoryCtrl = {
    getAll: async (req, res) => {
        try {
            const categories = await Category.find();
            res.json(categories);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    store: async (req, res) => {
        try {
            const newCategory = new Category({
                name: req.body.name,
                type: req.body.type,
            });
            await newCategory.save();
            res.json({ msg: 'Thêm thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = categoryCtrl;
