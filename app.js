'use strict';  //use ES6
const http = require('http');
const https = require('https');
const express = require('express');
const bParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const mongoClient = require("mongodb").MongoClient;
const request = require("request");
const app = express();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://localhost:27017/LM_SHOP'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
    }
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
const termsofuse = require('./routes/getTermsofuse');
const pp = require('./routes/getPrivacyPolicy');

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
app.use('/termsofuse', termsofuse);
app.use('/privacy_policy', pp);
app.get('/logout', function(req, res) {
    // req.logout();
    // req.session = null;
    req.session.destroy(function(err) {
      // cannot access session here
    })
    res.redirect('/');
});

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

var options = {
  key: fs.readFileSync('./ssl/apache-selfsigned.key'),
  cert: fs.readFileSync('./ssl/apache-selfsigned.crt')
};

app.listen(4111, function(){
  global.baseName = 'LM_SHOP';
  global.baseIP = 'mongodb://localhost:27017/';
  global.online = 0;

  // require('./controllers/telegram/telegaBOT');
  const TelegramBot = require('node-telegram-bot-api');

  // replace the value below with the Telegram token you receive from @BotFather
  const token = '787774114:AAFy7_6RBnbwPJqJjaDG7t08-Ih_54ns1PQ';

  // Create a bot that uses 'polling' to fetch new updates
  const botTelega = new TelegramBot(token, {polling: true});
  // global.telegram_bot = botTelega;
  // Matches "/echo [whatever]"
  botTelega.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    botTelega.sendMessage(chatId, resp);
  });

  botTelega.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg)

    switch(msg.text){
      case '/getparcelstatus': botTelega.sendMessage(chatId, 'Я пока что еще в разработке :(') ;break;
      case '/getmyparcel':  botTelega.sendMessage(chatId, 'Я пока что еще в разработке :(') ;break;
      case '/makeanorder':  botTelega.sendMessage(chatId, 'Я пока что еще не могу оформлять заказы, но я быстро учусь :(') ;break;
      case '/start':  botTelega.sendMessage(chatId, 'Здравствуйте! Вас приветствует бот Lady & Man Shop.\n\nДоступные команды:\n• /getparcelstatus - статус моих заказов\n• /getmyparcel - Показать мои заказы') ;break;
      default: botTelega.sendMessage(chatId, 'Данная команда недоступна!\n\nДоступные команды:\n• /getparcelstatus - статус моих заказов\n• /getmyparcel - Показать мои заказы');
    }
    // send a message to the chat acknowledging receipt of their message
  });
  console.warn('STARTED HTTP LM_SHOP SERVER ON PORT: 4111');
});
