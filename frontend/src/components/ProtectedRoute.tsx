import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
interface ProtectedRouteProps {
    requireAuth?: boolean;
    requireGitHub?: boolean;
    requireProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requireAuth = true,
    requireGitHub = true,
    requireProfile = true
}) => {
    const location = useLocation();

    // Get user from storage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (requireAuth && !token) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (requireGitHub && user && !user.githubId) {
        // Redirect to auth page with a query param to show the modal immediately
        // or a dedicated 'connect' page. Since Auth page handles the modal:
        return <Navigate to="/auth?mode=connect_github" state={{ from: location }} replace />;
    }

    // Check for profile completeness (inferredRole or techStack)
    // We only check this if GitHub is linked, otherwise they might trigger the previous check
    if (requireProfile && user && user.githubId && (!user.inferredRole || !user.techStack || user.techStack.length === 0)) {
        // Handle profile requirements
    }

    return <Layout />;
};

export default ProtectedRoute;
