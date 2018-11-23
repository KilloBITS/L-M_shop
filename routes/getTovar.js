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

  var page = req.url.split('page=')[1];

  if(parseInt(page) === 1){
    var otTovar = 0;
    var doTovar = 24;
  }else{
    var otTovar = 24 * page;
    var doTovar = otTovar + 24;
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
           menu.find().sort({ isEnded: 1 }).toArray(function(err, results_menu ){
             users_session.find({email: req.session.user}).toArray(function(err, results_users_session ){
               if(results_users_session.length > 0){
                 var uSession = results_users_session;
               }else{
                 var uSession = false;
               }



               // if(DA[0] !== "/"){
                  let FILTER = {
                    category: parseInt(searchData[0])
                  };

                  if(searchData.length >= 2 ){
                    FILTER.types = searchData[1].split('&')[0];
                  }

                  tovar.distinct("group_id").then(function(OriginTovarGI) {
                    // console.log(OriginTovarGI)
                    console.log(OriginTovarGI.length)
                    console.log(tovar.aggregate("group_id"))

                    tovar.find( { group_id : { $in : OriginTovarGI } }, FILTER ).sort( { AI: -1 } ).toArray(function(err, results_tovar ){
                      console.log(results_tovar.length)
                      res.render('tovar.ejs',{
                        conf: results_config[languageSystem],
                        menu: results_menu,
                        tovarArr: results_tovar.slice(otTovar, doTovar),
                        title: results_titles_page[languageSystem].tovar,
                        sessionUser: req.session.user,
                        users_data: uSession,
                        offLength: results_tovar.length,
                        isAdm: req.session.admin,
                        isPage: page
                      })
                      client.close();
                    });

                  });

                  // tovar.find(FILTER).sort({ AI: -1 }).toArray(function(err, results_tovar ){
                  //
                  // });
               // }else{
               //  tovar.find().sort({ AI: -1 }).toArray(function(err, results_tovar ){
               //    res.render('tovar.ejs',{
               //      conf: results_config[languageSystem],
               //      menu: results_menu,
               //      tovarArr: results_tovar.slice(otTovar, doTovar),
               //      title: results_titles_page[languageSystem].tovar,
               //      sessionUser: req.session.user,
               //      users_data: uSession,
               //      offLength: results_tovar.length,
               //      isAdm: req.session.admin,
               //      isPage: page
               //    })
               //    client.close();
               //  });
               // }
             });
           });
         }else{
           res.render('close.ejs',{
             conf: results_config[languageSystem],
             isAdm: req.session.admin
           })
         }
       });
     });
  });
});

module.exports = router;
