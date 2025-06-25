const Task = require('../model/task');

exports.getTasks = async (req, res) => {
    try {
        const filter = { user: req.user._id };

        if (req.query.completed !== undefined) {
            filter.completed = req.query.completed === 'true';
        }

        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: 'i' };
        }

        const tasks = await Task.find(filter);

        if (!tasks.length) {
            return res.status(404).send({
                status: false,
                message: "No tasks found."
            });
        }

        return res.status(200).send({
            status: true,
            message: "Tasks retrieved successfully.",
            data: tasks
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "An error occurred while retrieving tasks.",
            error: error.message
        });
    }
};

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, user: req.user._id });

        return res.status(201).send({
            status: true,
            message: "Task created successfully.",
            data: task
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: "Failed to create task.",
            error: error.message
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).send({
                status: false,
                message: "Task not found or unauthorized.",
                data: null
            });
        }

        return res.status(200).send({
            status: true,
            message: "Task updated successfully.",
            data: updated
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: "Failed to update task.",
            error: error.message
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!deleted) {
            return res.status(404).send({
                status: false,
                message: "Task not found or unauthorized.",
                data: null
            });
        }

        return res.status(200).send({
            status: true,
            message: "Task deleted successfully.",
            data: deleted
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: "Failed to delete task.",
            error: error.message
        });
    }
};
