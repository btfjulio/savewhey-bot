const env = require("../../.env");
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const bot = new Telegraf(env.token);

let list = [];

// create the list of buttons
const createButtons = () => {
  return Extra.markup(
    Markup.inlineKeyboard(
      list.map((item) => Markup.callbackButton(item, `delete ${item}`)),
      { columns: 3 }
    )
  );
};

bot.start(async (ctx) => {
  const name = ctx.update.message.from.first_name;
  await ctx.reply(`Seja bem vindo ${name}`);
  await ctx.reply(`Escreva os itens que você deseja adicionar..`);
});

bot.on("text", (ctx) => {
  list.push(ctx.update.message.text);
  ctx.reply(
    `${ctx.update.message.text} adicionado com sucesso!`,
    createButtons()
  );
});

bot.action(/delete (.+)/, (ctx) => {
  list = list.filter((item) => item !== ctx.match[1]);
  ctx.reply(
    `O item ${ctx.match[1]} foi excluído da lista de compras`,
    createButtons()
  );
});

bot.startPolling();
