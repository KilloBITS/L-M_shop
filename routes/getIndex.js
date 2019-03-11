'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

router.use(cookieParser());

router.get('/', function(req, res, next){
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const mainslide = db.collection("MAINSLIDE");
    const tovar = db.collection("TOVAR");
    const news = db.collection("NEWS");
    const contacts = db.collection("CONTACTS");

    if(err) return console.log(err);

    locale.find().toArray(function(err, resLocale){
      users.find({login: req.session.login}).toArray(function(err, resUsers){
        menu.find().toArray(function(err, resMenu){
          mainslide.find().toArray(function(err, resMainslide){
            tovar.find().toArray(function(err, resTovar){
              news.find().toArray(function(err, resNews){
                contacts.find().toArray(function(err, resContacts){
                  res.render('index.ejs',{
                    isAdm: req.session.admin,
                    sessionUser: resUsers[0],
                    locale: resLocale[0][global.parseLanguage(req)].index,
                    menu: resMenu[0][global.parseLanguage(req)],
                    globalLocale:  resLocale[0][global.parseLanguage(req)],
                    contacts: resContacts[0],
                    /*олько для индекса*/
                    slides: resMainslide,
                    newtovar: resTovar,
                    news: resNews[0][global.parseLanguage(req)]
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

module.exports = router;


// 'use strict';
// const express = require('express');
// const router = express.Router();
// const mongoClient = require("mongodb").MongoClient;
// const cookieParser = require('cookie-parser');
// const geoip = require('geoip-lite');

// router.use(cookieParser());

// router.get('/', function(req, res, next){
//   var languageSystem, langMenu;

//   if(req.cookies.pageLang === undefined){
//     languageSystem = "locale";
//   }else{
//     if(req.cookies.pageLang === 'ua'){
//       languageSystem = "locale-ua";
//     }else{
//       languageSystem = "locale";
//     }
//   }

//   mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
//       const db = client.db(global.baseName);
//       const config = db.collection("config");
//       const menu  = db.collection("");
//       const locale  = db.collection(languageSystem);
//       const slider  = db.collection("slider");
//       const news  = db.collection("news");
//       const tovar  = db.collection("tovar");
//       const titles_page = db.collection("titles_page");
//       const counters = db.collection("counters");
//       const effect = db.collection("effect");

//       if(err) return console.log(err);

//       var today = new Date();
//       var dd = today.getDate();
//       var mm = today.getMonth()+1;
//       var yyyy = today.getFullYear();
//       if(dd<10) {
//           dd = '0'+dd
//       }
//       if(mm<10) {
//           mm = '0'+mm
//       }
//       today = mm + '-' + dd + '-' + yyyy;

//        titles_page.find().toArray(function(err, results_titles_page){
//          config.find().toArray(function(err, results_config){
//            if(results_config[0].opens){
//              menu.find().sort({ index: 1 }).toArray(function(err, results_menu ){
//                slider.find().toArray(function(err, results_slider ){
//                  news.find().sort({ index: -1 }).toArray(function(err, results_news ){
//                   tovar.aggregate([{$sample: {size: 12}}]).toArray(function(err, results_recTovar) {
//                      effect.find({ active: true }).toArray(function(err, results_effect ){
//                         //counters
//                         try {
//                           var ipuser = req.connection.remoteAddress.replace(/[^.\d]+/g,"");
//                           var geo = geoip.lookup(ipuser);
//                         } catch(e){
//                           var ipuser = 'Не удалось определить юзера';
//                           var geo = 'Не удалось определить локацию';
//                         }


//                         counters.find({ date: today }).toArray(function(err, results_counters ){
//                           if(results_counters.length > 0){
//                             let oldList = results_counters[0].list;
//                             if(oldList.find(x => x.ip === ipuser) === undefined){
//                                 counters.update({ date: today },{ $push: { list: { ip: ipuser, country: geo } } })
//                             }
//                           }else{
//                             console.log("нету");
//                             var newDate = {
//                                 date: today,
//                                 list: [{
//                                   ip: ipuser,
//                                   country: geo
//                                 }]
//                               }
//                               counters.insert(newDate);
//                           }
//                         });

//                         locale.find({page:'index'}).toArray(function(err, results_locale ){
//                           locale.find({page:'global'}).toArray(function(err, results_global ){
//                             // res.render('index.ejs',{
//                             res.render('index.ejs',{
//                               conf: results_config[0],
//                               menu: results_menu,
//                               effectData: results_effect[0],
//                               slides: results_slider,
//                               news: results_news,
//                               newtovar: results_recTovar,
//                               title: results_titles_page[0].index,
//                               sessionUser: req.session.user,
//                               isAdm: req.session.admin,
//                               locale: results_locale[0],
//                               global: results_global[0]
//                             });
//                           });
//                         });
//                      });
//                    });
//                  });
//                });
//              });
//            }else{
//              res.render('close.ejs',{
//                conf: results_config[languageSystem]
//              })
//            }

//          });

//        });
//   });
// });

// module.exports = router;
