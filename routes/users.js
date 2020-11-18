const express = require('express');
const Users = require('../models/userModel');

var userRouter = express.Router();
userRouter.use(express.json());

userRouter.get('/', (req, res, next) => {
    Users.find()
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(user);
    })
});

userRouter.route('/login')
.get((req, res, next) => {
    res.statusCode = 404;
    res.setHeader('Content-Type','text/html');
    res.end('<h3>GET method not supported for login!</h3>');
})
.post((req, res, next) => {
    Users.find({ username : req.body.username })
    .then((user) => {
        if (user.length) {
            if (user[0].password === req.body.password) {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({ "user":user[0], "loggedin":true });
            }
            else {
                res.statusCode = 403;
                res.setHeader('Content-Type','text/html');
                res.end('<h1>Password is incorrect!</h1>');
            }
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type','text/html');
            res.end('<h1>User does not exist!</h1>');
        }
    }, (err) => console.log(err))
    .catch((err) => console.log(err));
});

userRouter.post('/signup', (req, res, next) => {
    Users.find({ username : req.body.username })
    .then((user) => {
        if (!user.length) {
            Users.create({
                username:req.body.username,
                password: req.body.password
            })
            .then((user) => {
                if (user) {
                    console.log('Created USER: ', user);
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(user);
                }
                else {
                    console.log('No user created.');
                    res.statusCode = 500;
                    res.setHeader('Content-Type','text/plain');
                    res.end('No user created.');
                }        
            }, (err) => console.log(err));
        }
        else {
            res.statusCode = 500;
            res.setHeader('Content-Type','text/plain');
            res.end('Username already exists.');
        }
    }, (err) => console.log(err))
    .catch((err) => console.log(err));
});

module.exports = userRouter;