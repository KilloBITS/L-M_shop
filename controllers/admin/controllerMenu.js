'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

var getMenuData = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
    {
      mongoClient.connect(global.baseIP ,function(err, client){
       const db = client.db(global.baseName);
       const menu  = db.collection("menu");
       if(err) return console.log(err);
       menu.find( { categories: parseInt(req.body.c)}).toArray(function(err, results){
           res.send({code:500, menu: results[0]});
       });
      });
    }else{
      res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
    }
};
var addCategory = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
    {
      console.log(111)
      mongoClient.connect(global.baseIP ,function(err, client){
       const db = client.db(global.baseName);
       const menu  = db.collection("menu");
       const menuuk  = db.collection("menu-uk");
       if(err) return console.log(err);

       menu.find().sort({categories:-1}).limit(1).toArray(function(err, results_menu ){
         menu.find().sort({index:-1}).limit(1).toArray(function(err, results_menu2 ){
           // var next = results_menu[0].categories + 1;
           var next = req.body.test_url.split('=')[1];

           let newMenuUk = {
             name: req.body.cat_name_ua,
             podlink: ["/"],
             glink: req.body.test_url + '&page=0',
             categories: parseInt(next),
             edited: true,
             index: parseInt(results_menu2[0].index) + 1
           };

           let newMenuRu = {
             name: req.body.cat_name_ru,
             podlink: ["/"],
             glink: req.body.test_url + '&page=0',
             categories: parseInt(next),
             edited: true,
             index: parseInt(results_menu2[0].index)+1
           };

           menu.insertOne(newMenuRu);
           menuuk.insertOne(newMenuUk);
           res.send({code:500});
         });
      });
    });
    }else{
      res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
    }
};
var maxAImenu = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
    {
      mongoClient.connect(global.baseIP ,function(err, client){
       const db = client.db(global.baseName);
       const menu  = db.collection("menu");

       if(err) return console.log(err);

       menu.find().toArray(function(err, results_menu ){
         res.send({code:500, ml: results_menu.length});
       });
      });
    }else{
      res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
    }
};
var removecategory = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
    {
      mongoClient.connect(global.baseIP ,function(err, client){
       const db = client.db(global.baseName);
       const menu  = db.collection("menu");
       const menuuk  = db.collection("menu-uk");

       var myquery = { index: parseInt(req.body.index) };

       menu.remove(myquery, function(err, obj) {
         if (err) throw err;
         console.log(obj.result.n + " category UA deleted");
       });

       menuuk.remove(myquery, function(err, obj) {
         if (err) throw err;
         console.log(obj.result.n + " category RU deleted");
       });

       res.send({code: 500});
      });
    }else{
      res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
    }

};
var addNewType = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
    {
      console.log(req.body.ind)
      mongoClient.connect(global.baseIP ,function(err, client){
       const db = client.db(global.baseName);
       const menu  = db.collection("menu");
       const menuuk  = db.collection("menu-uk");
       if(err) return console.log(err);

       menu.find({index: parseInt(req.body.ind)}).toArray(function(err, results_config){

         if(results_config[0].ml == undefined){
           menu.update({index: parseInt(req.body.ind)}, { $set : { ml: "menPoi" + req.body.ind  }});
           menuuk.update({index: parseInt(req.body.ind)}, { $set : { ml: "menPoi" + req.body.ind  }});
         }

         if(results_config[0].podlink[0] === "/"){
           results_config[0].podlink.splice(0, 1);
           results_config[0].podlink.push({pname: req.body.catData[0].name, plink:"/shop?c="+results_config[0].categories+","+req.body.catData[2].enType + '&page=0' ,types: req.body.catData[2].enType});
         }else{
           results_config[0].podlink.push({pname: req.body.catData[0].name, plink:"/shop?c="+results_config[0].categories+","+req.body.catData[2].enType + '&page=0' ,types: req.body.catData[2].enType});
         }

         menu.update({index: parseInt(req.body.ind)}, { $set : { podlink: results_config[0].podlink  }});

        menuuk.find({index: parseInt(req.body.ind)}).toArray(function(err, results_configuk){

          if(results_configuk[0].podlink[0] === "/"){
            results_configuk[0].podlink.splice(0, 1);
            results_configuk[0].podlink.push({pname: req.body.catData[1].name, plink:"/shop?c="+results_configuk[0].categories+","+req.body.catData[2].enType + '&page=0' ,types: req.body.catData[2].enType});
          }else{
            results_configuk[0].podlink.push({pname: req.body.catData[1].name, plink:"/shop?c="+results_configuk[0].categories+","+req.body.catData[2].enType + '&page=0' ,types: req.body.catData[2].enType});
          }

          menuuk.update({index: parseInt(req.body.ind)}, {$set : { podlink: results_configuk[0].podlink}});
          res.send({code:500, msg: results_config[0].name});
        });
       });
    });
    }else{
      res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
    }
};

router.post('/getMenu', getMenuData, function(req, res, next){});
router.post('/addCategory', addCategory, function(req, res, next){});
router.post('/maxAImenu', maxAImenu, function(req, res, next){});
router.post('/removecategory', removecategory, function(req, res, next){});
router.post('/addNewType', addNewType, function(req, res, next){});




module.exports = router;
