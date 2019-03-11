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

/* Global methods*/
require('./controllers/system/controllerLanguage');

//routes pages
const index = require('./routes/getIndex');
const tovar = require('./routes/getTovar');
const getStock = require('./routes/getStock');
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
const dap = require('./routes/getDAP');
const map = require('./routes/getSiteOfMap');

app.use('/', index);
app.use('/shop*', tovar);
app.use('/stock*', getStock);
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
app.use('/discounts-and-promotions', dap);
app.use('/site_of_map', map);

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {})
    res.redirect('/');
});

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

const stock = require('./controllers/controllerStock');
app.post('/getStock', stock);

const newPartnersNumber =  require('./controllers/controllerPartners');
app.post('/newPartnersNumber', newPartnersNumber);

const getMapPoint = require('./controllers/controllerGetMap');
app.post('/getMapPoint', getMapPoint)


/*ADMIN*/




var options = {
  key: fs.readFileSync('./ssl/apache-selfsigned.key'),
  cert: fs.readFileSync('./ssl/apache-selfsigned.crt')
};

const Nexmo = require('nexmo')
const nexmo = new Nexmo({
  apiKey: '8e5f959d',
  apiSecret: 't3KDkf6suo3RQBjV'
})

app.listen(4111, function(){
  global.baseName = 'SHOP_DB';
  global.baseIP = 'mongodb://localhost:27017/';
  global.online = 0;
  // require('./controllers/telegram/telegaBOT');
  console.warn('STARTED HTTP LM_SHOP SERVER ON PORT: 4111');
    // //
    // mongoClient.connect(global.baseIP, function(err, client){
    //   const db = client.db(global.baseName);
    //   var tovar  = db.collection("tovar");
    //    tovar.updateMany({}, {$set: {creator : 'admin'}})
    // });
  //
  // const from = 'Lady & Man club'
  // const to = '+380662377206'
  // const text = 'потемра)))'
  //
  // nexmo.message.sendSms(from, to, text)
});
