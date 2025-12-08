
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Current user:', user); // Debug
        
        if (!user) {
            navigate('/login');
            return;
        }
        
        if (user?.role !== 'admin') {
            console.log('Not admin, redirecting to dashboard');
            navigate('/dashboard');
            return;
        }
        
        console.log('Fetching admin data...');
        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            setError('');
            
            console.log('Fetching admin stats...');
            // Fetch stats
            const statsResponse = await api.get('/users/admin/stats');
            console.log('Stats response:', statsResponse.data);
            setStats(statsResponse.data.data.stats);
            
            console.log('Fetching all users...');
            // Fetch all users
            const usersResponse = await api.get('/users');
            console.log('Users response:', usersResponse.data);
            setUsers(usersResponse.data.data.users);
            
        } catch (err) {
            console.error('Error fetching admin data:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }
        
        try {
            await api.delete(`/users/${userId}`);
            alert('User deleted successfully');
            fetchAdminData(); // Refresh data
        } catch (err) {
            alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <h2>Loading Admin Dashboard...</h2>
                <p>Fetching data from server...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <h2>Error Loading Admin Dashboard</h2>
                <p>{error}</p>
                <button onClick={fetchAdminData} className="btn-retry">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome, Admin {user?.username}</p>
                <small>User ID: {user?._id} | Role: {user?.role}</small>
            </div>

            {/* Stats Section */}
            {stats && (
                <div className="stats-section">
                    <h2>System Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card admin">
                            <h3>Total Users</h3>
                            <p className="stat-number">{stats.totalUsers}</p>
                            <p className="stat-detail">{stats.newUsersToday} new today</p>
                        </div>
                        <div className="stat-card admin">
                            <h3>Total Albums</h3>
                            <p className="stat-number">{stats.totalAlbums}</p>
                            <p className="stat-detail">{stats.newAlbumsToday} new today</p>
                        </div>
                        <div className="stat-card admin">
                            <h3>Regular Users</h3>
                            <p className="stat-number">{stats.usersByRole?.user || 0}</p>
                        </div>
                        <div className="stat-card admin">
                            <h3>Admin Users</h3>
                            <p className="stat-number">{stats.usersByRole?.admin || 0}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Management Section */}
            <div className="users-section">
                <h2>User Management ({users.length} users)</h2>
                
                {users.length === 0 ? (
                    <div className="no-users">
                        <p>No users found in the system.</p>
                    </div>
                ) : (
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((userItem) => (
                                    <tr key={userItem._id}>
                                        <td>{userItem.username}</td>
                                        <td>{userItem.email}</td>
                                        <td>
                                            <span className={`role-badge ${userItem.role}`}>
                                                {userItem.role}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(userItem.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {userItem._id !== user?._id && (
                                                <button
                                                    onClick={() => handleDeleteUser(userItem._id, userItem.username)}
                                                    className="btn-delete"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="admin-actions">
                <h2>Admin Actions</h2>
                <div className="action-buttons">
                    <button onClick={() => navigate('/albums')} className="admin-btn">
                        Manage All Albums
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="admin-btn secondary">
                        User Dashboard
                    </button>
                    <button onClick={fetchAdminData} className="admin-btn">
                        Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
