import mongoose from 'mongoose';

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
        color: { type: String, default: 'rgb(168 85 247)' },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Product', productSchema);
