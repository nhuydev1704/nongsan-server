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
            const caculatePriceProduct = products.map((product) => {
                // caculate price in discount
                return {
                    ...product._doc,
                    price_old: product.price,
                    price:
                        product.discount == 0
                            ? product.price
                            : product.price - (product.price * product.discount) / 100,
                };
            });
            

            res.json({
                status: 'success',
                result: products.length,
                products: caculatePriceProduct,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getFullProducts: async (req, res) => {
        try {
            const products = await Products.find().populate('category').populate('child_category');
            const caculatePriceProduct = products.map((product) => {
                // caculate price in discount
                return {
                    ...product._doc,
                    price_old: product.price,
                    price:
                        product.discount == 0
                            ? product.price
                            : product.price - (product.price * product.discount) / 100,
                };
            });

            res.json({
                status: 'success',
                result: products.length,
                products: caculatePriceProduct,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    show: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id).populate('category').populate('child_category');
            if (!product) return res.status(404).json({ msg: 'Kh??ng t??m th???y s???n ph???m' });

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
                discount: req.body.discount,
            });
            await newProduct.save();
            res.json({ msg: 'Th??m th??nh c??ng' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id);
            if (!product) return res.status(404).json({ msg: 'Kh??ng t??m th???y s???n ph???m' });

            product.title = req.body.title;
            product.price = req.body.price;
            product.price_text = req.body.price_text;
            product.description = req.body.description;
            product.image = req.body.image;
            product.category = req.body.category;
            product.child_category = req.body.child_category;
            product.discount = req.body.discount;

            await product.save();
            res.json({ msg: 'C???p nh???t th??nh c??ng' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id);
            if (!product) return res.status(404).json({ msg: 'Kh??ng t??m th???y s???n ph???m' });

            await product.remove();
            res.json({ msg: 'X??a th??nh c??ng' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    // update color in Products
    updateProduct: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ msg: 'Kh??ng t??m th???y s???n ph???m' });
            }
            product.color = req.body.color;
            product.textColor = req.body.textColor;
            await product.save();
            res.json({ msg: 'C???p nh???t th??nh c??ng', product: product });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    reviews: async (req, res) => {
        try {
            const { rating } = req.body;
            if (rating && rating !== 0) {
                const product = await Products.findById(req.params.id);
                if (!product) return res.status(400).json({ msg: 'S???n Ph???m Kh??ng T???n T???i.' });

                let num = product.numReviewers;
                let rate = product.rating;

                await Products.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        rating: rate + rating,
                        numReviewers: num + 1,
                    }
                );

                res.json({ msg: 'C???p nh???t th??nh c??ng' });
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = productCtrl;
