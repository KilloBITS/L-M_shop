'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());


var saveSocials = (req, res, next) => {
  if (global.isAdminParse(req)) 
    {
      mongoClient.connect(global.baseIP ,function(err, client){
       const db = client.db(global.baseName);
       const config  = db.collection("config");

       if(err) return console.log(err);

       config.find().toArray(function(err, results_config){
         console.log(results_config[0].socials);
         var newResConf = results_config[0].socials;
         newResConf[0].link = req.body.v;
         newResConf[1].link = req.body.i;
         newResConf[2].link = req.body.f;
         config.update({},{ $set : { socials: newResConf }},{ multi: true });
         res.send({code:500});
         client.close();

       });
      });
    }else{
      res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
    }
  };

router.post('/saveSocials', saveSocials, function(req, res, next){});

module.exports = router;
