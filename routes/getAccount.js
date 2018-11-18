'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/', function(req, res, next){
  if (req.session && req.session.user !== undefined){
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

    mongoClient.connect(global.baseIP, function(err, client){
        const db = client.db(global.baseName);
        const config = db.collection("config");
        const titles_page = db.collection("titles_page");
        const users_session = db.collection("users");
        const payments = db.collection("payments");
        const tovar = db.collection("tovar");
        const menu  = db.collection(langMenu);

        if(err) return console.log(err);

       titles_page.find().toArray(function(err, results_titles_page){
         config.find().toArray(function(err, results_config){
           users_session.find({email: req.session.user}).toArray(function(err, results_users_session){
             if(results_config[languageSystem].opens){
               menu.find().toArray(function(err, results_menu ){
                 payments.find( { id: { $in: results_users_session[0].payments } }).toArray(function(err, results_payments ){
                   tovar.find( { AI: { $in: results_users_session[0].desires } }).toArray(function(err, results_desires ){
                     res.render('account.ejs',{
                       conf: results_config[languageSystem],
                       menu: results_menu,
                       title: results_titles_page[languageSystem].account,
                       sessionUser: req.session.user,
                       user: results_users_session[0],
                       payments_user: results_payments,
                       desires_user: results_desires
                     })
                     client.close();
                   });
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
  } else {
    res.redirect("/login")
  }

});

module.exports = router;
