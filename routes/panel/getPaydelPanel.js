'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

router.use(cookieParser());

router.get('/', function(req, res, next){
  if(!req.session.admin){
    res.redirect('/');
    return
  }
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const noty = db.collection("NOTIFICATION");
    const users = db.collection("USERS");
    const paydel = db.collection("PAYMENTANDDELIVERY");

    if(err) return console.log(err);

    noty.find().toArray(function(err, resNoty){
      users.find({login: req.session.login}).toArray(function(err, resUsers){
        paydel.find({login: req.session.login}).toArray(function(err, resPaydel){
          res.render('panel/paydel_panel.ejs',{                    
            sessionUser: resUsers[0],
            noty: resNoty,
            paydelData: resPaydel[0]             
          });
        });
      }); 
    });    
  });      
});

module.exports = router;