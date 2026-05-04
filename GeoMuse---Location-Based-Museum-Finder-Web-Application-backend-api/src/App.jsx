import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import MuseumDetailPage from './pages/MuseumDetailPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Chatbot from './components/Chatbot';

function App() {
  const location = useLocation();
  const showChatbot = location.pathname.startsWith('/map') || location.pathname.startsWith('/museum');

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/museum/:id" element={<MuseumDetailPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {showChatbot && <Chatbot />}
    </>
  );
}

export default App;
