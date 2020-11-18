const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/userModel');
const Books = require('../models/bookModel');
const ReadingLog = require('../models/readLogModel');
const ReadLogs = require('../models/readLogModel');

var zypherRouter = express.Router();
zypherRouter.use(express.json());

const getDuration = (millisecs) => {
    var seconds = millisecs / 1000;
    var hours = seconds / 3600;
    var minutes = ( seconds % 3600 ) / 60;
    seconds = ( seconds % 3600 ) % 60;
    var str = `DURATION HH:MM:SS- ${hours} : ${minutes} : ${seconds}`;
    return str;
};

zypherRouter.get('/read-time-user/:userId', (req, res, next) => {
    ReadingLog.find({ user : req.params.userId })
    .then((readLogs) => {
        if (readLogs && readLogs.length) {
            var oddCounter = 1;
            var readTime = 0;
            readLogs.forEach((readLog) => {
                if (oddCounter%2) {
                    startTime = readLog.timeStamp.getTime();
                }
                else {
                    endTime = readLog.timeStamp.getTime();
                    readTime += endTime - startTime;
                }
                oddCounter += 1;
            });
            //CONVERT TO TIME
            var str = getDuration(readTime);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({ "totalReadTimeInMilliseconds" : readTime, "total" : str });
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type','text/html');
            res.end("<h5>ERROR: USER HASN'T READ ANYTHING YET!</h5>");
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

zypherRouter.get('/total-users/:bookId', (req, res, next) => {
    ReadingLog.find({ book : req.params.bookId })
    .then((readLogs) => {
        if (readLogs && readLogs.length) {
            var listUsers = [];
            readLogs.forEach((readLog) => {
                if (listUsers.indexOf(readLog.user.toString()) === -1) {
                    listUsers.push(readLog.user.toString());
                }
            });
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({ "TotalUsersReadingThatBook" : listUsers.length });
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type','text/html');
            res.end("<h5>ERROR: BOOK HASN'T BEEN READ YET!</h5>");
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

zypherRouter.get('/total-reading-forday/:date', (req, res, next) => {
    var thatDate = new Date(req.params.date);
    var nextDate = new Date(thatDate.getTime() + 86400000);
    console.log(thatDate, nextDate);
    ReadingLog.find({ timeStamp : { $gte : thatDate, $lte : nextDate } })
    .then((readLogs) => {
        if (readLogs && readLogs.length) {            
            var userstart = [];
            var starttime = [];
            var userend = [];
            var endtime = [];
            readLogs.forEach((readLog) => {
                if (readLog.event_type === "start") {
                    userstart.push(readLog.user.toString());
                    starttime.push(readLog.timeStamp.getTime());
                }
                if (readLog.event_type === "end") {
                    userend.push(readLog.user.toString());
                    endtime.push(readLog.timeStamp.getTime());
                }
            });
            var counter = 0;
            var correspondingEnd;
            var totalReadTimeForDay = 0;
            userstart.forEach((user) => {
                correspondingEnd = userend.indexOf(user);
                if (correspondingEnd !== -1) {
                    totalReadTimeForDay += (endtime[correspondingEnd] - starttime[counter]);
                    userend.splice(correspondingEnd, 1);
                    endtime.splice(correspondingEnd, 1);
                }
                else {
                    totalReadTimeForDay += (nextDate - starttime[counter]);
                }
                counter += 1;
            });
            var str = getDuration(totalReadTimeForDay); //TO PRINT IN HH:MM:SS
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({ "ForDay" : req.params.date, "totalReadTime" : str });
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type','text/html');
            res.end("<h5>ERROR: NOBODY HAS READ ANYTHING ON THAT DAY!</h5>");
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

//TO POPULATE BOOKS AND READING LOGS
zypherRouter.post('/books', (req, res, next) => {
    Books.create(req.body)
    .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
    }, (err) => next(err))
    .catch((err) => next(err));
});

zypherRouter.post('/readlogs', (req, res, next) => {
    ReadLogs.create(req.body)
    .then((readLog) => {
        console.log(Date.now());
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(readLog);
    }, (err) => next(err))
    .catch((err) => next(err));
});

//GET TO VIEW DATABASE
zypherRouter.get('/books', (req, res, next) => {
    Books.find()
    .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
    }, (err) => next(err))
    .catch((err) => next(err));
});

zypherRouter.get('/readlogs', (req, res, next) => {
    ReadLogs.find()
    .then((readLog) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(readLog);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = zypherRouter;