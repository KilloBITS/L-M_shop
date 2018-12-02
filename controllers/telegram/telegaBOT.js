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
