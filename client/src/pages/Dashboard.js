
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        username: user?.username || '',
        email: user?.email || ''
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.patch('/users/profile', updateForm);
            
            // Update user in localStorage and context
            const updatedUser = response.data.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload(); // Simple way to refresh user data
            
            setMessage({ 
                type: 'success', 
                text: 'Profile updated successfully!' 
            });
            
            setTimeout(() => {
                setShowUpdateModal(false);
                setMessage({ type: '', text: '' });
            }, 2000);
            
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to update profile' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Validation
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setLoading(false);
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            setLoading(false);
            return;
        }

        try {
            const response = await api.patch('/users/updatePassword', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            
            // Update token if returned
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            
            setMessage({ 
                type: 'success', 
                text: 'Password updated successfully!' 
            });
            
            // Reset form
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            setTimeout(() => {
                setShowPasswordModal(false);
                setMessage({ type: '', text: '' });
            }, 2000);
            
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to update password' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user?.username}!</h1>
                <button onClick={handleLogout} className="btn-logout">Logout</button>        
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Your Role</h3>
                    <p className="role-badge">{user?.role}</p>
                </div>
                <div className="stat-card">
                    <h3>Member Since</h3>
                    <p>{formatDate(user?.createdAt)}</p>
                </div>
                <div className="stat-card">
                    <h3>Email</h3>
                    <p>{user?.email}</p>
                </div>
            </div>

            <div className="dashboard-actions">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <button onClick={() => navigate('/albums')} className="action-btn">      
                        Manage Albums
                    </button>
                    <button onClick={() => setShowUpdateModal(true)} className="action-btn secondary">
                        Update Profile
                    </button>
                    <button onClick={() => setShowPasswordModal(true)} className="action-btn secondary">
                        Change Password
                    </button>
                </div>
            </div>

            {/* Update Profile Modal */}
            {showUpdateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Update Profile</h2>
                            <button onClick={() => setShowUpdateModal(false)} className="close-btn">&times;</button>
                        </div>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label>Username</label>
                                <input 
                                    type="text" 
                                    value={updateForm.username}
                                    onChange={(e) => setUpdateForm({...updateForm, username: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    value={updateForm.email}
                                    onChange={(e) => setUpdateForm({...updateForm, email: e.target.value})}
                                    required
                                />
                            </div>
                            {message.text && (
                                <div className={`message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowUpdateModal(false)} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={loading}>
                                    {loading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Change Password</h2>
                            <button onClick={() => setShowPasswordModal(false)} className="close-btn">&times;</button>
                        </div>
                        <form onSubmit={handleUpdatePassword}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input 
                                    type="password" 
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input 
                                    type="password" 
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                    required
                                    minLength="6"
                                />
                            </div>
                            {message.text && (
                                <div className={`message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowPasswordModal(false)} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={loading}>
                                    {loading ? 'Updating...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
