const mongoose = require('mongoose');

const bannerModel = new mongoose.Schema(
    {
        image: {
            type: String,
        },
        category: {
            type: String,
        },
        title: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Banner', bannerModel);
