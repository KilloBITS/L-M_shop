const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = '787774114:AAFy7_6RBnbwPJqJjaDG7t08-Ih_54ns1PQ';
// Create a bot that uses 'polling' to fetch new updates
// const botTelega = new TelegramBot(token, {polling: true});
// // global.telegram_bot = botTelega;
// // Matches "/echo [whatever]"
// botTelega.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message
//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"
//   // send back the matched "whatever" to the chat
//   botTelega.sendMessage(chatId, resp);
// });
//
// var getparcelstatus = function(){
//   botTelega.sendMessage(chatId, 'Я пока что еще в разработке :(')
// };
//
// var getmyparcel = function(msg){
//   const chatId = msg.chat.id;
//   // console.log(msg)
//
// };
//
// var makeanorder = function(){
//   botTelega.sendMessage(chatId, 'Я пока что еще в разработке :(')
// };
//
// var start = function(){
//   botTelega.sendMessage(chatId, 'Здравствуйте! Вас приветствует бот Lady & Man Shop.\n\nДоступные команды:\n• /getparcelstatus - статус моих заказов\n• /getmyparcel - Показать мои заказы');
// };
//
// botTelega.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   // console.log(msg)
//   var ParseString = msg.text;
//   console.log(ParseString)
//   console.log(ParseString.indexOf('покажи мне мои заказы'));
//   if(ParseString.indexOf('покажи мне мои заказы')){
//     botTelega.sendMessage(chatId, 'Вот же они')
//   }else{
//     botTelega.sendMessage(chatId, 'Простите но я вас не понимаю :(')
//   }
//
//   // switch(msg.text){
//   //   case '/getparcelstatus':  getparcelstatus(msg);break;
//   //   case '/getmyparcel':  makeanorder(msg);break;
//   //   case '/makeanorder':  makeanorder(msg);break;
//   //   case '/start':  start(msg); break;
//   //   default: botTelega.sendMessage(chatId, 'Данная команда недоступна!\n\nДоступные команды:\n• /getparcelstatus - статус моих заказов\n• /getmyparcel - Показать мои заказы');
//   // }
// });
