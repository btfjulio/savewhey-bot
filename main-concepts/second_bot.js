const env = require("../.env");
const Telegraf = require("telegraf");
const bot = new Telegraf(env.token);

bot.start((ctx) => {
  const from = ctx.update.message.from;
  if (from.id === "") {
    ctx.reply(`Seja bem vindo mestre ${from.first_name}, ao seu dispor!`);
  } else {
    ctx.reply(`Perdão ${from.first_name}, só falo com meu mestre!`);
  }
});

bot.startPolling();
// call telegram api if needs to do something