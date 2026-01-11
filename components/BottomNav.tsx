import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  if (activeScreen === 'welcome') return null;

  const navItems: { id: ScreenType; icon: string; label: string }[] = [
    { id: 'dashboard', icon: 'home', label: 'Início' },
    { id: 'workout_list', icon: 'fitness_center', label: 'Treino' },
    { id: 'diet', icon: 'restaurant_menu', label: 'Dieta' },
    { id: 'profile', icon: 'person', label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-2xl border-t border-white/5 py-4 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto px-4 relative">
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 w-14 transition-all ${activeScreen === item.id ? 'text-primary scale-110' : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeScreen === item.id ? 'fill-current' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </button>
        ))}

        {/* Central Plus Button */}
        <div className="relative -top-3">
          <button className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-3xl font-bold">add</span>
          </button>
        </div>

        {navItems.slice(2).map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 w-14 transition-all ${activeScreen === item.id ? 'text-primary scale-110' : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeScreen === item.id ? 'fill-current' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;