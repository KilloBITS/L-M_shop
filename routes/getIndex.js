'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

router.use(cookieParser());

router.get('/', function(req, res, next){
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

  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
      const db = client.db(global.baseName);
      const config = db.collection("config");
      const menu  = db.collection(langMenu);
      const locale  = db.collection(languageSystem);
      const slider  = db.collection("slider");
      const news  = db.collection("news");
      const tovar  = db.collection("tovar");
      const titles_page = db.collection("titles_page");
      const counters = db.collection("counters");
      const effect = db.collection("effect");

      if(err) return console.log(err);

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();
      if(dd<10) {
          dd = '0'+dd
      }
      if(mm<10) {
          mm = '0'+mm
      }
      today = mm + '-' + dd + '-' + yyyy;

       titles_page.find().toArray(function(err, results_titles_page){
         config.find().toArray(function(err, results_config){
           if(results_config[0].opens){
             menu.find().sort({ index: 1 }).toArray(function(err, results_menu ){
               slider.find().toArray(function(err, results_slider ){
                 news.find().toArray(function(err, results_news ){
                  tovar.aggregate([{$sample: {size: 12}}]).toArray(function(err, results_recTovar) {
                     effect.find({ active: true }).toArray(function(err, results_effect ){
                        //counters
                        try {
                          var ipuser = req.connection.remoteAddress.replace(/[^.\d]+/g,"");
                          var geo = geoip.lookup(ipuser);
                        } catch(e){
                          var ipuser = 'Не удалось определить юзера';
                          var geo = 'Не удалось определить локацию';
                        }


                        counters.find({ date: today }).toArray(function(err, results_counters ){
                          if(results_counters.length > 0){
                            let oldList = results_counters[0].list;
                            if(oldList.find(x => x.ip === ipuser) === undefined){
                                counters.update({ date: today },{ $push: { list: { ip: ipuser, country: geo } } })
                            }
                          }else{
                            console.log("нету");
                            var newDate = {
                                date: today,
                                list: [{
                                  ip: ipuser,
                                  country: geo
                                }]
                              }
                              counters.insert(newDate);
                          }
                        });

                        locale.find({page:'index'}).toArray(function(err, results_locale ){
                          locale.find({page:'global'}).toArray(function(err, results_global ){
                            // res.render('index.ejs',{
                            res.render('index.ejs',{
                              conf: results_config[0],
                              menu: results_menu,
                              effectData: results_effect[0],
                              slides: results_slider,
                              news: results_news,
                              newtovar: results_recTovar,
                              title: results_titles_page[0].index,
                              sessionUser: req.session.user,
                              isAdm: req.session.admin,
                              locale: results_locale[0],
                              global: results_global[0]
                            });
                          });
                        });
                     });
                   });
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

module.exports = router;
