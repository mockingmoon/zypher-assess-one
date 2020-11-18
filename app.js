//MODULE IMPORTS
const express = require('express');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const dbconfig = require('./dbconfig');

//CONNECT TO MONGODB

//ROUTER IMPORTS
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const zypherRouter = require('./routes/zypher');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

//PATHS ROUTER
app.use('/',indexRouter);
app.use('/users',userRouter);
app.use('/zypher',zypherRouter);

//CONNECT TO MONGODB
//IMPORT MODELS
const url = dbconfig.mongoUrl;
const connect = mongoose.connect(url);

connect.then(() => {
    console.log('Connected to mongoDB server correctly.');
}, (err) => console.log(err));

module.exports = app;