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
    { id: 'workout', icon: 'fitness_center', label: 'Treino' },
    { id: 'diet', icon: 'restaurant_menu', label: 'Dieta' },
    { id: 'community', icon: 'groups', label: 'Comunidade' },
    { id: 'profile', icon: 'person', label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#141414]/95 backdrop-blur-xl border-t border-white/5 px-6 pb-6 pt-3 z-50">
      <div class="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 w-12 group transition-colors ${
              activeScreen === item.id ? 'text-primary' : 'text-gray-500 hover:text-white'
            }`}
          >
            <div className={`${activeScreen === item.id ? 'bg-primary/10 rounded-full p-1' : ''}`}>
              <span className={`material-symbols-outlined text-[24px] ${activeScreen === item.id ? 'fill-current' : ''}`}>
                {item.icon}
              </span>
            </div>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;