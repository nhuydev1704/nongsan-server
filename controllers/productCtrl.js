const Products = require('../models/productModel');
const APIFeature = require('../service/APIFeature');

const productCtrl = {
    getAllProducts: async (req, res) => {
        try {
            const feature = new APIFeature(Products.find().populate('category'), req.query)
                .filtering()
                .sorting()
                .paginating();

            const products = await feature.query;

            res.json({
                status: 'success',
                result: products.length,
                products: products,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    store: async (req, res) => {
        try {
            const newProduct = new Products({
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                image: req.body.image,
                category: req.body.category,
            });
            await newProduct.save();
            res.json({ msg: 'Thêm thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    // update color in Products
    updateProduct: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ msg: 'Không tìm thấy sản phẩm' });
            }
            product.color = req.body.color;
            product.textColor = req.body.textColor;
            await product.save();
            res.json({ msg: 'Cập nhật thành công', product: product });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = productCtrl;
