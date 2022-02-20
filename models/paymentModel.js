const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        address: {
            type: Object,
            required: true,
        },
        cart: {
            type: Array,
            default: [],
        },
        priceCheckout: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            default: '1',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Payments', paymentSchema);
