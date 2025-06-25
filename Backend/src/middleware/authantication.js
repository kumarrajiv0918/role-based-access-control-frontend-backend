const jwt = require('jsonwebtoken');
const User = require('../model/userModule');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(data.id);
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: 'Not authorized' });
    }
};

const admin = (req, res, next) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ message: 'Admins only' });
    next();
};

module.exports = { auth, admin };
