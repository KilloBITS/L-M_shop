"use strict";
const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "message.from.the.site.lm@gmail.com",
        pass: "makaron1488"
    }
});

router.post("/sendMessage", function(req, res, next){
  console.log(req.body)

  let mailOptions = {
        from: "message.from.the.site.lm@gmail.com", // sender address
        to: "lm.store.shop@gmail.com", // list of receivers
        subject: req.body.myTheme + "ОТ " + req.body.MyName, // Subject line
        text:  req.body.message + "["+req.body.myEmail+"]", // plain text body
        // html: SHABLON_MESSAGE // html body
    };

  // let ml = new mailOptions("message.from.the.site.lm@gmail.com", "lm.store.shop@gmail.com", req.body.myTheme, SHABLON_MESSAGE + "]");
  transporter.sendMail(mailOptions, function (error, info) {
    res.send({code:500, msg: "Сообщение отправлено"});
  });
});

module.exports = router;
