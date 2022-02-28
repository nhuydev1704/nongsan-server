const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        price_text: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category',
        },
        child_category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'CategoryChildren',
        },
        numReviewers: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
        color: { type: String, default: 'fff' },
        textColor: { type: String, default: '#111' },
        discount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);
