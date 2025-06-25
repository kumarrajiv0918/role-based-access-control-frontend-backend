const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: String,
    ip: String,
    tokenName: String,
    loginAt: Date,
    logoutAt: Date
});
module.exports = mongoose.model('UserLog', logSchema);
