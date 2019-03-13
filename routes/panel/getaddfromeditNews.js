'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

router.use(cookieParser());

router.get('/*', function(req, res, next){
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const noty = db.collection("NOTIFICATION");
    const users = db.collection("USERS");
    const news = db.collection("NEWS");

    if(err) return console.log(err);

    noty.find().toArray(function(err, resNoty){
      users.find({login: req.session.login}).toArray(function(err, resUsers){
          
          if(req.url.split('mode=')[1].split(',')[0] === 'edit'){
            news.find({AI: parseInt(req.url.split('mode=')[1].split(',')[1])}).toArray(function(err, resNews){
              console.log(resNews)
               res.render('panel/addNews_panel.ejs',{                    
                sessionUser: resUsers[0],
                noty: resNoty,
                newsData: resNews[0],
                editMode: true            
              });
            });           
          }else{
            res.render('panel/addNews_panel.ejs',{                    
              sessionUser: resUsers[0],
              noty: resNoty,              
              editMode: false
            });
          }     
         
      }); 
    });    
  });      
});

module.exports = router;