const env = require("../.env");
const Telegraf = require("telegraf");
const bot = new Telegraf(env.token);

bot.start((ctx) => {
  const from = ctx.update.message.from;
  ctx.reply(`Seja bem vindo ${from.first_name}!`);
});

bot.on("text", (ctx) => {
  const text = ctx.update.message.text;
  ctx.reply(`Text '${text}' recebido com sucesso!`);
});

bot.on("location", (ctx) => {
  const location = ctx.update.message.location;
  console.log(location);
  ctx.reply(
    `Entendido, você está em ${location.latitude} - ${location.longitude} `
  );
});

bot.on("contact", (ctx) => {
  const contact = ctx.update.message.contact;
  console.log(contact);
  ctx.reply(`Vou salvar ${contact.first_name} - ${contact.phone_number} `);
});

bot.on("voice", (ctx) => {
  const voice = ctx.update.message.voice;
  console.log(voice);
  ctx.reply(`A mensagem tem ${voice.duration} segundos `);
});

bot.on("photo", (ctx) => {
  const photo = ctx.update.message.photo;
  console.log(photo);
  photo.forEach((ph, index) => {
    ctx.reply(`A foto ${index + 1} tem ${ph.width} x ${ph.height}`);
  });
});

bot.on("sticker", (ctx) => {
  const sticker = ctx.update.message.sticker;
  console.log(sticker);
  ctx.reply(`Sticker ${sticker.emoji} ${sticker.set_name}`);
});

bot.startPolling();
