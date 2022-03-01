const Notifications = require('../models/notificationModel');
const APIFeature = require('../service/APIFeature');
const notificationCtrl = {
    get: async (req, res) => {
        try {
            // const feature = new APIFeature(Notifications.find().populate('user'), req.query).filtering().paginating();

            // const notifications = await feature.query;

            const notifications = await Notifications.find().populate('user').sort({ createdAt: -1 });

            res.json({
                notifications,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    store: async (req, res) => {
        try {
            const newNotification = new Notifications({
                user: req.body.user,
                title: req.body.title,
                imgProduct: req.body.imgProduct,
            });
            await newNotification.save();
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = notificationCtrl;
