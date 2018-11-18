'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next){
  var languageSystem, langMenu;
  if(req.cookies.vernissageLang === undefined){
    languageSystem = 0;
    langMenu = 'menu';
  }else{
    if(req.cookies.vernissageLang === 'ua'){
      languageSystem = 1;
      langMenu = 'menu-uk';
    }else{
      languageSystem = 0;
      langMenu = 'menu';
    }
  }

  var searchData;
  var DA = req.url.split('=');

  if(DA[0] !== "/"){
    searchData = DA[1].split(',');
  }

  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const config = db.collection("config");
    const titles_page = db.collection("titles_page");
    const menu  = db.collection(langMenu);
    const users_session = db.collection("users");


    if(languageSystem === 0){
      var tovar  = db.collection("tovar");
    }else{
      var tovar  = db.collection("tovar-uk");
    }

    if(err) return console.log(err);

     titles_page.find().toArray(function(err, results_titles_page){
       config.find().toArray(function(err, results_config){
         if(results_config[languageSystem].opens){
           menu.find().toArray(function(err, results_menu ){

             users_session.find({email: req.session.user}).toArray(function(err, results_users_session ){
               if(results_users_session.length > 0){
                 var uSession = results_users_session;
               }else{
                 var uSession = false;
               }


               if(DA[0] !== "/"){
                 let FILTER = {
                   category: parseInt(searchData[0])
                 };
                 if(searchData.length >= 2 ){
                   FILTER.types = searchData[1];
                 }

                 tovar.find(FILTER).sort({ AI: -1 }).toArray(function(err, results_tovar ){
                   res.render('tovar.ejs',{
                     conf: results_config[languageSystem],
                     menu: results_menu,
                     tovarArr: results_tovar.slice(0, 24),
                     title: results_titles_page[languageSystem].tovar,
                     sessionUser: req.session.user,
                     users_data: uSession,
                     offLength: results_tovar.length
                   })
                   client.close();
                 });
               }else{
                 tovar.find().sort({ AI: -1 }).toArray(function(err, results_tovar ){
                   res.render('tovar.ejs',{
                     conf: results_config[languageSystem],
                     menu: results_menu,
                     tovarArr: results_tovar.slice(0, 24),
                     title: results_titles_page[languageSystem].tovar,
                     sessionUser: req.session.user,
                     users_data: uSession,
                     offLength: results_tovar.length
                   })
                   client.close();
                 });
               }
             });
           });
         }else{
           res.render('close.ejs',{
             conf: results_config[languageSystem]
           })
         }
       });
     });
  });
});

module.exports = router;
