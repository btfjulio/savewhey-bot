const env = require("../.env");
const Telegraf = require("telegraf");
const Composer = require("telegraf/composer");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const WizardScene = require("telegraf/scenes/wizard");

let description = "";
let price = null;
let data = 0;

const confirmation = Extra.markup(
  Markup.inlineKeyboard([
    Markup.callbackButton("Sim", "s"),
    Markup.callbackButton("Não", "n"),
  ])
);

// the user only leaves the composer when we get the wanted data
const priceHandler = new Composer();
priceHandler.hears(/(\d+)/, (ctx) => {
  price = ctx.match[1];
  ctx.reply(`É para pagar que dia?`);
  ctx.wizard.next();
});

priceHandler.use((ctx) => {
  ctx.reply("Apenas números são aceitos");
});

const dataHandler = new Composer();
dataHandler.hears(/(\d{2}\/\d{2}\/\d{4})/, (ctx) => {
  data = ctx.match[1];
  ctx.reply(
    `Aqui está o resumo da sua compra:` +
      `\nDescrição: ${description}` +
      `\nPreço: ${price}` +
      `\nData: ${data}` +
      `\nConfirma?`,
    confirmation
  );
  ctx.wizard.next();
});

dataHandler.use((ctx) => {
  ctx.reply("Entre com uma data no foramto DD/MM/YYYY");
});

const confirmationHandler = new Composer();
confirmationHandler.action("s", (ctx) => {
  ctx.reply(`Compra confirmada!`);
  ctx.scene.leave();
});

confirmationHandler.action("n", (ctx) => {
  ctx.reply(`Compra cancelada`);
  ctx.scene.leave();
});

confirmationHandler.use((ctx) => {
  ctx.reply("Confirme sua compra", confirmation);
});

const buyWizard = new WizardScene(
  "compra",
  (ctx) => {
    ctx.reply("O que você comprou?");
    ctx.wizard.next();
  },
  (ctx) => {
    description = ctx.update.message.text;
    ctx.reply(`Quanto foi?`);
    ctx.wizard.next();
  },
  priceHandler,
  dataHandler,
  confirmationHandler
);

const bot = new Telegraf(env.token);    
const stage = new Stage([buyWizard], { default: "compra" });
bot.use(session())
// from this call the bot are able to access the scenes
bot.use(stage.middleware())

bot.startPolling()