import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import productRouter from './productRouter.js';
import categoryRouter from './categoryRouter.js';

const AllRouter = {
    auth: authRouter,
    user: userRouter,
    product: productRouter,
    category: categoryRouter,
};

export default AllRouter;
