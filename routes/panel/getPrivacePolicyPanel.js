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
    const locale = db.collection("LOCALE");
    const message = db.collection("MESSAGE");

    if(err) return console.log(err);

    noty.find().toArray(function(err, resNoty){
      message.find({availability: false}).toArray(function(err, resMessage){
        users.find({email: (req.session.user === undefined)?false:req.session.user}).toArray(function(err, resUsers){
          locale.find({login: req.session.login}).toArray(function(err, resLocale){
            res.render('panel/privace_policy_panel.ejs',{                    
              sessionUser: resUsers[0],
              noty: resNoty,
              aboutData: resLocale[0],
              msg: resMessage     
            });
          });  
        }); 
      });
    });
  });      
});

module.exports = router;