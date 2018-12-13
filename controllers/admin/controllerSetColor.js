'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

var getCounters = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
    {
      mongoClient.connect(global.baseIP ,function(err, client){
       const db = client.db(global.baseName);
       const tovar  = db.collection("tovar");
       const tovaruk  = db.collection("tovar-uk");
       if(err) return console.log(err);
       tovar.update({ AI: parseInt(req.body.id) },{$set: {color: req.body.colors}});
       tovaruk.update({ AI: parseInt(req.body.id) },{$set: {color: req.body.colors}});


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
       NEW_LOGS.type = 'Изменение цвета товара';
       NEW_LOGS.user = req.session.user;
       NEW_LOGS.text = 'Товар: '+parseInt(req.body.id);
       NEW_LOGS.setColor = req.body.colors;
       LOGS.insertOne(NEW_LOGS);


       res.send({code: 500, message: 'Цвет успешно изменен'})
      });
    }else{
      res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
    }

};


router.post('/tovarSetColor', getCounters, function(req, res, next){});

module.exports = router;
