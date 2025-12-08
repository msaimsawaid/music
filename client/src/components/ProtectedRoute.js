
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requireAdmin = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // If not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If admin required but user is not admin
    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // If all checks pass, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
