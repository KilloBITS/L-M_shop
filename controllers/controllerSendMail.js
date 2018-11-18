'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vernissage.developer@gmail.com',
        pass: 'kakabuba666'
    }
});

function mailOptions(a, b, c, d) {
    this.from = a, //'riznik.comment@gmail.com',
    this.to = b, //'mr.kalinuk@gmail.com',
    this.subject = c, //'Sending Email using Node.js',
    this.text = d;//'That was easy!';
}

router.post('/sendMessage', function(req, res, next){
  console.log(req.body)
  let ml = new mailOptions('vernissage.developer@gmail.com', 'vernissage-shop@ukr.net', req.body.myTheme, req.body.message + " [Моя почта для ответа: " +req.body.myEmail + "]");
  transporter.sendMail(ml, function (error, info) {

    res.send({code:500, msg: 'Сообщение отправлено'});

  });
});

module.exports = router;
