const Category = require('../models/categoryModel');
const CategoryChildren = require('../models/categoryChildrenModel');
const categoryCtrl = {
    getAll: async (req, res) => {
        try {
            const categories = await Category.find();
            const children = await CategoryChildren.find();

            const listCategory = categories.map((category) => {
                const childrenCategory = children.filter((child) => child.parent === category._id.toString());
                return {
                    ...category._doc,
                    children: childrenCategory,
                };
            });

            res.json(listCategory);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    storeChildren: async (req, res) => {
        try {
            const { name, parent } = req.body;
            const category = new CategoryChildren({ name, parent });
            await category.save();
            res.json(category);
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
