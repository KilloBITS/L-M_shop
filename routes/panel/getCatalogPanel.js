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
    const tovar = db.collection("TOVAR");
    const manufacturers = db.collection("MANUFACTURERS");
    const config = db.collection("CONFIG");

    if(err) return console.log(err);

    noty.find().toArray(function(err, resNoty){
      users.find({login: req.session.login}).toArray(function(err, resUsers){
        tovar.find().toArray(function(err, resTovar){
          manufacturers.find().toArray(function(err, resMan){   
            config.find().toArray(function(err, resConf){   
              res.render('panel/catalog_panel.ejs',{
                sessionUser: resUsers[0],
                noty: resNoty,
                tovarData: resTovar,
                manufactures: resMan,
                config: resConf[0]
              });
            });    
          });      
        });      
      });
    });    
  });      
});

module.exports = router;