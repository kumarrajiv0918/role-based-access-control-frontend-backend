const express = require('express');
const { register, login, logout } = require('../controller/authController');
const { auth } = require('../middleware/authantication');
const r = express.Router();

r.post('/register', register);
r.post('/login', login);
r.post('/logout', auth, logout);

module.exports = r;
