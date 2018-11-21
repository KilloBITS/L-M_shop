'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

var getAdmTovar = (req, res, next) => {
  if (global.isAdminParse(req))
  {
    mongoClient.connect(global.baseIP, function(err, client){
        const db = client.db(global.baseName);
        const tovar = db.collection("tovar");
        const tovaruk = db.collection("tovar-uk");
        if(err) return console.log(err);
       tovar.find({ AI: parseInt(req.body.d)}).toArray(function(err, results_tovar){
         tovar.find({ AI: parseInt(req.body.d)}).toArray(function(err, results_tovar_ua){
           res.send({code: 500, tovar_ru: results_tovar, tovar_ua: results_tovar_ua});
         });
       });
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }
};

var delAdmTovar = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
  {
    mongoClient.connect(global.baseIP ,function(err, client){
     const db = client.db(global.baseName);
     const tovar  = db.collection("tovar");
     const tovaruk  = db.collection("tovar-uk");

     if(err) return console.log(err);

     tovar.remove({ AI: parseInt(req.body.d)});
     tovaruk.remove({ AI: parseInt(req.body.d)});

     res.send({code: 500, msg: "Товар удален!"})
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }
};

var createFile = function(file,AI){
  var base64Data = file.replace(/^data:image\/(png|gif|jpeg|jpg);base64,/,'');
  require("fs").writeFile("./publick/data/tovar/tov"+AI+".jpg", base64Data, 'base64', function(err) {
    console.log(err);
  });
};

var createUA = function(data, ai){
  mongoClient.connect(global.baseIP, { useNewUrlParser: true } ,function(err, client){
    const db = client.db(global.baseName);
    const tovaruk  = db.collection("tovar-uk");
    if(err) return console.log(err);
    var NEW_TOVAR_UA = data;
    NEW_TOVAR_UA.availability = true;
    NEW_TOVAR_UA.category = parseInt(NEW_TOVAR_UA.category),
    NEW_TOVAR_UA.popular = 5;
    NEW_TOVAR_UA.AI = ai;
    NEW_TOVAR_UA.image = "tov"+ai+".jpg";
    NEW_TOVAR_UA.sale = data.sale;
    NEW_TOVAR_UA.postavka = data.postavka;
    NEW_TOVAR_UA.tIncrement = data.tIncrement;
    tovaruk.insertOne(NEW_TOVAR_UA);
  });
};

var createRU = function(data, ai){
  mongoClient.connect(global.baseIP, { useNewUrlParser: true } ,function(err, client){
    const db = client.db(global.baseName);
    const tovar  = db.collection("tovar");
    if(err) return console.log(err);
    var NEW_TOVAR = data;
    NEW_TOVAR.availability = true;
    NEW_TOVAR.category = parseInt(NEW_TOVAR.category),
    NEW_TOVAR.popular = 5;
    NEW_TOVAR.AI = ai;
    NEW_TOVAR.image = "tov"+ai+".jpg";
    NEW_TOVAR.sale = data.sale;
    NEW_TOVAR.postavka = data.postavka;
    NEW_TOVAR.tIncrement = data.tIncrement;
    tovar.insertOne(NEW_TOVAR);
  });
};

var updateUA = function(data, ai){
  mongoClient.connect(global.baseIP ,function(err, client){
   const db = client.db(global.baseName);
   const tovaruk  = db.collection("tovar-uk");
   if(err) return console.log(err);
   data.category = parseInt(data.category);
   tovaruk.update({ AI: parseInt(ai) },{$set: data});
  });
};

var updateRU = function(data, ai){
  mongoClient.connect(global.baseIP ,function(err, client){
   const db = client.db(global.baseName);
   const tovar  = db.collection("tovar");
   if(err) return console.log(err);
   data.category = parseInt(data.category);
   tovar.update({ AI: parseInt(ai) },{$set: data});
  });
};

var updateFile = function(file,AI){
  mongoClient.connect(global.baseIP, function(err, client){
      const db = client.db(global.baseName);
      const tovar = db.collection("tovar");
      const tovaruk = db.collection("tovar-uk");
      if(err) return console.log(err);
     tovar.find({ AI: parseInt(AI)}).toArray(function(err, results_tovar){

       var base64Data = file.replace(/^data:image\/(png|gif|jpeg|jpg);base64,/,'');
       require("fs").writeFile("./publick/data/tovar/"+results_tovar[0].image, base64Data, 'base64', function(err) {
         console.log(err);
       });

     });
  });

};

var setAdmTovar = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
  {
    mongoClient.connect(global.baseIP, { useNewUrlParser: true } ,function(err, client){
      const db = client.db(global.baseName);
      const tovar  = db.collection("tovar");
      if(err) return console.log(err);
      tovar.find().sort({AI:-1}).limit(1).toArray(function(err, results_tovar ){
        var mainData = req.body;
        console.log(results_tovar)
        if(results_tovar.length > 0){
          var NEXT_AI = results_tovar[0].AI + 1;
        } else{
          var NEXT_AI = 1;
        }


        if(mainData.te === "true"){
          createUA(mainData.ua, NEXT_AI);
          createRU(mainData.ru, NEXT_AI);
          createFile(mainData.file, NEXT_AI);
        }else{
          updateUA(mainData.ua, mainData.ai);
          updateRU(mainData.ru, mainData.ai);
          if(mainData.file.length > 20){
            updateFile(mainData.file, mainData.ai);
          }
        }
        res.send({code: 500});
      });
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }
};

var setStatusVisibile = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
  {
    if(req.body.a === 'false'){
      var status = false;
    }else{
      var status = true;
    }

    mongoClient.connect(global.baseIP ,function(err, client){
     const db = client.db(global.baseName);
     const tovar  = db.collection("tovar");
     const tovaruk  = db.collection("tovar-uk");
     if(err) return console.log(err);
     tovar.update({ AI: parseInt(req.body.b) },{$set: {availability: status}});
     tovaruk.update({ AI: parseInt(req.body.b) },{$set: {availability: status}});

     res.send("Статус товара успешно изменен")
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }


};

router.post('/getAdmTovar', getAdmTovar, function(req, res, next){});

router.post('/delAdmTovar', delAdmTovar, function(req, res, next){});

router.post('/setAdmTovar', setAdmTovar, function(req, res, next){});

router.post('/SetStatusVisibile', setStatusVisibile, function(req, res, next){});

module.exports = router;
