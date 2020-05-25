const env = require("../.env");
const Telegraf = require("telegraf");
const bot = new Telegraf(env.token);

bot.start((ctx) => {
  const name = ctx.update.message.from.first_name;
  ctx.reply(`Bem vindo, ${name}!\nAvise se precisar de alguma /ajuda`);
});

bot.command("ajuda", (ctx) => {
  ctx.reply(
    "/ajuda: vou mostrar as opções" +
      "\n/ajuda2: para testar via headers" +
      "\n/op2: Opção generica" +
      "\n/op3: Opção generica qualquer"
  );
});

bot.hears("/ajuda2", (ctx) => {
  ctx.reply("Eu também consigo capturar comandos, mas utilize a /ajuda mesmo");
});

bot.hears(/\/op\d+/i, (ctx) => {
  ctx.reply("Resposta padrão para comandos genericos");
});

bot.startPolling();
