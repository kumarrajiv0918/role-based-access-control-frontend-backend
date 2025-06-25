// 📁 src/pages/AdminLogsPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [logToDelete, setLogToDelete] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/logs', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteLog = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/deleteLog/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLogToDelete(null);
            fetchLogs();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📄 User Logs</h1>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-200 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">IP Address</th>
                            <th className="px-6 py-3">Token Name</th>
                            <th className="px-6 py-3">Login Time</th>
                            <th className="px-6 py-3">Logout Time</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <tr
                                    key={log._id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {log.name} <span className="text-xs text-gray-500">({log.role})</span>
                                    </td>
                                    <td className="px-6 py-4">{log.ip}</td>
                                    <td className="px-6 py-4">{log.tokenName}</td>
                                    <td className="px-6 py-4">
                                        {new Date(log.loginAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.logoutAt
                                            ? new Date(log.logoutAt).toLocaleString()
                                            : <span className="text-gray-400 italic">-</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setLogToDelete(log)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Dialog */}
            {logToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6 text-gray-700">
                            Are you sure you want to delete the log for{" "}
                            <span className="font-semibold">{logToDelete.name}</span>?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setLogToDelete(null)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteLog(logToDelete._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

export default AdminLogsPage;
