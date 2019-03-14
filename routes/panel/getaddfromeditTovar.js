'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

router.use(cookieParser());

router.get('/*', function(req, res, next){
  if(!req.session.admin){
    res.redirect('/');
    return
  }
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const noty = db.collection("NOTIFICATION");
    const users = db.collection("USERS");
    const tovar = db.collection("TOVAR");
    const config = db.collection("CONFIG");
    const manufacturers = db.collection("MANUFACTURERS");

    if(err) return console.log(err);

    noty.find().toArray(function(err, resNoty){
      users.find({email: (req.session.user === undefined)?false:req.session.user}).toArray(function(err, resUsers){  
        config.find().toArray(function(err, resConf){   
          manufacturers.find().toArray(function(err, resMan){   
            if(req.url.split('mode=')[1].split(',')[0] === 'edit'){
              tovar.find({AI: parseInt(req.url.split('mode=')[1].split(',')[1])}).toArray(function(err, resTovar){              
                res.render('panel/addTovar_panel.ejs',{                    
                  sessionUser: resUsers[0],
                  noty: resNoty,
                  tovarData: resTovar[0],
                  editMode: true,
                  config: resConf[0],
                  man: resMan
                });
              });  
                         
            }else{
              res.render('panel/addTovar_panel.ejs',{                    
                sessionUser: resUsers[0],
                noty: resNoty,              
                editMode: false,
                config: resConf[0],
                man: resMan
              });
            }    
          });   
        });
      }); 
    });    
  });      
});

module.exports = router;