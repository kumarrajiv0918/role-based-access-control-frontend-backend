const UserLog = require('../model/userLog');

exports.getLogs = async (req, res) => {
    try {
        const logs = await UserLog.find().sort({ loginAt: -1 });
        return res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        return res.status(500).json({ message: "Failed to retrieve logs" });
    }
};

exports.deleteLog = async (req, res) => {
    try {
        const log = await UserLog.findById(req.params.id);
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }

        await log.deleteOne();
        return res.status(200).json({ message: 'Log deleted successfully' });
    } catch (error) {
        console.error("Delete Log Error:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

