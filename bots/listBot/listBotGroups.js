const env = require("../../.env");
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const session = require("telegraf/session");
const bot = new Telegraf(env.token);

let data = {};

const generateButtons = (list) => {
  return Extra.markup(
    Markup.inlineKeyboard(
      list.map((item) => Markup.callbackButton(item, `delete ${item}`)),
      { columns: 3 }
    )
  );
};

bot.start(async (ctx) => {
  const name = ctx.update.message.from.first_name;
  await ctx.reply(`Seja bem vindo ${name}!`);
  await ctx.reply(`Escreva os items que você deseja adicionar...`);
});

bot.use((ctx, next) => {
  const chatId = ctx.chat.id;
  if (!data.hasOwnProperty(chatId)) {
    data[chatId] = [];
  }
  // save on items the chatId data on bot ctx
  ctx.items = data[chatId];
  next();
});

bot.on("text", async (ctx) => {
  console.log(data[ctx.chat.id])
  let text = ctx.update.message.text;
  // ignore first char if text starts with '/'
  if (text.startsWith("/")) {
    text = text.substring(1);
  }
  ctx.items.push(text);
  ctx.reply(`${text} adicionado`, generateButtons(ctx.items));
  await console.log();
});

bot.action(/delete (.+)/, (ctx) => {
  chatId = ctx.chat.id
  data[chatId] = ctx.items.filter((item) => item !== ctx.match[1]);
  ctx.reply(`${ctx.match[1]} deletado!`, generateButtons(data[chatId]));
});

bot.startPolling();
