const mongoose = require('mongoose');

const categoryModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            default: 'agricultural',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Category', categoryModel);
