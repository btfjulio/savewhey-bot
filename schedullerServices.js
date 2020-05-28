const moment = require("moment");
const axios = require("axios");

const baseUrl = "http://localhost:3001/tasks";

const getDayTasks = async (date) => {
  url = `${baseUrl}?_sort=date,description&_order=asc`;
  const res = await axios.get(url);
  const pending = (item) =>
    item.conclusion === null && moment(item.date).isSameOrBefore(date);
  return res.data.filter(pending);
};

const getTasks = async (date) => {
  url = `${baseUrl}?_sort=description&_order=asc`;
  const res = await axios.get(url);
  return res.data.filter(
    (item) => item.date === null && item.conclusion === null
  );
};

const getFinishedTasks = async (date) => {
  url = `${baseUrl}?_sort=description&_order=asc`;
  const res = await axios.get(url);
  return res.data.filter((item) => item.conclusion !== null);
};

const getTask = async (id) => {
  url = `${baseUrl}/${id}`;
  const res = await axios.get(url);
  return res.data;
};

const addTask = async (desc) => {
  const res = await axios.post(baseUrl, {
    description: desc,
    date: null,
    conclusion: null,
    note: null,
  });
  return res.data;
};

const markAsDone = async (id) => {
  task = await getTask(id);
  const res = await axios.put(`${baseUrl}/${task.id}`, {
    ...task,
    conclusion: moment().format("YYYY-MM-DD"),
  });
};

const updateTaskDate = async (id, date) => {
  task = await getTask(id);
  const res = await axios.put(`${baseUrl}/${task.id}`, {
    ...task,
    date: date.format("YYYY-MM-DD"),
  });
  return res.data;
};

const updateTaskNote = async (id, note) => {
  task = await getTask(id);
  const res = await axios.put(`${baseUrl}/${task.id}`, {
    ...task,
    note: note,
  });
  return res.data;
};

const deleteTask = async (id) => {
  task = await getTask(id);
  const res = await axios.delete(`${baseUrl}/${task.id}`);
};

module.exports = {
  getDayTasks,
  getTasks,
  getFinishedTasks,
  getTask,
  addTask,
  updateTaskDate,
  updateTaskNote,
  markAsDone,
  deleteTask,
};
