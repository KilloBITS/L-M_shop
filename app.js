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
        url: 'mongodb://localhost:27017/SHOP_DB'
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

//User routes
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



//Admin routes
const admAbout = require('./routes/panel/getAboutPanel');
const admAPI = require('./routes/panel/getAPIPanel');
const admCatalog = require('./routes/panel/getCatalogPanel');
const admCatalogEdit = require('./routes/panel/getaddfromeditTovar');
const admDB = require('./routes/panel/getDBPanel');
const admFaq = require('./routes/panel/getFaqPanel');
const admIndex = require('./routes/panel/getIndexPanel');
const admLocal = require('./routes/panel/getLocalPanel');
const admNews = require('./routes/panel/getNewsPanel');
const admNewsEdit = require('./routes/panel/getaddfromeditNews');
const admPaydel = require('./routes/panel/getPaydelPanel');
const admSystem = require('./routes/panel/getSystemPanel');
const admUsers = require('./routes/panel/getUsersPanel');
const admVisual = require('./routes/panel/getVisualPanel');

app.use('/about-panel', admAbout);
app.use('/API-panel', admAPI);
app.use('/catalog-panel', admCatalog);
app.use('/editTovar*', admCatalogEdit);
app.use('/DB-panel', admDB);
app.use('/index-panel', admIndex);
app.use('/local-panel', admLocal);
app.use('/news-panel', admNews);
app.use('/editNews*', admNewsEdit);
app.use('/paydel-panel', admPaydel);
app.use('/system-panel', admSystem);
app.use('/users-panel', admUsers);
app.use('/visual-panel', admVisual);
app.use('/faq-panel', admFaq);





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
const panelNewsController = require('./controllers/panel/panelNews_controller');
app.post('/setNewNews', panelNewsController);
app.post('/saveEditNews', panelNewsController);
app.post('/setRemoveNews', panelNewsController);

const usersPanelMethods = require('./controllers/panel/panelUser_controller');
app.post('/setAdmUser', usersPanelMethods);
app.post('/deleteUser', usersPanelMethods);
app.post('/blockUser', usersPanelMethods);

const aboutPanelMethods = require('./controllers/panel/panelAbout_controller');
app.post('/saveAboutText', aboutPanelMethods);


var options = {
  key: fs.readFileSync('./ssl/apache-selfsigned.key'),
  cert: fs.readFileSync('./ssl/apache-selfsigned.crt')
};

const Nexmo = require('nexmo')
const nexmo = new Nexmo({
  apiKey: '8e5f959d',
  apiSecret: 't3KDkf6suo3RQBjV'
})
app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});
app.get('*', get404);
app.listen(4111, function(){
  global.baseName = 'SHOP_DB';
  global.baseIP = 'mongodb://localhost:27017/';
  global.online = 0;
  // require('./controllers/telegram/telegaBOT');
  console.warn('STARTED HTTP LM_SHOP SERVER ON PORT: 4111');
});
