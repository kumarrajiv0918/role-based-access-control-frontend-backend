// 📁 frontend/src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newCompleted, setNewCompleted] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const tokenName = user?.tokenName;
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const isAdmin = () => user?.role === 'admin';

    const fetchTasks = async () => {
        if (!token) return;
        const params = {};
        if (filter !== '') params.completed = filter;
        if (search) params.search = search;

        try {
            const res = await axios.get('http://localhost:5000/api/tasks', {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(res.data.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return alert('Title is required');
        if (!token) return;

        try {
            await axios.post(
                'http://localhost:5000/api/tasks',
                { title: newTitle, completed: newCompleted },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewTitle('');
            setNewCompleted(false);
            fetchTasks();
        } catch (err) {
            console.error('Error creating task:', err);
        }
    };

    const startEdit = (task) => {
        setEditingTask(task);
        setNewTitle(task.title);
        setNewCompleted(task.completed);
        setShowEditDialog(true);
    };

    const updateTask = async () => {
        if (!editingTask || !newTitle.trim()) return;
        if (!token) return;
        try {
            await axios.put(
                `http://localhost:5000/api/tasks/${editingTask._id}`,
                { title: newTitle, completed: newCompleted },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditingTask(null);
            setNewTitle('');
            setNewCompleted(false);
            setShowEditDialog(false);
            fetchTasks();
        } catch (err) {
            console.error('Error updating task:', err);
        }
    };

    const deleteTask = async (id) => {
        if (!token) return;
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setConfirmDeleteId(null);
            fetchTasks();
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                'http://localhost:5000/api/auth/logout',
                { tokenName },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filter, search]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📂 Task Dashboard</h1>
                <div className="flex gap-4">
                    {isAdmin() && (
                        <button
                            onClick={() => navigate('/admin/logs')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
                        >
                            Admin Logs
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <form onSubmit={createTask} className="mb-6 p-4 border rounded bg-white shadow">
                <h2 className="text-xl font-semibold mb-2">➕ Create New Task</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Task title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="border p-2 rounded w-full sm:w-auto flex-1"
                        required
                    />
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={newCompleted}
                            onChange={(e) => setNewCompleted(e.target.checked)}
                            className="mr-2"
                        />
                        Completed
                    </label>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
                        Add Task
                    </button>
                </div>
            </form>

            <div className="flex flex-wrap gap-4 mb-6">
                <select onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded">
                    <option value="">All</option>
                    <option value="true">Completed</option>
                    <option value="false">Incomplete</option>
                </select>

                <input
                    type="text"
                    placeholder="🔍 Search title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>

            <ul className="space-y-3">
                {tasks.map((task) => (
                    <li key={task._id} className="bg-white border rounded shadow p-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-lg text-gray-800">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.completed ? '✅ Completed' : '❌ Incomplete'}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => startEdit(task)}
                                className="text-blue-600 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setConfirmDeleteId(task._id)}
                                className="text-red-600 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Edit Dialog */}
            {showEditDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow w-96">
                        <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full border p-2 rounded mb-3"
                        />
                        <label className="block mb-4">
                            <input
                                type="checkbox"
                                checked={newCompleted}
                                onChange={(e) => setNewCompleted(e.target.checked)}
                                className="mr-2"
                            />
                            Completed
                        </label>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditDialog(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateTask}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Dialog */}
            {confirmDeleteId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow w-96">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete this task?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteTask(confirmDeleteId)}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
