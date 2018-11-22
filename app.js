'use strict';  //use ES6
const http = require('http');
const https = require('https');
const express = require('express');
const bParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const mongoClient = require("mongodb").MongoClient;
const app = express();

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
//project libs use
app.use(bParser.urlencoded({limit: '50mb'}));
app.use(bParser.json());
app.use(express.static(__dirname + '/publick/'));
app.use(cookieParser());
app.use(bParser.raw({limit: '50mb'}));

//routes pages
const index = require('./routes/getIndex');
const tovar = require('./routes/getTovar');
const get404 = require('./routes/get404');
const login = require('./routes/getLogin');
const oplata = require('./routes/getOplata');
const details = require('./routes/getDetails');
const contacts = require('./routes/getContacts');
const payment = require('./routes/getPayment');
const account = require('./routes/getAccount');
const setNumbers = require('./controllers/controllerSetNumbers');
const delivery = require('./routes/getDelivery');

app.use('/', index);
app.use('/shop*', tovar);
app.use('/login', login);
app.use('/oplata', oplata);
app.use('/details', details);
app.use('/contacts', contacts);
app.use('/payment', payment);
app.use('/profile', account);
app.use('/setNumbers*', setNumbers);
app.use('/delivery*', delivery);

const panel = require('./routes/admin/panel');
app.use('/panel', panel);

app.get('*', get404);

const search = require('./controllers/controllerSearch');
app.post('/search', search);

const PostTovar = require('./controllers/controllerTovar');
app.post('/tovar', PostTovar);

const setStars = require('./controllers/controllerTovar');
app.post('/setStars', setStars);

const SendMail = require('./controllers/controllerSendMail');
app.post('/sendMessage', SendMail);

const getbasket = require('./controllers/controllerGetBasket');
app.post('/getbasket', getbasket);

const auth = require('./controllers/controllerAuthification');
app.post('/auth', auth);

const create_accaunt = require('./controllers/controllerAuthification');
app.post('/create_accaunt', create_accaunt);

const newComment = require('./controllers/controllerComments');
app.post('/newComment', newComment);

const updateAvaUser = require('./controllers/controllerProfile');
app.post('/updateAvaUser', updateAvaUser);

const addToJelaniya = require('./controllers/controllerProfile');
app.post('/addToJelaniya', addToJelaniya);

const counters = require('./controllers/controllerCounters');
app.post('/counters', counters);
/*ADMIN*/
//парсим админа
const parseAdmin = require('./controllers/admin/controllerIsAdmin');
// app.post('/getAdmTovar', AdmiGetTovar);

//Получить список товаров
const AdmiGetTovar = require('./controllers/admin/controllerTovar');
app.post('/getAdmTovar', AdmiGetTovar);
//удалить товар
const delAdmTovar = require('./controllers/admin/controllerTovar');
app.post('/delAdmTovar', delAdmTovar);
//создать или отредактировать товар
const setAdmTovar = require('./controllers/admin/controllerTovar');
app.post('/setAdmTovar', setAdmTovar);
//получить список меню
const getMenu = require('./controllers/admin/controllerMenu');
app.post('/getMenu', getMenu);
//обновить логотип сайта
const updateAva = require('./controllers/admin/controllerUpdateData');
app.post('/updateAva', updateAva);
//выбрать другой загрузчик сайта
const updateLoader = require('./controllers/admin/controllerUpdateData');
app.post('/updateLoader', updateLoader);
//Обновить локализацию индекса
const updateLocal = require('./controllers/admin/controllerUpdateData');
app.post('/updateLocal', updateLocal);
//обновить локализацию раздела товар
const updateLocalTovar = require('./controllers/admin/controllerUpdateData');
app.post('/updateLocalTovar', updateLocalTovar);
//обновить заголовок индекса
const saveTitle = require('./controllers/admin/controllerUpdateData');
app.post('/saveTitle', saveTitle);
//управление сайтом (открыт/в разработке)
const siteStatus = require('./controllers/admin/controllerUpdateData');
app.post('/siteStatus', saveTitle);
//получить список посетителей
const getCounters = require('./controllers/admin/controllerCounters');
app.post('/getCounters', getCounters);
//Редактирование соц сетей
const saveSocials = require('./controllers/admin/controllerSocials');
app.post('/saveSocials', saveSocials);

const setStatusVisibiles = require('./controllers/admin/controllerTovar');
app.post('/SetStatusVisibile', setStatusVisibiles);

const maxAImenu = require('./controllers/admin/controllerMenu');
app.post('/maxAImenu', maxAImenu);
//добавить категорию меню

/** Уплавление меню (категориями) **/
const MENU_Controll = require('./controllers/admin/controllerMenu');
app.post('/addCategory', MENU_Controll);
//Удалить категорию
app.post('/removecategory', MENU_Controll);
//Добавить тип
app.post('/addNewType', MENU_Controll);



const bot = require('./controllers/bot/controllerBot');
app.post('/to-yuliadMessage', bot);

//
// var NNM = 'platya';
// fs.readFile(NNM+'.json', 'utf8', function(err, contents) {
//     var tovars = JSON.parse(contents).yml_catalog.shop.offers.offer;
//     console.log(JSON.parse(contents).yml_catalog.shop.offers.offer.length);
//     var i = 0;
//
//     mongoClient.connect(global.baseIP, { useNewUrlParser: true } ,function(err, client){
//       const db = client.db(global.baseName);
//       const tovar  = db.collection("tovar");
//       if(err) return console.log(err);
//
//       setInterval(function(){
//         try {
//
//           var NEW_TOVAR = new Object();
//           NEW_TOVAR.title = tovars[i].name;
//           NEW_TOVAR.availability = true;
//           NEW_TOVAR.category = 4,
//           NEW_TOVAR.types = NNM;
//           NEW_TOVAR.popular = 5;
//           NEW_TOVAR.AI = i;
//
//           if(tovars[i].picture[0] !== 'h'){
//             console.log("PIC !== H");
//               NEW_TOVAR.image = [];
//               for(let o = 0; o < tovars[i].picture.length; o++){
//                 NEW_TOVAR.image.push(tovars[i].picture[o]);
//               }
//           }else{
//             console.log("PIC ================= H");
//               NEW_TOVAR.image.push(tovars[i].picture);
//           }
//           NEW_TOVAR.descriptin = tovars[i].description.__cdata
//           NEW_TOVAR.sale = [false, 0];
//           NEW_TOVAR.param =  tovars[i].param;
//           NEW_TOVAR.postavka = 'BEREZKA';
//           NEW_TOVAR.group_id =  tovars[i]._group_id;
//           NEW_TOVAR.tIncrement =  tovars[i]._id;
//           NEW_TOVAR.vendorCode = tovars[i].vendorCode
//           NEW_TOVAR.price = tovars[i].price;
//           tovar.insertOne(NEW_TOVAR);
//           console.log('Добавлено :' + i + "/" + JSON.parse(contents).yml_catalog.shop.offers.offer.length);
//
//         } catch (e) {
//           console.log("Tovar "+i + " ERROR")
//         }
//
//         i = i + 1;
//       },50)
//
//     });
// });

app.listen(4111, function(){
  global.baseName = 'LM_SHOP';
  global.baseIP = 'mongodb://localhost:27017/';
  global.online = 0;
  console.warn('STARTED LM_SHOP SERVER ON PORT: 4111');
});

// var options = {
//   key: fs.readFileSync('./ssl/apache-selfsigned.key'),
//   cert: fs.readFileSync('./ssl/apache-selfsigned.crt')
// };
// https.createServer(options, app).listen(443);
