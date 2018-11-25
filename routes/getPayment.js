'use strict';
const express = require('express');
const router = express.Router();
const btoa = require('btoa');
const sha1 = require('sha1');
const mongoClient = require("mongodb").MongoClient;
// const url = "mongodb://localhost:27017/"; //url from mongoDB dataBase
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

router.get('/', function(req, res, next){
  var languageSystem, langMenu;
  // if(req.cookies.vernissageLang === undefined){
    languageSystem = 0;
    langMenu = 'menu';
  // }else{
  //   if(req.cookies.vernissageLang === 'ua'){
  //     languageSystem = 1;
  //     langMenu = 'menu-uk';
  //   }else{
  //     languageSystem = 0;
  //     langMenu = 'menu';
  //   }
  // }

  //расчет общей суммы
  var sum = 0;
  for(let i = 0; i < JSON.parse(req.query.JSON_Tovar).length; i++){
    sum = sum + parseFloat(JSON.parse(req.query.JSON_Tovar)[i].price);
  }

  //раззчет бонуса
  var lmCoin = (parseInt(sum) / 100);
  if(lmCoin > 1){
    //обработка бонуса
    if (req.session && req.session.user !== undefined){
      mongoClient.connect(global.baseIP, function(err, client){
        const db = client.db(global.baseName);
        const users = db.collection("users");
        users.find({email: req.session.user}).toArray(function(err, results_users){
          var curCoin = results_users.LM_COIN + lmCoin;
          users.update({email: req.session.user},{ $set : { LM_COIN: curCoin}});
        });
      });

    }
  }

  if(parseInt(req.query.oplatatype) === 0)
  { //если оплата налом
    mongoClient.connect(global.baseIP, function(err, client){
        const db = client.db(global.baseName);
        const config = db.collection("config");
        const menu  = db.collection(langMenu);
        const titles_page = db.collection("titles_page");
        const payments = db.collection("payments");
        const users = db.collection("users");

        if(err) return console.log(err);
        titles_page.find().toArray(function(err, results_titles_page){
          config.find().toArray(function(err, results_config){
           if(results_config[languageSystem].opens){
             var today = new Date();
             var dd = today.getDate();
             var mm = today.getMonth()+1; //January is 0!
             var yyyy = today.getFullYear();

             if(dd<10) {
             dd = '0'+dd
             }

             if(mm<10) {
             mm = '0'+mm
             }

             today = mm + '/' + dd + '/' + yyyy;

             var NEW_ZAKAZ = {};
             NEW_ZAKAZ.number = req.query.phoneNum;
             NEW_ZAKAZ.id =  makeid();
             NEW_ZAKAZ.FIO = req.query.foname + ' ' + req.query.name + ' ' + req.query.FamName;
             NEW_ZAKAZ.today = today;
             NEW_ZAKAZ.summa = sum;
             NEW_ZAKAZ.bonus = lmCoin;
             NEW_ZAKAZ.PAYS = 'Оплата при получении';
             NEW_ZAKAZ.status = 0;
             NEW_ZAKAZ.TTH = null;
             NEW_ZAKAZ.tovars = JSON.parse(req.query.JSON_Tovar);

             if(parseInt(req.query.dosttype) === 0){ //Самовывоз
               NEW_ZAKAZ.dostavka = "Самовывоз";
               NEW_ZAKAZ.adress = "Самовывоз";
             }

             if(parseInt(req.query.dosttype) === 1){ //Курьером
               NEW_ZAKAZ.dostavka = "Доставка курьером";
               NEW_ZAKAZ.adress = 'Город:' + "Львов" + ', Улица:' + req.query.ulica + ', Дом:' + req.query.dom + ', Квартира:' + req.query.kvartira;
             }
             if(parseInt(req.query.dosttype) === 2){ //
               NEW_ZAKAZ.dostavka = "Доставка новой почтой";
               NEW_ZAKAZ.adress = 'Город:' + req.query.city + ', Отделение:' + req.query.npnum;
             }
             if(parseInt(req.query.dosttype) === 3){ //Укр почтой

             }
             payments.insertOne(NEW_ZAKAZ);

             if (req.session && req.session.user !== undefined){
               users.find({email: req.session.user}).toArray(function(err, results_users){
                 results_users[0].payments.push(NEW_ZAKAZ.id);
                 users.update({email: req.session.user},{ $set : { payments: results_users[0].payments}});
               });
             }


             res.redirect("/delivery?"+NEW_ZAKAZ.id);
           }else{
             res.render('close.ejs',{
               conf: results_config[languageSystem],
               isAdm: req.session.admin
             })
           }
         });
       });
    });


  }else{//если оплата картой
    mongoClient.connect(global.baseIP, function(err, client){
        const db = client.db(global.baseName);
        const config = db.collection("config");
        const menu  = db.collection(langMenu);
        const titles_page = db.collection("titles_page");
        const payments = db.collection("payments");
        const users = db.collection("users");

        if(err) return console.log(err);
        titles_page.find().toArray(function(err, results_titles_page){
          config.find().toArray(function(err, results_config){
           if(results_config[languageSystem].opens){
             var today = new Date();
             var dd = today.getDate();
             var mm = today.getMonth()+1; //January is 0!
             var yyyy = today.getFullYear();

             if(dd<10) {
             dd = '0'+dd
             }

             if(mm<10) {
             mm = '0'+mm
             }

             today = mm + '/' + dd + '/' + yyyy;

             var NEW_ZAKAZ = {};
             NEW_ZAKAZ.number = req.query.phoneNum;
             NEW_ZAKAZ.id =  makeid();
             NEW_ZAKAZ.FIO = req.query.foname + ' ' + req.query.name + ' ' + req.query.FamName;
             NEW_ZAKAZ.today = today;
             NEW_ZAKAZ.summa = sum;
             NEW_ZAKAZ.bonus = lmCoin;
             NEW_ZAKAZ.status = 0;
             NEW_ZAKAZ.TTH = null;
             NEW_ZAKAZ.PAYS = 'Одидает оплаты';
             NEW_ZAKAZ.tovars = JSON.parse(req.query.JSON_Tovar);

             if(parseInt(req.query.dosttype) === 0){ //Самовывоз
               NEW_ZAKAZ.dostavka = "Самовывоз";
               NEW_ZAKAZ.adress = "Самовывоз";
             }

             if(parseInt(req.query.dosttype) === 1){ //Курьером
               NEW_ZAKAZ.dostavka = "Доставка курьером";
               NEW_ZAKAZ.adress = 'Город:' + "Львов" + ', Улица:' + req.query.ulica + ', Дом:' + req.query.dom + ', Квартира:' + req.query.kvartira;
             }
             if(parseInt(req.query.dosttype) === 2){ //
               NEW_ZAKAZ.dostavka = "Доставка новой почтой";
               NEW_ZAKAZ.adress = 'Город:' + req.query.city + ', Отделение:' + req.query.npnum;
             }
             if(parseInt(req.query.dosttype) === 3){ //Укр почтой

             }
             payments.insertOne(NEW_ZAKAZ);

             if (req.session && req.session.user !== undefined){
               users.find({email: req.session.user}).toArray(function(err, results_users){
                 results_users[0].payments.push(NEW_ZAKAZ.id);
                 users.update({email: req.session.user},{ $set : { payments: results_users[0].payments}});
               });
             }


             res.redirect("/delivery?"+NEW_ZAKAZ.id);
           }else{
             res.render('close.ejs',{
               conf: results_config[languageSystem],
               isAdm: req.session.admin
             })
           }
         });
       });
    });


    // const pKey = "T9l51qLSTrMPTZDfDC7R3mneNT6cAU2MRYM3meOn";
    // var json_string = {public_key:"i40058369372", version:"3", action:"pay", amount:"1", currency:"UAH", description:"test", order_id: makeid()};
    // var data = btoa(JSON.stringify(json_string));
    // var sign_string = pKey + data + pKey;
    // var signature = btoa(sha1(sign_string, 1));
    //
    // mongoClient.connect(global.baseIP, function(err, client){
    //     const db = client.db(global.baseName);
    //     const config = db.collection("config");
    //     const menu  = db.collection(langMenu);
    //     const titles_page = db.collection("titles_page");
    //
    //     if(err) return console.log(err);
    //     titles_page.find().toArray(function(err, results_titles_page){
    //       config.find().toArray(function(err, results_config){
    //        if(results_config[languageSystem].opens){
    //          menu.find().toArray(function(err, results_menu ){
    //            res.render('payment.ejs',{
    //              conf: results_config[languageSystem],
    //              menu: results_menu,
    //              title: results_titles_page[languageSystem].payment,
    //              sessionUser: req.session.user,
    //              datadata: data,
    //              signaturedata: signature,
    //              isAdm: req.session.admin
    //            })
    //            client.close();
    //          });
    //        }else{
    //          res.render('close.ejs',{
    //            conf: results_config[languageSystem],
    //            isAdm: req.session.admin
    //          })
    //        }
    //      });
    //    });
    // });
  }
});

module.exports = router;
