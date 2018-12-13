'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const pagination = require('pagination');

router.get('/*', function(req, res, next){
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

    var page = req.url.split('page=')[1];

    if(parseInt(page) === 1){
      var otTovar = 0;
      var doTovar = 18;
    }else{
      var otTovar = 18 * (parseInt(page)-1);
      var doTovar = otTovar + 18;
    }

    mongoClient.connect(global.baseIP, function(err, client){
      const db = client.db(global.baseName);
      const config = db.collection("config");
      const titles_page = db.collection("titles_page");
      const menu  = db.collection(langMenu);
      const users_session = db.collection("users");
      const banners = db.collection("banners");

      if(languageSystem === 0){
        var tovar  = db.collection("tovar");
      }else{
        var tovar  = db.collection("tovar-uk");
      }

      if(err) return console.log(err);

       titles_page.find().toArray(function(err, results_titles_page){
         config.find().toArray(function(err, results_config){
           if(results_config[0].opens){
             menu.find().sort({ index: 1 }).toArray(function(err, results_menu ){
               users_session.find({email: req.session.user}).toArray(function(err, results_users_session ){
                 if(results_users_session.length > 0){
                   var uSession = results_users_session;
                 }else{
                   var uSession = false;
                 }
                  try {
                    let FILTER = {
                      category: parseInt(searchData[0]),
                    };

                    if(searchData.length >= 2 ){
                      FILTER.types = searchData[1].split('&')[0];
                    }


                    banners.find().toArray(function(err, banner ){
                      tovar.find( FILTER ).sort( { tIncrement: -1 } ).toArray(function(err, results_tovar ){

                        // console.log(results_tovar.length);
                        // console.log(results_tovar.slice(otTovar, doTovar).length);
                        // if(results_tovar.length < 18){
                        //   var arrayOfTovars = ;
                        // }else{
                        //   var arrayOfTovars = results_tovar;
                        // }

                        var current_page = page;
                        var paginator = new pagination.SearchPaginator({prelink: '/shop?c='+searchData[0]+','+searchData[1].split('&')[0], current: current_page, rowsPerPage: 18, totalResult: results_tovar.length-1});
                        var p = paginator.getPaginationData();

                        res.render('tovar.ejs',{
                          conf: results_config[0],
                          menu: results_menu,
                          tovarArr: results_tovar.slice(otTovar, doTovar),
                          title: results_titles_page[0].tovar,
                          sessionUser: req.session.user,
                          users_data: uSession,
                          offLength: results_tovar.length,
                          isAdm: req.session.admin,
                          isPage: page,
                          paginate: p,
                          topBanner: banner[0][searchData[1].split('&')[0]]
                        })
                        client.close();
                      });
                    });
                  } catch (e){
                    res.render('404.ejs',{
                      isAdm: req.session.admin
                    })
                  }
               });
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
});

module.exports = router;
