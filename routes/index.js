const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
const paymentRouter = require('./paymentRouter');

const AllRouter = {
    auth: authRouter,
    user: userRouter,
    product: productRouter,
    category: categoryRouter,
    payment: paymentRouter,
};

module.exports = AllRouter;
