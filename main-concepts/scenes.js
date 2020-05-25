const env = require("../.env");
const Telegraf = require("telegraf");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const session = require("telegraf/session");
const { enter, leave } = Stage;

const bot = new Telegraf(env.token);

bot.start((ctx) => {
  const name = ctx.update.message.from.first_name;
  ctx.reply(`Seja bem vindo ${name}`);
  ctx.reply(`Entre com /echo ou /soma para iniciar..`);
});

const echoScene = new Scene("echo"); //
echoScene.enter((ctx) => ctx.reply("Entrando em echo Scene")); // middleware when enter
echoScene.leave((ctx) => ctx.reply("Saindo de echo Scene")); // middleware when leave
echoScene.command("sair", leave()); // command sair to leave scene
echoScene.on("text", (ctx) => ctx.reply(ctx.message.text));
echoScene.on("message", (ctx) =>
  ctx.reply("Apenas mensagens de texto, por favor")
);

let sum = 0;
const sumScene = new Scene("sum"); //
sumScene.enter((ctx) => ctx.reply("Entrando em Soma Scene")); // middleware when enter
sumScene.leave((ctx) => ctx.reply("Saindo de Soma Scene")); // middleware when leave
sumScene.command("sair", leave()); // command sair to leave scene

sumScene.use(async (ctx, next) => {
  await ctx.reply("Você está em Soma Scene, escreva números para somar");
  await ctx.reply("Outros comandos: /zerar /sair");
  next();
});

sumScene.command("zerar", (ctx) => {
  sum = 0;
  ctx.reply(`Valor: ${sum}`);
});

sumScene.hears(/(\d+)/, (ctx) => {
  console.log("oi");
  sum += parseInt(ctx.match[1]);
  ctx.reply(`Valor: ${sum}`);
});

sumScene.on("message", (ctx) => {
  ctx.reply("Apenas números por favor");
});

// gets an array of scenes
const stage = new Stage([echoScene, sumScene]);
bot.use(session());
// from this call the bot are able to access the scenes
bot.use(stage.middleware());
// the enter method is called with the name given on the scene creation
bot.command("soma", enter("sum"));
bot.command("echo", enter("echo"));

bot.on("message", (ctx) => ctx.reply("Entre com /echo ou /soma para iniciar"));

bot.startPolling();
