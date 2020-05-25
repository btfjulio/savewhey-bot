const env = require("../../.env");
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const session = require("telegraf/session");
const bot = new Telegraf(env.token);

// create the list of buttons
const createButtons = (list) => {
  return Extra.markup(
    Markup.inlineKeyboard(
      list.map((item) => Markup.callbackButton(item, `delete ${item}`)), // gen an array of buttons
      { columns: 3 }
    )
  );
};

bot.use(session());

const validateUser = (ctx, next) => {
  const sameId =
    ctx.update.message && ctx.update.message.from.id === env.userId;
    // action callback validation   
  const sameIdCallback =
    ctx.update.callback_query &&
    ctx.update.callback_query.from.id === env.userId;

  if (sameId || sameIdCallback) {
    next();
  } else {
    ctx.reply("Conexão não autorizada");
  }
};

// it will receive an object ctx, and next function as parameter
const processing = ({ reply }, next) =>
  reply("processando..").then(() => next());

bot.start(validateUser, async (ctx) => {
  console.log(ctx.update.message.from);
  const name = ctx.update.message.from.first_name;
  await ctx.reply(`Seja bem vindo ${name}`);
  await ctx.reply(`Escreva os itens que você deseja adicionar..`);
  ctx.session.list = [];
});

bot.on("text", validateUser, processing, async (ctx) => {
  const msg = ctx.update.message.text;
  ctx.session.list.push(msg);
  await ctx.reply(
    `Item ${msg} adicionado com sucesso!`,
    createButtons(ctx.session.list)
  );
});

bot.action(/delete (.+)/, validateUser, processing, (ctx) => {
  if (ctx.session.list.lenght > 0) {
    ctx.session.list = ctx.session.list.filter((item) => item !== ctx.match[1]);
    ctx.reply(
      `${ctx.match[1]} removido com sucesso`,
      createButtons(ctx.session.list)
    );
  }
});

bot.startPolling();
