'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

var getTovars = (req, res, next) => {
  mongoClient.connect(global.baseIP, function(err, client){
      const db = client.db(global.baseName);
      const config = db.collection("tovar");

      if(err) return console.log(err);

     config.find().toArray(function(err, results_tovar){
       res.send({code: 500, tovarArr: results_tovar})
     });
  });
};


var setStars = (req, res, next) => {
  mongoClient.connect(global.baseIP ,function(err, client){
   const db = client.db(global.baseName);
   const tovar  = db.collection("tovar");

   if(err) return console.log(err);

   tovar.find( { AI: parseInt(req.body.id)}).toArray(function(err, results){

     tovar.updateOne({ AI: parseInt(req.body.id) },{
       $set: { popular: parseInt(req.body.ss) },
         $currentDate: { lastModified: true }
       });
       res.send({code:500});
   });
  });
};

router.post('/tovar', getTovars, function(req, res, next){});

router.post('/setStars', setStars, function(req, res, next){});

module.exports = router;
