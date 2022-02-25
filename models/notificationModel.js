// make schema notification
const mongoose = require('mongoose');

const NotificationModel = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        imgProduct: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notifications', NotificationModel);
