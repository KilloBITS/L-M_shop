'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/newPartnersNumber', function(req, res, next){
  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const LOGS = db.collection("LOGS");
    if(err) return console.log(err);

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd = '0'+dd
    }
    if(mm<10) {
        mm = '0'+mm
    }
    today = mm + '-' + dd + '-' + yyyy;

    var NEW_LOGS = {};
    NEW_LOGS.date = today;
    NEW_LOGS.type = 'Партнер';
    NEW_LOGS.text = 'Заказ звонка оффициального партнера';
    NEW_LOGS.number = req.body.number;

    LOGS.insertOne(NEW_LOGS);
    res.send({code: 500});
  });
});


module.exports = router;
