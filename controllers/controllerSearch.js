'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

var searchFunction = (req, res, next) => {
    mongoClient.connect(global.baseIP, { useNewUrlParser: true,textSearchEnabled:true } ,function(err, client){
      const db = client.db(global.baseName);
      const tovar  = db.collection("tovar");

      if(err) return console.log(err);

      tovar.find( { title: { $in: {$regex: req.body.name} } }).toArray(function(err, results){
        console.log(results);
       
            res.send({code:500, searchResult: JSON.stringify(results)})

        client.close();
      });
    });
  }


router.post('/search', searchFunction, function(req, res, next){});

module.exports = router;
