const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AllRouter = require('./routes/index.js');
dotenv.config();

// midleware
const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.json({ msg: 'Hello World' });
});

// Routes
app.use('/api', AllRouter.auth);
app.use('/api', AllRouter.user);
app.use('/api', AllRouter.product);
app.use('/api', AllRouter.category);
app.use('/api', AllRouter.payment);

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
