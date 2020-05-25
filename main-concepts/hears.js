const env = require("../.env");
const Telegraf = require("telegraf");
const moment = require("moment");
const bot = new Telegraf(env.token);

bot.hears("pizza", (ctx) => {
  ctx.reply("Quero!");
});

bot.hears(["figado", "chuchu"], (ctx) => {
  ctx.reply("Passo!");
});

bot.hears([/hamburguer/i, /bife/i], (ctx) => {
  ctx.reply("Quero!");
});

bot.hears(/\d{2}\/\d{2}\/\d{4}/, (ctx) => {
  moment.locale("pt-BR"); 
  data = moment(ctx.match[0], "DD/MM/YYYY");
  ctx.reply(`${ctx.match[0]} cai em ${data.format('dddd')}`);
   // 'dddd' represents the weekday from a specific data
});

bot.startPolling();
