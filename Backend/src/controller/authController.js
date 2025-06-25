const User = require('../model/userModule');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserLog = require('../model/userLog');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).send({
            status: false,
            message: "all field Is required"
        })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        res.status(400).json({ status: false, message: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 8);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({
        status: true,
        message: 'Registered',
        data: user
    });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const tokenName = `tf-${Date.now()}`;
        const token = jwt.sign(
            { id: user._id, name: tokenName },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Get user's IP address (safe way)
        const ip =
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        // Save login log
        await UserLog.create({
            user: user._id,
            name: user.name,
            role: user.role,
            ip: ip,
            tokenName: tokenName,
            loginAt: new Date()
        });

        // Send response
        res.json({
            token,
            user: {
                name: user.name,
                role: user.role,
                tokenName: tokenName
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const { tokenName } = req.body;

        if (!tokenName) {
            return res.status(400).json({ message: 'tokenName is required' });
        }

        const updatedLog = await UserLog.findOneAndUpdate(
            { tokenName },
            { logoutAt: new Date() },
            { new: true }
        );

        if (!updatedLog) {
            return res.status(404).json({ message: 'Log entry not found' });
        }

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Server error during logout' });
    }
};
