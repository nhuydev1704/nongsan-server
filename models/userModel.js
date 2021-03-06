const mongoose = require('mongoose');
// create userSchema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            maxlength: 25,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: 'https://res.cloudinary.com/hunre/image/upload/v1622344714/avatar/nvpczflysvbivmpmrr89.jpg',
        },
        role: {
            type: String,
            default: 'user',
        },
        gender: {
            type: String,
            default: 'male',
        },
        mobile: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            trim: true,
            default: '',
        },
        story: {
            type: String,
            default: '',
            maxlength: 200,
        },
        cart: {
            type: Array,
            default: [],
        },
        website: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
