import mongoose from 'mongoose';

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

export default mongoose.model('Category', categoryModel);
