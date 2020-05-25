const env = require("../.env");
const Telegraf = require("telegraf");
const bot = new Telegraf(env.token);

bot.start(ctx => {
  const from = ctx.update.message.from;
  console.log(from);
  ctx.reply(`Seja bem vindo, ${from.first_name}!`);
});

bot.start((ctx) => {
  ctx.reply(`Estamos felizes em tê-lo conosco no nosso time!`);
});

bot.on("text", async (ctx, next) => {
  await ctx.reply("Oi");
  next();
});
// next() always call the subsequent event on that chaim

bot.on("text", async (ctx, next) => {
  await ctx.reply("Sua");
  next();
});
// event listener from bot - everytime a user type something it will call it

bot.on("text", async (ctx) => {
  await ctx.reply("Lindona");
});

bot.startPolling();
// call telegram api if needs to do something
