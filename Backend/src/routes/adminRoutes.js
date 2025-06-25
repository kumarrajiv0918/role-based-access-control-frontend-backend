const express = require('express');
const { auth, admin } = require('../middleware/authantication');
const { getLogs, deleteLog } = require('../controller/adminController');
const r = express.Router();

r.use(auth, admin);
r.get('/logs', getLogs);
r.delete('/deleteLog/:id', deleteLog);

module.exports = r;
