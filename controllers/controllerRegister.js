'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/"; //url from mongoDB dataBase
const bParser = require('body-parser');
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'riznik.comment@gmail.com',
        pass: 'qazwsx159357'
    }
});

function mailOptions(a, b, c, d) {
    this.from = a, //'riznik.comment@gmail.com',
    this.to = b, //'mr.kalinuk@gmail.com',
    this.subject = c, //'Sending Email using Node.js',
    this.text = d;//'That was easy!';
}

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

var registrations = function(req, res, next)  {
  let userNEW = req.body.data;

};

router.post('/registrations', registrations, function(req, res, next){});

module.exports = router;
