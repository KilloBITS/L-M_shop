"use strict";
const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.post("/sendmessage", function(req, res, next){
  console.log(req.body)
  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const msg = db.collection("MESSAGE");

    if(err) return console.log(err);

    msg.find().sort({AI: -1}).limit(1).toArray(function(err, resTov){
      var NEW_MESSAGE = req.body;
      NEW_MESSAGE.AI = (resTov.length === 0)?0:parseInt(resTov[0].AI) + 1;               
      NEW_MESSAGE.author = req.session.user;
      NEW_MESSAGE.availability = false;
      NEW_MESSAGE.date = global.getDate();
      msg.insertOne(NEW_MESSAGE);  
      res.send({code: 500, className: 'nSuccess', message: 'Сообщение успешно отправлено'});       
    });   
  });   
});

module.exports = router;
