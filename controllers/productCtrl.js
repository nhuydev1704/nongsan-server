const Products = require('../models/productModel');
const APIFeature = require('../service/APIFeature');

const productCtrl = {
    getAllProducts: async (req, res) => {
        try {
            const feature = new APIFeature(Products.find().populate('category').populate('child_category'), req.query)
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
    show: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id).populate('category').populate('child_category');
            if (!product) return res.status(404).json({ msg: 'Không tìm thấy sản phẩm' });

            res.json({
                status: 'success',
                product,
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
                price_text: req.body.price_text,
                description: req.body.description,
                image: req.body.image,
                category: req.body.category,
                child_category: req.body.child_category,
            });
            await newProduct.save();
            res.json({ msg: 'Thêm thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id);
            if (!product) return res.status(404).json({ msg: 'Không tìm thấy sản phẩm' });

            product.title = req.body.title;
            product.price = req.body.price;
            product.price_text = req.body.price_text;
            product.description = req.body.description;
            product.image = req.body.image;
            product.category = req.body.category;
            product.child_category = req.body.child_category;

            await product.save();
            res.json({ msg: 'Cập nhật thành công' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id);
            if (!product) return res.status(404).json({ msg: 'Không tìm thấy sản phẩm' });

            await product.remove();
            res.json({ msg: 'Xóa thành công' });
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
    reviews: async (req, res) => {
        try {
            const { rating } = req.body;
            if (rating && rating !== 0) {
                const product = await Products.findById(req.params.id);
                if (!product) return res.status(400).json({ msg: 'Sản Phẩm Không Tồn Tại.' });

                let num = product.numReviewers;
                let rate = product.rating;

                await Products.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        rating: rate + rating,
                        numReviewers: num + 1,
                    }
                );

                res.json({ msg: 'Cập nhật thành công' });
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = productCtrl;
