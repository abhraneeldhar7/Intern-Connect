import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';

// Layouts
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseInternships from './pages/student/BrowseInternships';
import CompanyDashboard from './pages/company/CompanyDashboard';
import ManageInternships from './pages/company/ManageInternships';
import ViewApplicants from './pages/company/ViewApplicants';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }: { children?: React.ReactNode, allowedRole?: UserRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    // Redirect to their own dashboard if role doesn't match
    return <Navigate to={user?.role === UserRole.STUDENT ? '/dashboard' : '/company/dashboard'} replace />;
  }

  return <>{children}</>;
};

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <MobileNav />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRole={UserRole.STUDENT}>
              <AppLayout><StudentDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/internships" element={
            <ProtectedRoute allowedRole={UserRole.STUDENT}>
              <AppLayout><BrowseInternships /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute allowedRole={UserRole.STUDENT}>
              <AppLayout><StudentDashboard /></AppLayout> {/* Reusing dashboard for demo of apps view */}
            </ProtectedRoute>
          } />

          {/* Company Routes */}
          <Route path="/company/dashboard" element={
            <ProtectedRoute allowedRole={UserRole.COMPANY}>
              <AppLayout><CompanyDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/create" element={
            <ProtectedRoute allowedRole={UserRole.COMPANY}>
              <AppLayout><ManageInternships /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/applicants" element={
            <ProtectedRoute allowedRole={UserRole.COMPANY}>
              <AppLayout><ViewApplicants /></AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;