import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './tailwind.css';
import './styles/App.css';
import Clicker from './components/Clicker';
import Jobs from './components/Jobs';
import Assets from './components/Assets';
import Business from './components/Business';
import Education from './components/Education';
import Finance from './components/Finance';
import ThemeToggle from './components/ThemeToggle';
import { GameProvider } from './context/GameContext';
import { StockMarketProvider } from './context/StockMarketContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthContainer from './components/auth/AuthContainer';
import Profile from './components/auth/Profile';
import GameClock from './components/GameClock';
import { useAuth } from './context/AuthContext';

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { currentUser, authInitialized, loading } = useAuth();

  if (loading || !authInitialized) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading... Please wait</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return children;
};

// Login/Register component
function Auth() {
  const { currentUser, authInitialized, loading } = useAuth();

  if (loading || !authInitialized) {
    return (
      <ThemeProvider>
        <div className="app-container flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Loading... Please wait</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (currentUser) {
    return <Navigate to="/app" />;
  }

  return (
    <ThemeProvider>
      <div className="app-container flex items-center justify-center min-h-screen">
        <div className="auth-page-container">
          <h1 className="text-4xl font-bold text-center mb-6">Business Tycoon</h1>
          <AuthContainer onAuthSuccess={() => {
            console.log("Auth success called");
          }} />
        </div>
      </div>
    </ThemeProvider>
  );
}

// Main App Content
function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('clicker');
  const [showProfile, setShowProfile] = useState(false);
  const [error, setError] = useState(null);
  
  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'clicker':
          return <Clicker />;
        case 'jobs':
          return <Jobs />;
        case 'assets':
          return <Assets />;
        case 'business':
          return <Business />;
        case 'education':
          return <Education />;
        case 'finance':
          return <Finance />;
        default:
          return <Clicker />;
      }
    } catch (err) {
      console.error("Error rendering tab content:", err);
      setError(err.message);
      return (
        <div className="p-6 bg-red-100 text-red-800 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Error Loading Content</h3>
          <p>{err.message}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Dismiss
          </button>
        </div>
      );
    }
  };
  
  return (
    <ThemeProvider>
      <GameProvider>
        <StockMarketProvider>
          <div className="app-container">
            {showProfile && (
              <div className="profile-modal-overlay">
                <div className="profile-modal">
                  <Profile onClose={() => setShowProfile(false)} />
                </div>
              </div>
            )}
            <div className="app-content">
              <div className="header-container flex justify-between items-center py-1 px-2">
                <div className="flex items-center">
                  <div className="game-clock-container scale-90">
                    <GameClock />
                  </div>
                </div>
                <div className="user-info-container">
                  <button 
                    onClick={() => setShowProfile(true)}
                    className="profile-button flex items-center text-sm"
                  >
                    <span className="user-display-name mr-2 truncate max-w-[140px]">
                      {currentUser?.displayName || currentUser?.email || 'Guest'}
                    </span>
                    <span className="user-avatar bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs">
                      {(currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'G').toUpperCase()}
                    </span>
                  </button>
                </div>
              </div>
              
              {error ? (
                <div className="p-6 bg-red-100 text-red-800 rounded-lg m-4">
                  <h3 className="text-lg font-bold mb-2">Error</h3>
                  <p>{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
            
            {/* Theme toggle positioned above navbar */}
            {/* <div className="bottom-theme-toggle-container">
              <ThemeToggle />
            </div> */}
            
            <nav className="app-navigation">
              <ul className="nav-list">
                <li className={`nav-item ${activeTab === 'clicker' ? 'active' : ''}`}>
                  <button onClick={() => setActiveTab('clicker')} className="nav-button">
                    <span role="img" aria-label="Work">💼</span>
                    <span className="nav-text">Work</span>
                  </button>
                </li>
                <li className={`nav-item ${activeTab === 'jobs' ? 'active' : ''}`}>
                  <button onClick={() => setActiveTab('jobs')} className="nav-button">
                    <span role="img" aria-label="Jobs">🔍</span>
                    <span className="nav-text">Jobs</span>
                  </button>
                </li>
                <li className={`nav-item ${activeTab === 'assets' ? 'active' : ''}`}>
                  <button onClick={() => setActiveTab('assets')} className="nav-button">
                    <span role="img" aria-label="Banking">🏦</span>
                    <span className="nav-text">Banking</span>
                  </button>
                </li>
                <li className={`nav-item ${activeTab === 'finance' ? 'active' : ''}`}>
                  <button onClick={() => setActiveTab('finance')} className="nav-button">
                    <span role="img" aria-label="Invest">📈</span>
                    <span className="nav-text">Invest</span>
                  </button>
                </li>
                <li className={`nav-item ${activeTab === 'business' ? 'active' : ''}`}>
                  <button onClick={() => setActiveTab('business')} className="nav-button">
                    <span role="img" aria-label="Business">🏢</span>
                    <span className="nav-text">Business</span>
                  </button>
                </li>
                <li className={`nav-item ${activeTab === 'education' ? 'active' : ''}`}>
                  <button onClick={() => setActiveTab('education')} className="nav-button">
                    <span role="img" aria-label="Education">🎓</span>
                    <span className="nav-text">Education</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </StockMarketProvider>
      </GameProvider>
    </ThemeProvider>
  );
}

// Main App wrapper that provides authentication and routing
function AppWithAuth() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default AppWithAuth;
