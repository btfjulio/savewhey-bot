const env = require("./.env");
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const moment = require("moment");

const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");

const {
  getDayTasks,
  getTasks,
  getFinishedTasks,
  getTask,
  addTask,
  updateTaskDate,
  updateTaskNote,
  markAsDone,
  deleteTask,
} = require("./schedullerServices");

const bot = new Telegraf(env.token);

bot.start((ctx) => {
  const name = ctx.update.message.from.first_name;
  ctx.reply(`Seja bem vindo, ${name}`);
});

const formatData = (data) => {
  return data ? moment(data).format("DD/MM/YYYY") : "";
};

const showTask = async (ctx, taskId, newMsg = false) => {
  const task = await getTask(taskId);
  const conclusion = task.conclusion
    ? `<b>Concluída em:</b> ${formatData(task.conclusion)}`
    : "";
  const msg = `
        <b>${task.description}</b>
        <b>Previsão: </b>${formatData(task.date)}${conclusion}
        <b>Observações: </b>${task.note || ""}
    `;

  if (newMsg) {
    ctx.reply(msg, taskButtons(taskId));
  } else {
    ctx.editMessageText(msg, taskButtons(taskId));
  }
};

const schedulleButtons = (tasks) => {
  buttons = tasks.map((task) => {
    const data = task.date ? `${formatData(task.date)} - ` : "";
    return [
      Markup.callbackButton(`${data}${task.description}`, `show ${task.id}`),
    ];
  });
  return Extra.markup(Markup.inlineKeyboard(buttons, { columns: 1 }));
};

// extra html to format text following tags on task pattern
const taskButtons = (taskId) => {
  return Extra.HTML().markup(
    Markup.inlineKeyboard(
      [
        Markup.callbackButton("✔️", `close ${taskId}`),
        Markup.callbackButton("📅", `setDate ${taskId}`),
        Markup.callbackButton("💬", `addNote ${taskId}`),
        Markup.callbackButton("✖️", `remove ${taskId}`),
      ],
      { columns: 4 }
    )
  );
};

// Commands

bot.command("today", async (ctx) => {
  const tasks = await getDayTasks(moment());
  ctx.reply(`Aqui está a sua agenda do dia`, schedulleButtons(tasks));
});

bot.command("tomorrow", async (ctx) => {
  const tasks = await getDayTasks(moment().add({ day: 1 }));
  ctx.reply(`Aqui está a sua agenda de amanhã`, schedulleButtons(tasks));
});

bot.command("week", async (ctx) => {
  const tasks = await getDayTasks(moment().add({ week: 1 }));
  ctx.reply(`Aqui está a desta semana`, schedulleButtons(tasks));
});

bot.command("finished", async (ctx) => {
  const tasks = await getFinishedTasks();
  ctx.reply(`Aqui estão suas tarefas concluídas`, schedulleButtons(tasks));
});

bot.command("unschedulled", async (ctx) => {
  const tasks = await getTasks();
  ctx.reply(`Aqui estão suas tarefas pendentes`, schedulleButtons(tasks));
});

// Actions

bot.action(/show (.+)/, async (ctx) => {
  await showTask(ctx, ctx.match[1]);
});

bot.action(/close (.+)/, async (ctx) => {
  await markAsDone(ctx.match[1]);
  await showTask(ctx, ctx.match[1]);
  ctx.reply("Tarefa concluída");
});

bot.action(/remove (.+)/, async (ctx) => {
  await deleteTask(ctx.match[1]);
  ctx.editMessageText("Tarefa deletada");
});

// Date Scene

const dateKeyboard = Markup.keyboard([
  ["Today", "Tomorrow"],
  ["1 week", "1 month"],
])
  .resize()
  .oneTime()
  .extra();

let taskId = null;

const dateScene = new Scene("date");

dateScene.enter((ctx) => {
  taskId = ctx.match[1];
  ctx.reply(`Gostaria de definir alguma data?`, dateKeyboard);
});

dateScene.leave((ctx) => {
  taskId = null;
  ctx.reply(`Gostaria de definir alguma data?`, dateKeyboard);
});

dateScene.hears(/today/gi, (ctx) => {
  const date = moment();
  handleDate(ctx, date);
});

dateScene.hears(/tomorrow/gi, (ctx) => {
  const date = moment().add({ days: 1 });
  handleDate(ctx, date);
});

dateScene.hears(/^(\d+) days?$/gi, (ctx) => {
  const date = moment().add({ days: ctx.match[1] });
  handleDate(ctx, date);
});

dateScene.hears(/^(\d+) weeks?$/gi, (ctx) => {
  const date = moment().add({ weeks: ctx.match[1] });
  handleDate(ctx, date);
});

dateScene.hears(/^(\d+) months?$/gi, (ctx) => {
  const date = moment().add({ months: ctx.match[1] });
  handleDate(ctx, date);
});

dateScene.hears(/(\d{2}\/\d{2}\/\d{4})/g, (ctx) => {
  const date = moment(ctx.match[1], "DD/MM/YYYY");
  handleDate(ctx, date);
});

const handleDate = async (ctx, date) => {
  await updateTaskDate(taskId, date);
  await ctx.reply(`Data atualizada com sucesso!`);
  await showTask(ctx, taskId, true);
  ctx.scene.leave();
};

dateScene.on("message", (ctx) => {
  ctx.reply("Accepted patterns \ndd/MM/YYYY\nX days\nX weeks\nX months");
});

// note scene

const noteScene = new Scene("note");

noteScene.enter((ctx) => {
  taskId = ctx.match[1];
  ctx.reply(`Ja pode adicionar suas anotações ?`);
});

noteScene.leave((ctx) => {
  taskId = null;
});

noteScene.on("text", async (ctx) => {
  const task = await getTask(taskId);
  const newText = ctx.update.message.text;
  const note = task.note ? task.note + "\n----\n" + newText : newText;
  const res = updateTaskNote(taskId, note);
  await ctx.reply("Observação adicionada com sucesso!");
  await showTask(ctx, taskId, true);
  ctx.scene.leave();
});

noteScene.on("message", (ctx) => {
  ctx.reply("Only text notes are accepted");
});

const stage = new Stage([dateScene, noteScene]);
// stage uses session internaly
bot.use(session());
bot.use(stage.middleware());

bot.action(/setDate (.+)/, Stage.enter("date"));
bot.action(/addNote (.+)/, Stage.enter("note"));

bot.on("text", async (ctx) => {
  try {
    const task = await addTask(ctx.update.message.text);
    await showTask(ctx, task.id, true);
  } catch (err) {
    console.log(err);
  }
});

bot.startPolling();
