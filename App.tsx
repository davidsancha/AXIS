import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import BottomNav from './components/BottomNav';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './components/AuthContext';
import WelcomeOnboarding from './components/WelcomeOnboarding';
import OnboardingForm from './components/OnboardingForm';
import MealRegistration from './components/MealRegistration';
import ExerciseLibrary from './components/ExerciseLibrary';
import AdminExercisePanel from './components/AdminExercisePanel';
import WorkoutList from './components/WorkoutList';
import WorkoutCreator from './components/WorkoutCreator';
import WorkoutEditor from './components/WorkoutEditor';
import { ScreenType } from './types';

const AppContent: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [activeScreen, setActiveScreen] = useState<ScreenType>('welcome');
  const [isOnboardingWelcome, setIsOnboardingWelcome] = useState(false);
  const [isOnboardingForm, setIsOnboardingForm] = useState(false);
  const [currentWorkoutId, setCurrentWorkoutId] = useState<string | null>(null);

  // Redirect to dashboard if logged in but on welcome screen (fixes disappearing nav)
  useEffect(() => {
    if (user && profile?.onboarding_completed && activeScreen === 'welcome') {
      setActiveScreen('dashboard');
    }
  }, [user, profile, activeScreen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  const renderScreen = () => {
    // 1. Initial Welcome Screen (not logged in)
    if (!user && activeScreen === 'welcome') {
      return <Welcome onStart={() => setActiveScreen('dashboard')} />;
    }

    // 2. Login Flow (if not logged in and attempted to enter)
    if (!user) {
      return <LoginPage />;
    }

    // 3. Onboarding Flow (if logged in but profile incomplete)
    if (profile && !profile.onboarding_completed) {
      if (isOnboardingForm) {
        return <OnboardingForm onComplete={() => {
          setIsOnboardingForm(false);
          setActiveScreen('dashboard');
        }} />;
      }
      return <WelcomeOnboarding
        firstName={profile.first_name || user.email?.split('@')[0] || 'Atleta'}
        onNext={() => setIsOnboardingForm(true)}
      />;
    }

    // 4. Main App Flow
    switch (activeScreen) {
      case 'welcome':
        // If user is already logged in and profile is complete, don't show welcome
        return <Dashboard onNavigate={setActiveScreen} />;
      case 'dashboard':
        return <Dashboard onNavigate={setActiveScreen} />;
      case 'workout_list':
        return (
          <WorkoutList
            onNavigate={setActiveScreen}
            onSelectWorkout={(id) => {
              setCurrentWorkoutId(id);
              setActiveScreen('workout_editor');
            }}
          />
        );
      case 'workout_creator':
        return (
          <WorkoutCreator
            onBack={() => setActiveScreen('workout_list')}
            onCreated={(id) => {
              setCurrentWorkoutId(id);
              setActiveScreen('workout_editor');
            }}
          />
        );
      case 'workout_editor':
        if (!currentWorkoutId) return <WorkoutList onNavigate={setActiveScreen} onSelectWorkout={() => { }} />;
        return (
          <WorkoutEditor
            workoutId={currentWorkoutId}
            onBack={() => setActiveScreen('workout_list')}
          />
        );
      case 'diet':
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-background-dark text-white p-6 text-center pb-32">
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
        // Direct admin click to the Exercise Panel as requested
        return <Profile onAdminClick={() => setActiveScreen('admin_exercises')} />;
      case 'admin':
        return <AdminDashboard />;
      case 'admin_exercises':
        return <AdminExercisePanel onBack={() => setActiveScreen('profile')} />;
      case 'library':
        return <ExerciseLibrary onBack={() => setActiveScreen('dashboard')} />;
      case 'meal_registration':
        return <MealRegistration onBack={() => setActiveScreen('dashboard')} onSave={() => setActiveScreen('dashboard')} />;
      default:
        return <Dashboard onNavigate={setActiveScreen} />;
    }
  };

  const showNav = user && profile?.onboarding_completed && activeScreen !== 'welcome' && activeScreen !== 'admin' && activeScreen !== 'meal_registration';

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-black relative overflow-hidden shadow-2xl flex flex-col">
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {renderScreen()}
      </main>
      {showNav && (
        <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
      )}
      {activeScreen === 'admin' && (
        <button
          onClick={() => setActiveScreen('profile')}
          className="absolute bottom-6 right-6 bg-surface-highlight border border-white/10 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2"
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