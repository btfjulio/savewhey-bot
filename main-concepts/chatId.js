const env = require("../.env");
const Telegraf = require("telegraf");
const bot = new Telegraf(env.token);


bot.start(ctx => {
    console.log(ctx.chat_id === ctx.upate.chat.id)
})

bot.startPolling()