'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/', function(req, res, next){
  if (req.session && req.session.user !== undefined)
  {
    res.redirect('/');
  }else{
    var languageSystem, langMenu;

    if(req.cookies.pageLang === undefined){
      languageSystem = "locale";
      langMenu = "menu";
    }else{
      if(req.cookies.pageLang === 'ua'){
        languageSystem = "locale-ua";
        langMenu = "menu-ua";
      }else{
        languageSystem = "locale";
        langMenu = "menu";
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

      if(err) return console.log(err);

       titles_page.find().toArray(function(err, results_titles_page){
         config.find().toArray(function(err, results_config){
           if(results_config[0].opens){

             menu.find().sort({ index: 1}).toArray(function(err, results_menu ){

               res.render('auth.ejs',{
                 conf: results_config[0],
                 menu: results_menu,
                 title: results_titles_page[0].auth,
                 isAdm: req.session.admin
               });
               client.close();

             });
           }else{
             res.render('close.ejs',{
               conf: results_config[0],
               isAdm: req.session.admin
             })
           }
         });
       });
    });
  }

});

module.exports = router;
