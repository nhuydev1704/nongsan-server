import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AllRouter from './routes/index.js';
dotenv.config();

// midleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get('/', (rq, res) => {
    res.json({ msg: 'Hello World' });
});

// Routes
app.use('/api', AllRouter.auth);
app.use('/api', AllRouter.user);
app.use('/api', AllRouter.product);
app.use('/api', AllRouter.category);

const URI = process.env.MONGOO_URL;
mongoose.connect(
    URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('MongoDB Connected');
    }
);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
