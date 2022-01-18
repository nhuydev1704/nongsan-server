const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');

const AllRouter = {
    auth: authRouter,
    user: userRouter,
    product: productRouter,
    category: categoryRouter,
};

module.exports = AllRouter;
