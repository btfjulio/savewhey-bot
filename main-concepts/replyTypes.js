const env = require("../.env");
const Telegraf = require("telegraf");
const bot = new Telegraf(env.token);

bot.start(async (ctx) => {
  const from = ctx.update.message.from;
  await ctx.reply(`Seja bem vindo, ${from.first_name}!😂 `);
  await ctx.replyWithHTML(`Destacando mensagem <b>HTML</b>
        <i>de varias</i> <code>formas</code> <pre>possiveis</pre>
        <a href="http://www.google.com">Google</a>`);
  await ctx.replyWithMarkdown(
    "Destacando mensagem *Markdown* " +
      "_de várias_ `formas` ```possiveis```" +
      " [Google](http://www.google.com)"
  );
  await ctx.replyWithPhoto({ source: `${__dirname}/cat.jpeg`} , {caption: 'olha o estilo'});
  await ctx.replyWithLocation(-23.07606, -46.65606);
});

bot.startPolling();
