const mongoose = require('mongoose');

const historySearchModel = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('HistorySearch', historySearchModel);
