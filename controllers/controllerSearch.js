'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());
 
function findPartial( a, s )
{
  
console.log(test);
}

var searchFunction = (req, res, next) => {
    mongoClient.connect(global.baseIP, { useNewUrlParser: true,textSearchEnabled:true } ,function(err, client){
      const db = client.db(global.baseName);
      const tovar  = db.collection("TOVAR");

      if(err) return console.log(err);

      tovar.find().toArray(function(err, results){
        var resultArray = [];
        results.forEach(function(item, i, arr) {
          
          if(item.title.toUpperCase().indexOf(req.body.name.toUpperCase()) !== -1){
            resultArray.push(item)
          }

        });
        res.send({code:500, searchResult: resultArray})
      });
    });
  }


router.post('/search', searchFunction, function(req, res, next){});

module.exports = router;
