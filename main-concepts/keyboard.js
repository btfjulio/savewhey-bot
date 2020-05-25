const env = require("../.env");
const Telegraf = require("telegraf");
const Markup = require("telegraf/markup");
const bot = new Telegraf(env.token);

const meatKeyboard = Markup.keyboard([
  ["🐷 Porco", "🐮 Vaca", "🐑 Carneiro"],
  ["🐔 Galinha", "🐣 Eu como é ovo"],
  ["🐟 Peixe", "🐙 Frutos do mar"],
  ["🍄 Eu sou vegetariano"],
])
  .resize()
  .extra();
// resize fits the keyboard on screen size
// extra render the keyboard

bot.start(async (ctx) => {
  const from = ctx.update.message.from;
  await ctx.reply(`Seja bem vindo ${from.first_name}`);
  await ctx.reply(
    `Qual bebida vc prefere?`,
    Markup.keyboard(["Coca", "Pepsi", "Dolly"]).resize().oneTime().extra()
  );
  //   one time, once the user answers the keyboard is no more on screen
  //   markup creates a new keyboard on user screen
});

bot.hears("Coca", async (ctx) => {
  await ctx.reply(`Nossa! Eu também prefiro ${ctx.match}`);
  await ctx.reply(`Qual a sua carne predileta?`, meatKeyboard);
});

bot.hears(["Pepsi", "Dolly"], async (ctx) => {
  await ctx.reply(`${ctx.match} é foda, viajou`);
  await ctx.reply(`Qual a sua carne predileta?`, meatKeyboard);
});

bot.hears("🐙 Frutos do mar", async (ctx) => {
  await ctx.reply(`Aí vc deu aula, tbm gosto mto de ${ctx.match}`);
});

bot.hears("🍄 Eu sou vegetariano", async (ctx) => {
  await ctx.reply(`Parabens, mas eu ainda não consegui largar a carne`);
});

bot.on("text", async (ctx) => {
  await ctx.reply(`Legal!`);
});

bot.startPolling()