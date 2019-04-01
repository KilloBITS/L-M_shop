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
    const payments = db.collection("PAYMENTS");
    const config = db.collection("CONFIG");

    if(err) return console.log(err);

    locale.find().toArray(function(err, resLocale){
      users.find({email: (req.session.user === undefined)?false:req.session.user}).toArray(function(err, resUsers){
        if(resUsers.length > 0 || req.session.login !== undefined){
          menu.find().sort({isEnded: 1}).toArray(function(err, resMenu){
            mainslide.find().toArray(function(err, resMainslide){
              tovar.find().sort({AI: -1}).limit(18).toArray(function(err, resTovar){
                news.find().sort({AI: -1}).limit(6).toArray(function(err, resNews){
                  contacts.find().toArray(function(err, resContacts){
                    payments.find( { id: { $in: resUsers[0].payments } }).toArray(function(err, resPayments ){
                      console.log(resPayments)
                      tovar.find( { AI: { $in: resUsers[0].desires } }).toArray(function(err, resDesires ){
                        config.find().toArray(function(err, resConfig ){
                          global.visitors(req);
                          res.render('pages/account.ejs',{
                            isAdm: req.session.admin,
                            sessionUser: resUsers[0],
                            locale: resLocale[0][global.parseLanguage(req)].profile,
                            menu: resMenu,
                            globalLocale:  resLocale[0][global.parseLanguage(req)],
                            contacts: resContacts[0],
                            numLang: global.parseNumLang(req),
                            payments_user: resPayments,
                            desires_user: resDesires,
                            config: resConfig[0]      
                          });
                        });
                      });
                    });
                  });
                });
              });
            }); 
          }); 
        }else{
          res.redirect('/login');
        }        
      }); 
    });    
  });      
});

module.exports = router;

// 'use strict';
// const express = require('express');
// const router = express.Router();
// const mongoClient = require("mongodb").MongoClient;

// router.get('/', function(req, res, next){
//   if (req.session && req.session.user !== undefined){
//     var languageSystem, langMenu;

//     if(req.cookies.pageLang === undefined){
//       languageSystem = "locale";
//       langMenu = "menu";
//     }else{
//       if(req.cookies.pageLang === 'ua'){
//         languageSystem = "locale-ua";
//         langMenu = "menu-ua";
//       }else{
//         languageSystem = "locale";
//         langMenu = "menu";
//       }
//     }

//     mongoClient.connect(global.baseIP, function(err, client){
//         const db = client.db(global.baseName);
//         const config = db.collection("config");
//         const titles_page = db.collection("titles_page");
//         const users_session = db.collection("users");
//         const payments = db.collection("payments");
//         const tovar = db.collection("tovar");
//         const menu  = db.collection(langMenu);

//         if(err) return console.log(err);

//        titles_page.find().toArray(function(err, results_titles_page){
//          config.find().toArray(function(err, results_config){
//            users_session.find({email: req.session.user}).toArray(function(err, results_users_session){
//              if(results_config[0].opens){
//                menu.find().sort({ index: 1 }).toArray(function(err, results_menu ){
//                  payments.find( { id: { $in: results_users_session[0].payments } }).toArray(function(err, results_payments ){
//                    tovar.find( { AI: { $in: results_users_session[0].desires } }).toArray(function(err, results_desires ){
//                      res.render('account.ejs',{
//                        conf: results_config[0],
//                        menu: results_menu,
//                        title: results_titles_page[0].account,
//                        sessionUser: req.session.user,
//                        user: results_users_session[0],
//                        payments_user: results_payments,
//                        desires_user: results_desires,
//                        isAdm: req.session.admin
//                      })
//                      client.close();
//                    });
//                  });
//                });
//              }else{
//                res.render('close.ejs',{
//                  conf: results_config[0]
//                })
//              }
//            });
//          });
//        });
//     });
//   } else {
//     res.redirect("/login")
//   }

// });

// module.exports = router;
