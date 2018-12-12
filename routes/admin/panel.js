'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.get('/', function(req, res, next){
  if (req.session && req.session.admin && req.session.user !== undefined) //&& req.session.admin && req.session.user !== undefined
    {
      var languageSystem, langMenu;
      if(req.cookies.pageLang === undefined){
        languageSystem = 0;
        langMenu = 'menu';
      }else{
        if(req.cookies.pageLang === 'ua'){
          languageSystem = 1;
          langMenu = 'menu-ua';
        }else{
          languageSystem = 0;
          langMenu = 'menu';
        }
      }

      mongoClient.connect(global.baseIP, function(err, client){
          const db = client.db(global.baseName);
          const config = db.collection("config");
          const menu  = db.collection("menu");
          const menuuk  = db.collection("menu-uk");
          const slider  = db.collection("slider");
          const news  = db.collection("news");
          const tovar  = db.collection("tovar");
          const tovaruk  = db.collection("tovar-ua");
          const types  = db.collection("types");
          const categories  = db.collection("categories");
          const users  = db.collection("users");
          const titles_page  = db.collection("titles_page");
          const suppliers  = db.collection("suppliers");
          const payments  = db.collection("payments");

          const counters = db.collection("counters");
          if(err) return console.log(err);

         config.find().toArray(function(err, results_config){
           menu.find().sort({ isEnded: 1 }).toArray(function(err, results_menu ){
             slider.find().toArray(function(err, results_slider ){
               news.find().toArray(function(err, results_news ){
                 tovar.find().toArray(function(err, results_tovar ){
                   tovaruk.find().toArray(function(err, results_tovaruk ){
                     types.find().toArray(function(err, results_types ){
                       categories.find().toArray(function(err, results_categories ){
                         users.find().toArray(function(err, results_users ){
                           counters.find().toArray(function(err, results_counters ){
                             titles_page.find().toArray(function(err, results_titles_page ){
                               menuuk.find().sort({ isEnded: 1 }).toArray(function(err, results_menuuk ){
                                 suppliers.find().sort({ isEnded: 1 }).toArray(function(err, results_suppliers ){
                                   payments.find().sort({ isEnded: 1 }).toArray(function(err, results_payments ){
                                     res.render('admin/panel/panel.ejs',{  //admin/panel/panel.ejs
                                       conf: results_config[0],
                                       confua: results_config[1],
                                       menu: results_menu,
                                       menuuk: results_menuuk,
                                       slides: results_slider,
                                       news: results_news,
                                       tovar: results_tovar,
                                       tovaruk: results_tovaruk,
                                       type: results_types,
                                       categorie: results_categories,
                                       users: results_users,
                                       counters: results_counters,
                                       online: global.online,
                                       titles: results_titles_page,
                                       user: req.session.user,
                                       suppliersData: results_suppliers,
                                       payments: results_payments
                                     })
                                     client.close();
                                   });
                                 });
                               });
                             });
                           });
                         });
                       });
                     });
                   });
                 });
               });
             });
           });
         });
      });
    }
  else
    {
      res.redirect('/');
    }
});

module.exports = router;
