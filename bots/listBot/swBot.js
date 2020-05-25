const env = require("../../.env");
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const axios = require("axios");
const bot = new Telegraf(env.token);

const categories = ["Whey", "Creatina", "Hipercalórico", "Glutamina", "BCAA"];

// markup keyboard receives an array of strings
const keyboardOptions = Markup.keyboard([
  ["Buscar por categoria"],
  ["Melhores promoções do dia"],
  ["Buscar lojas na minha região"],
  ["Onde baixar o app?"],
])
  .resize()
  .oneTime()
  .extra();

const buttons = Extra.markup(
  Markup.inlineKeyboard(
    [Markup.callbackButton("Sim", "s"), Markup.callbackButton("Não", "n")],
    { columns: 2 }
  )
);

const genCategories = Extra.markup(
  Markup.inlineKeyboard(
    categories.map((category) =>
      Markup.callbackButton(`${category}`, `${category}`)
    ),
    {
      columns: 3,
    }
  )
);

const location = Markup.keyboard([
  Markup.locationRequestButton("Clique aqui para enviar sua localização"),
])
  .resize()
  .oneTime()
  .extra();

bot.start(async (ctx) => {
  const name = ctx.update.message.from.first_name;
  await ctx.replyWithMarkdown(`*Olá, ${name}!*\nEu sou o Chatbot do Save Whey`);
  await ctx.replyWithPhoto({ source: `${__dirname}/../../images/arnold.jpeg` });
  await ctx.replyWithMarkdown(`Você já conhece o Save Whey?`, buttons);
});

bot.action("s", async (ctx) => {
  await ctx.reply(`Legal!`);
  await ctx.reply(`Como posso te ajudar?`, keyboardOptions);
});

bot.action("n", async (ctx) => {
  await ctx.replyWithMarkdown(
    "Nós ajudamos você a comprar o seu *suplemento* preferido pelo menor preço possível!"
  );
  await ctx.replyWithMarkdown(
    "Estamos sempre de olho nos `preços`, `cupons` e `promoções` das maiores lojas da internet"
  );
  await ctx.reply(
    `Escolha uma das opçoes abaixo para que eu possa te ajudar?`,
    keyboardOptions
  );
});

bot.hears("Buscar por categoria", (ctx) => {
  ctx.reply(`Qual desses produtos está buscando?`, genCategories);
});

bot.hears("Buscar lojas na minha região", (ctx) => {
  ctx.reply(`Compartilhe conosco sua localização`, location);
});

bot.hears("Como baixar o app?", (ctx) => {
  ctx.replyWithMarkdown(
    "Só clicar nesse *link*: " + "(http://bit.ly/app_savewhey)"
  );
});

bot.on("location", async (ctx) => {
  try {
    const url = "http://api.openweathermap.org/data/2.5/weather";
    const { latitude: lat, longitude: lon } = ctx.message.location;
    const res = await axios.get(
      `${url}?lat=${lat}&lon=${lon}&APPID=${env.apiWeatherKey}&units=metric`
    );
    await ctx.reply(
      `Infelizmente ainda nao temos lojas parceiras em ${res.data.name}`
    );
    await ctx.reply(`A temperatura por aí está em ${res.data.main.temp}°C`);
  } catch (e) {
    await ctx.reply(`Estou tendo problemas para acessar sua localização`);
  }
});

bot.startPolling();
