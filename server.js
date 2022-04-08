const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const Comments = require('./models/commentModel');
const AllRouter = require('./routes/index.js');
const engines = require('consolidate');
const paypal = require('paypal-rest-sdk');

dotenv.config();

// midleware
const app = express();

// engine and config paypal
app.engine('ejs', engines.ejs);
app.set('views', './views');
app.set('view engine', 'ejs');

paypal.configure({
    mode: 'sandbox', //sandbox or live
    client_id: 'AVqNO5CdRg3P1RJrzEzXa1xJoPsX8Eqe2bJt5WCHunVuIa_B7oB_GZjbLlHVX2yzPiji8qsw49nUJybO',
    client_secret: 'EHQ2MxXRSkPPAZ_vmFoYUdwcP-bzSumHuvp1cmgEqj6rLB0MwL62R_fZqOKKPb9PIty-JWZ3SavRtB4W',
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/paypal', (req, res) => {
    var create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            return_url: 'https://nongsan-app.herokuapp.com/success',
            cancel_url: 'https://nongsan-app.herokuapp.com/cancel',
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: 'item',
                            sku: 'item',
                            price: '1.00',
                            currency: 'USD',
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: 'USD',
                    total: '1.00',
                },
                description: 'This is the payment description.',
            },
        ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log('Create Payment Response');
            console.log(payment);
            res.redirect(payment.links[1].href);
        }
    });
});

app.get('/success', (req, res) => {
    // res.send("Success");
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: 'USD',
                    total: '1.00',
                },
            },
        ],
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log('Get Payment Response');
            console.log(JSON.stringify(payment));
            res.render('success');
        }
    });
});

app.get('/cancel', (req, res) => {
    res.render('cancel');
});

// Api
app.use(
    cors({
        origin: 'https://thuyhang.cf',
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api', AllRouter.auth);
app.use('/api', AllRouter.user);
app.use('/api', AllRouter.product);
app.use('/api', AllRouter.category);
app.use('/api', AllRouter.payment);
app.use('/api', AllRouter.noti);
app.use('/api', AllRouter.banner);

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    },
});

let users = [];
io.on('connection', (socket) => {
    // console.log(socket.id + ' connected.')

    socket.on('joinRoom', (id) => {
        const user = { userId: socket.id, room: id };

        const check = users.every((user) => user.userId !== socket.id);

        if (check) {
            users.push(user);
            socket.join(user.room);
        } else {
            users.map((user) => {
                if (user.userId === socket.id) {
                    if (user.room !== id) {
                        socket.leave(user.room);
                        socket.join(id);
                        user.room = id;
                    }
                }
            });
        }
        // console.log(users)
        // console.log(socket.adapter.rooms)
    });

    socket.on('createComment', async (msg) => {
        const { username, content, product_id, createdAt, rating, send } = msg;

        const newComment = new Comments({
            username,
            content,
            product_id,
            createdAt,
            rating,
        });

        if (send === 'replyComment') {
            const { _id, username, content, product_id, createdAt, rating } = newComment;
            const comment = await Comments.findById(product_id);

            if (comment) {
                comment.reply.push({ _id, username, content, createdAt, rating });

                await comment.save();
                io.to(comment.product_id).emit('sendReplyCommentToClient', comment);
            }
        } else {
            await newComment.save();

            io.to(newComment.product_id).emit('sendCommentToClient', newComment);
        }
    });

    // socket.on('createNotification', async (noti) => {
    //     const { name, action, createdAt } = noti;

    //     const newNoti = new Notifications({
    //         name,
    //         action,
    //         createdAt,
    //     });

    //     io.emit('sendNotiToClient', newNoti);

    //     await newNoti.save();
    // });

    socket.on('disconnect', () => {
        // console.log(socket.id + ' disconnected.')
        // console.log(users)
        users = users.filter((user) => user.userId !== socket.id);
    });
});

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

http.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
