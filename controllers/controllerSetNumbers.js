'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.get('/',function(req, res, next){
  console.log(req.query.phoneNumber);
  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const users = db.collection("users");
    if(err) return console.log(err);

    users.find({phone: req.query.phoneNumber}).toArray(function(err, results_usersEmail ){
      if(results_usersEmail.length === 0){
        users.update({ email: req.session.user },{$set: { phone_number: req.query.phoneNumber } });
        // res.send({code: 500});
        res.redirect('/profile');
      }else{
        // res.send({code: 450});
        res.redirect('/profile');
      }
    });
  });
});

module.exports = router;
