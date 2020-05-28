const env = require("../.env");
const Telegram = require("telegraf/telegram");
const axios = require("axios");
const Markup = require("telegraf/markup");

// two ways to send messages to telegram
const messageRequest = (msg) => {
  axios
    .get(
      `${env.apiUrl}/sendMessage?chat_id=${env.userId}&text=${encodeURI(msg)}`
    )
    .catch((e) => console.log(e));
};

messageRequest("Enviando mensagem assyncrona")

const keyboard = Markup.keyboard([
    ['Ok','Cancelar']
]).resize().oneTime().extra()

const telegram = new Telegram(env.token)
telegram.sendMessage(env.userId, 'Essa é uma mesagem com teclado', keyboard)