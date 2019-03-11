// const TelegramBot = require('node-telegram-bot-api');
// const mongoClient = require("mongodb").MongoClient;
// // replace the value below with the Telegram token you receive from @BotFather
// const token = '787774114:AAFy7_6RBnbwPJqJjaDG7t08-Ih_54ns1PQ';
// // Create a bot that uses 'polling' to fetch new updates
// const botTelega = new TelegramBot(token, {polling: true});
// // global.telegram_bot = botTelega;
// // Matches "/echo [whatever]"
// botTelega.onText(/\/echo (.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"
//   botTelega.sendMessage(chatId, resp);
// });

// var shablonOfViewTowar = ['покажи мне мои покупки', 'как там мои покупки', 'покажи мои заказы', 'как там мои покупки', 'как там мои заказы', 'статус моих заказов', 'статус заказов', 'статус моих покупок', 'статус покупок', 'мои товары', 'мой заказ', 'заказ', 'что я заказывал', 'покажите что я заказывал', 'заказы', 'мои заказы'];

// botTelega.on('message', (msg) => {
//   // console.log(msg);
//   const chatId = msg.chat.id;
//   // console.log(msg.from.id)
//   var ParseString = msg.text;
//   // console.log(ParseString);

//   if(ParseString === '/start'){
//     botTelega.sendMessage(chatId, 'Здравствуйте! Вас приветствует бот Lady & Man Shop.\n\nМеня зовут Юля\nНапишите мне свой номер телефона,\nнет я не буду звонить вам по ночам))\nэто нужно для того чтобы я могла находить ваши заказы\nи информаровать вас о всем происходящем :) \n\n укажите номер в формате - "+380980189896" ');
//   }

//   if(ParseString.substr(0, 4) === '+380'){
//     var setNum = ParseString.substr(0, 3) + "(" + ParseString.substr(3, 3) + ") " +  ParseString.substr(6,3) + '-' + ParseString.substr(9,4);
//     mongoClient.connect(global.baseIP, function(err, clientMANAMA){
//       const db = clientMANAMA.db(global.baseName);
//       const users_session = db.collection("users");
//       if(err) return console.log(err);
//       users_session.find({phone_number: setNum}).toArray(function(err, usersDara){
//         console.log(usersDara);
//         if(usersDara.length > 0){
//           botTelega.sendMessage(chatId, 'Все супер я вас нашла)\n Так теперь я знаю что вас зовут '+usersDara[0].name + '))');
//           users_session.update({phone_number: setNum},{ $set : { TELEGA_ID: msg.from.id}});
//         }else{
//           botTelega.sendMessage(chatId, 'Я не нашла вас в нашей базе,\nвозможно вы не заригестрированы :(\n\n Но вы можете зарегистрироваться\n http://ladyman.club');
//         }
//       })
//     });
//   }

//   if(shablonOfViewTowar.indexOf(ParseString) !== -1){ //показать заказы
//     mongoClient.connect(global.baseIP, function(err, client){
//         const db = client.db(global.baseName);
//         const users_session = db.collection("users");
//         const payments = db.collection("payments");
//         if(err) return console.log(err);
//         users_session.find({TELEGA_ID:  msg.from.id}).toArray(function(err, usersDara){
//           if(usersDara.length > 0){
//             if(usersDara[0].payments.length !== 0){
//               botTelega.sendMessage(chatId, 'Вот что мне удалось найти');
//               payments.find( { id: { $in: usersDara[0].payments } }).toArray(function(err, results_payments ){

//                 for(let i = 0; i < results_payments.length; i++){
//                     var PayTovar = '';
//                     PayTovar += 'Заказ №' + (parseInt(i)+1) + ' ('+ results_payments[i].id +')' + '\n';
//                     PayTovar += 'Детали заказа:\n';
//                     PayTovar += 'Дата покупки: ' + results_payments[i].today + '\n';
//                     PayTovar += 'ФИО получателя: ' + results_payments[i].FIO + '\n';
//                     PayTovar += 'Сумма покупки: ' + results_payments[i].summa + ' Грн\n';
//                     PayTovar += 'Полученно бонусов: ' + results_payments[i].bonus + ' Грн\n';
//                     PayTovar += 'Статус оплаты: ' + results_payments[i].PAYS + '\n';
//                     PayTovar += 'Тип Доставки: ' + results_payments[i].dostavka + '\n';
//                     PayTovar += 'Адрес доставки: ' + results_payments[i].adress + '\n';
//                     switch(results_payments[i].adress){
//                       case 0: PayTovar += 'Статус заказа: Заказ в обработке\n';break;
//                       case 1: PayTovar += 'Статус заказа: Заказ передан в службу доставки.\n ТТН - '+ results_payments[i].TTH;break;
//                     }
//                     botTelega.sendMessage(chatId, PayTovar);
//                 }
//               });
//             }else{
//                 botTelega.sendMessage(chatId, 'Увы но у вас еще нет покупок)')
//             }
//           }else{
//             botTelega.sendMessage(chatId, 'Я не нашла вас в нашей базе,\nвозможно вы не заригестрированы :(\n\n Но вы можете зарегистрироваться\n http://ladyman.club')
//           }
//         })
//       });
//   }
// });
