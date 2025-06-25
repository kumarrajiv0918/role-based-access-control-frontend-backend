const express = require('express');
const { auth } = require('../middleware/authantication');
const { getTasks, createTask, updateTask, deleteTask } = require('../controller/taskController');
const r = express.Router();

r.use(auth);
r.get('/', getTasks);
r.post('/', createTask);
r.put('/:id', updateTask);
r.delete('/:id', deleteTask);

module.exports = r;
