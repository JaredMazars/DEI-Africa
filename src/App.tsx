import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MentorDiscovery from './pages/MentorDiscovery';
import ResourceLibrary from './pages/ResourceLibrary';
import Calendar from './pages/CalendarNew';
import Profile from './pages/Profile';
import Discussion from './pages/DiscussionNew';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MentorDetails from './pages/MentorDetail';
import ExpertDirectory from './pages/ExpertDirectory';
import CollaborationHub from './pages/CollaborationHub';
import MentorMatching from './pages/MentorMatching';
import OnboardingForm from './pages/OnboardingForm';
import Home from './pages/Home';
import Preferences from './pages/Preferences';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import MentorshipActivities from './pages/MentorshipActivities';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-lg text-gray-600">Loading One Africa Hub...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't completed onboarding, redirect to onboarding
  if (user.isFirstLogin) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

// Admin Protected Route Component
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (only accessible when not logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-lg text-gray-600">Loading One Africa Hub...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // If user is logged in but hasn't completed onboarding
    if (user.isFirstLogin) {
      return <Navigate to="/onboarding" replace />;
    }
    // If user is logged in and has completed onboarding
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

// App Content Component
function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show Navigation for all authenticated users who have completed onboarding */}
      {user && !user.isFirstLogin && (
        <Navigation />
      )}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Onboarding Route - Special case */}
        <Route path="/onboarding" element={
          user && user.isFirstLogin ? <OnboardingForm /> : <Navigate to="/login" replace />
        } />
        
        {/* Home Route - Main dashboard after onboarding */}
        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />
        
        {/* Protected Routes - Your existing routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/mentors" element={
          <ProtectedRoute><MentorDiscovery /></ProtectedRoute>
        } />
        <Route path="/mentor-matching" element={
          <ProtectedRoute><MentorMatching /></ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute><ResourceLibrary /></ProtectedRoute>
        } />
        <Route path="/discussion" element={
          <ProtectedRoute><Discussion /></ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute><Calendar /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/mentorship-activities" element={
          <ProtectedRoute><MentorshipActivities /></ProtectedRoute>
        } />
        <Route path="/mentor/:id" element={
          <ProtectedRoute><MentorDetails /></ProtectedRoute>
        } />
        <Route path="/experts" element={
          <ProtectedRoute><ExpertDirectory /></ProtectedRoute>
        } />
        <Route path="/collaboration" element={
          <ProtectedRoute><CollaborationHub /></ProtectedRoute>
        } />
        <Route path="/preferences" element={
          <ProtectedRoute><Preferences /></ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;