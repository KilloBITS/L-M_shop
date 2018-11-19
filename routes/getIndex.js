'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

router.use(cookieParser());

router.get('/', function(req, res, next){
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

  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
      const db = client.db(global.baseName);
      const config = db.collection("config");
      const menu  = db.collection(langMenu);
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
           if(results_config[languageSystem].opens){
             menu.find().sort({ isEnded: 1 }).toArray(function(err, results_menu ){
               slider.find().toArray(function(err, results_slider ){
                 news.find().toArray(function(err, results_news ){
                   tovar.find().sort({ AI: -1 }).limit(5).toArray(function(err, results_tovar ){
                     effect.find({ active: true }).toArray(function(err, results_effect ){
                       console.log(results_effect[0])
                        //counters
                        var ipuser = req.connection.remoteAddress.replace(/[^.\d]+/g,"");
                        var geo = geoip.lookup(ipuser);

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
                         res.render('index.ejs',{
                           conf: results_config[languageSystem],
                           menu: results_menu,
                           effectData: results_effect[0],
                           slides: results_slider,
                           news: results_news,
                           newtovar: results_tovar,
                           title: results_titles_page[languageSystem].index,
                           sessionUser: req.session.user
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
