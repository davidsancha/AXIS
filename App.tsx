import React, { useState } from 'react';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import BottomNav from './components/BottomNav';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ScreenType } from './types';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeScreen, setActiveScreen] = useState<ScreenType>('welcome');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  const renderScreen = () => {
    // If not logged in and not on welcome screen, show login
    if (!user && activeScreen !== 'welcome') {
      return <LoginPage />;
    }

    switch (activeScreen) {
      case 'welcome':
        return <Welcome onStart={() => user ? setActiveScreen('dashboard') : setActiveScreen('dashboard')} />; // Simplified logic
      case 'dashboard':
        return <Dashboard />;
      case 'workout':
        return (
          <div className="flex items-center justify-center h-screen bg-background-dark text-white p-6 text-center">
            <div>
              <span className="material-symbols-outlined text-6xl text-primary mb-4">fitness_center</span>
              <h2 className="text-2xl font-bold mb-2">Treinos</h2>
              <p className="text-gray-400">Funcionalidade em desenvolvimento.</p>
            </div>
          </div>
        );
      case 'diet':
        return (
          <div className="flex items-center justify-center h-screen bg-background-dark text-white p-6 text-center">
            <div>
              <span className="material-symbols-outlined text-6xl text-orange-500 mb-4">restaurant_menu</span>
              <h2 className="text-2xl font-bold mb-2">Dieta</h2>
              <p className="text-gray-400">Funcionalidade em desenvolvimento.</p>
            </div>
          </div>
        );
      case 'community':
        return <Community />;
      case 'profile':
        return <Profile onAdminClick={() => setActiveScreen('admin')} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black relative overflow-hidden shadow-2xl">
      {renderScreen()}
      {user && activeScreen !== 'welcome' && activeScreen !== 'admin' && (
        <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
      )}
      {activeScreen === 'admin' && (
        <button
          onClick={() => setActiveScreen('profile')}
          className="fixed bottom-6 right-6 bg-surface-highlight border border-white/10 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar
        </button>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;