const mongoose = require('mongoose');

const childrenCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        parent: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('CategoryChildren', childrenCategorySchema);
