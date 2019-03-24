'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const pagination = require('pagination');

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

router.get('/*', function(req, res, next){
  var DA = req.url.split('=');
  var searchData = DA[1].split('&');

  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const tovar = db.collection("TOVAR");
    const news = db.collection("NEWS");
    const contacts = db.collection("CONTACTS");
    const config = db.collection("CONFIG");
    const manufactures = db.collection("MANUFACTURERS");
    
    if(err) return console.log(err);

    locale.find().toArray(function(err, resLocale){
      users.find({email: (req.session.user === undefined)?false:req.session.user}).toArray(function(err, resUsers){
        menu.find().sort({index: 1}).toArray(function(err, resMenu){
          tovar.aggregate([{$sample: {size: 3}}]).toArray(function(err, recomendedTov) {
            tovar.find({ AI: parseInt(searchData[0]), type: searchData[1] }).toArray(function(err, resTovar){
              tovar.find({ color: resTovar[0].color, type: resTovar[0].type }).toArray(function(err, similarTov) {
                var NewSimilar = [];
                for(var mr = 0; mr < 3; mr++ ){
                  NewSimilar.push(similarTov[randomInteger(0, similarTov.length)]);
                }
                console.log(resTovar[0])
                config.find().toArray(function(err, resConfig){
                  news.find().toArray(function(err, resNews){
                    contacts.find().toArray(function(err, resContacts){                  
                      manufactures.find().toArray(function(err, resManufactures){                  
                        res.render('pages/details.ejs',{
                          isAdm: req.session.admin,
                          sessionUser: resUsers[0],
                          locale: resLocale[0][global.parseLanguage(req)].details,
                          menu: resMenu,
                          globalLocale:  resLocale[0][global.parseLanguage(req)],
                          contacts: resContacts[0],
                          numLang: global.parseNumLang(req),
                          tovarArr: resTovar[0],                    
                          config: resConfig[0],
                          rec: recomendedTov,
                          manufact: resManufactures,
                          similars: NewSimilar,
                          comment: ''
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

module.exports = router;




// 'use strict';
// const express = require('express');
// const router = express.Router();
// const mongoClient = require("mongodb").MongoClient;

// router.get('/*', function(req, res, next) {


//   var DA = req.url.split('=');
//   var searchData = DA[1].split('&');

//   mongoClient.connect(global.baseIP, function(err, client) {
//     const db = client.db(global.baseName);
//     const config = db.collection("config");
//     const menu = db.collection(langMenu);
//     const tovar = db.collection("tovar");
//     const users_session = db.collection("users");
//     const tovar_comments = db.collection("comments");

//     if (err) return console.log(err);

//     config.find().toArray(function(err, results_config) {
//       if (results_config[0].opens) {
//         menu.find().sort({ index: 1 }).toArray(function(err, results_menu) {
//           tovar.find({ AI: parseInt(searchData[0]), types: searchData[1] }).toArray(function(err, results_tovar) {
//             tovar_comments.find({tovar_AI: parseInt(results_tovar[0].AI)}).toArray(function(err, results_comments) {
//               users_session.find({email: req.session.user}).toArray(function(err, results_users_session) {
//                 if (results_users_session.length > 0) {
//                   var uSession = results_users_session;
//                 } else {
//                   var uSession = false;
//                 }

//                 tovar.aggregate([{$sample: {size: 3}}]).toArray(function(err, results_recTovar) {

//                   tovar.update({ AI: parseInt(searchData[0]) }, {$set : {visual: parseInt(results_tovar[0].visual) + 1} })

//                   tovar.find({ group: results_tovar[0].group }).toArray(function(err, results_group) {
//                     if(results_tovar[0].group !== undefined){
//                       var TovGroup = results_group;
//                     }else{
//                       var TovGroup = [];
//                     }

//                     res.render('pages/details.ejs', {
//                       conf: results_config[0],
//                       menu: results_menu,
//                       tovarArr: results_tovar,
//                       comment: results_comments,
//                       rec: results_recTovar,
//                       sessionUser: req.session.user,
//                       users_data: uSession,
//                       isAdm: req.session.admin,
//                       groupArr: TovGroup
//                     })
//                     client.close();
//                   });

//                 });
//               });
//             });
//           });
//         });
//       } else {
//         res.render('close.ejs', {
//           conf: results_config[0]
//         })
//       }
//     });
//   });
// });

// module.exports = router;

