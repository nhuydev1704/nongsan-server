const Category = require('../models/categoryModel');
const CategoryChildren = require('../models/categoryChildrenModel');
const Products = require('../models/productModel');
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
            res.json({ msg: 'Thêm thành công' });
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
    deleteChildren: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await CategoryChildren.findById(id);
            if (!category) return res.status(404).json({ msg: 'Không tìm thấy danh mục' });

            // remove product in category
            const products = await Products.find();
            const productsInCategory = products.filter((product) => product.child_category === category._id.toString());
            if (productsInCategory.length > 0) {
                // remove productsInCategory
                productsInCategory.forEach(async (product) => {
                    await Products.findByIdAndDelete(product._id);
                });
            }

            await CategoryChildren.findByIdAndDelete(id);
            res.json({ msg: 'Xóa thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) return res.status(404).json({ msg: 'Không tìm thấy danh mục' });
            const children = await CategoryChildren.find();
            const childrenCategory = children.filter((child) => child.parent === category._id.toString());
            if (childrenCategory.length > 0) {
                // remove childrenCategory
                childrenCategory.forEach(async (child) => {
                    await CategoryChildren.findByIdAndDelete(child._id);
                });
            }

            // remove product in category
            const products = await Products.find();
            const productsInCategory = products.filter((product) => product.category === category._id.toString());
            if (productsInCategory.length > 0) {
                // remove productsInCategory
                productsInCategory.forEach(async (product) => {
                    await Products.findByIdAndDelete(product._id);
                });
            }

            if (!category) {
                return res.status(404).json({ msg: 'Không tìm thấy danh mục' });
            }
            await category.remove();
            res.json({ msg: 'Xóa thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) return res.status(404).json({ msg: 'Không tìm thấy danh mục' });
            const { name, type } = req.body;
            await category.updateOne({ name, type });
            res.json({ msg: 'Cập nhật thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateChildren: async (req, res) => {
        try {
            const category = await CategoryChildren.findById(req.params.id);
            if (!category) return res.status(404).json({ msg: 'Không tìm thấy danh mục' });
            const { name, parent } = req.body;
            await category.updateOne({ name, parent });
            res.json({ msg: 'Cập nhật thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = categoryCtrl;
