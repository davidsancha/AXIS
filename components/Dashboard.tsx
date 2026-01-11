import React from 'react';
import { IMAGES } from '../constants';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { useAuth } from './AuthContext';
import { ScreenType } from '../types';

const fatEvolutionData = [
  { name: 'JUL', value: 18.5 },
  { name: 'AGO', value: 16.2 },
  { name: 'SET', value: 15.1 },
  { name: 'OUT', value: 14.5 },
];

interface DashboardProps {
  onNavigate: (screen: ScreenType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { profile } = useAuth();

  return (
    <div className="bg-background-dark pb-32 min-h-screen">
      {/* Header */}
      <header className="pt-12 pb-2 px-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="size-12 rounded-full bg-surface-highlight overflow-hidden border-2 border-primary/30 shadow-inner bg-cover bg-center"
                style={{ backgroundImage: `url("${profile?.avatar_url || IMAGES.user_alex}")` }}
              ></div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#121212]"></div>
            </div>
            <div>
              <h2 className="text-white text-xl font-bold leading-none tracking-tight">
                Olá, {profile?.first_name ? profile.first_name.split(' ')[0] : 'Atleta'}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-green-500 text-[14px]">local_fire_department</span>
                <p className="text-green-500 text-[10px] font-bold uppercase tracking-wider">12 Dias de Foco</p>
              </div>
            </div>
          </div>
          <button className="relative size-10 flex items-center justify-center rounded-full bg-surface-highlight hover:bg-white/5 border border-white/5 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-gray-300 text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-3 size-2 bg-red-500 rounded-full border border-surface-highlight"></span>
          </button>
        </div>
      </header>

      <div className="px-6 flex flex-col gap-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-card rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/5">
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center">Gordura %</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-white">14.5</span>
              <span className="text-[10px] font-bold text-gray-500">%</span>
            </div>
          </div>
          <div className="bg-surface-card rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/5">
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center">Massa Magra</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-white">72.4</span>
              <span className="text-[10px] font-bold text-gray-500">kg</span>
            </div>
          </div>
          <div className="bg-surface-card rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/5">
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center">Massa Gorda</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-white">10.8</span>
              <span className="text-[10px] font-bold text-gray-500">kg</span>
            </div>
          </div>
        </div>

        {/* Evolution Chart */}
        <div className="bg-surface-card rounded-3xl p-5 border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500 text-lg">trending_down</span>
              <h3 className="text-white font-bold text-sm">Evolução (% Gordura)</h3>
            </div>
            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
              -1.2% este mês
            </span>
          </div>

          <div className="h-32 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fatEvolutionData}>
                <defs>
                  <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', borderRadius: '8px', padding: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4ade80"
                  strokeWidth={3}
                  fill="url(#colorFat)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workout Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#1e1e1e] border border-white/5 h-64 flex flex-col justify-end p-6 group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10"></div>
          {/* Background Image placeholder */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-background-dark to-background-dark z-0"></div>

          <div className="relative z-20">
            <div className="inline-flex items-center px-2.5 py-1 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm mb-3">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Treino de Hoje</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">Hipertrofia Superior B</h3>
            <p className="text-gray-400 text-xs font-medium mb-6">Foco: Peito e Tríceps • 45 min</p>

            <button className="w-full bg-[#1f603c] hover:bg-[#267549] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-black/20 text-shadow">
              <span className="material-symbols-outlined text-[20px]">play_arrow</span>
              Começar
            </button>
          </div>
        </section>

        {/* Trackers */}
        <div className="grid grid-cols-2 gap-4">
          {/* Calories */}
          <div className="bg-surface-card rounded-3xl p-5 border border-white/5 flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="absolute top-0 right-0 size-20 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/10">
                <span className="material-symbols-outlined">local_fire_department</span>
              </div>
              <button className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Diário Hoje</p>
              <h4 className="text-2xl font-bold text-white">1.850</h4>
              <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-orange-500 w-3/4 h-full rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Hydration */}
          <div className="bg-surface-card rounded-3xl p-5 border border-white/5 flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="absolute top-0 right-0 size-20 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
              <button className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Hidratação</p>
              <h4 className="text-2xl font-bold text-white">1.5L</h4>
              <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 w-1/2 h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Action Banner */}
        <button
          onClick={() => onNavigate('meal_registration')}
          className="relative w-full h-24 bg-[#1f603c] rounded-3xl overflow-hidden shadow-xl active:scale-95 transition-transform group flex items-center px-6 border border-white/5 hover:bg-[#267549]"
        >
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-black/20 to-transparent"></div>
          <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mr-4 border border-white/10">
            <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
          </div>
          <div className="flex flex-col items-start z-10">
            <h3 className="text-white font-bold text-lg leading-tight">Registrar Refeição</h3>
            <p className="text-green-100/70 text-xs font-medium">Bateu seus macros de hoje?</p>
          </div>
          <div className="ml-auto size-10 rounded-full bg-white/20 flex items-center justify-center text-white z-10 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
            <span className="material-symbols-outlined">add</span>
          </div>
        </button>

        {/* Notifications / Shortcuts Title */}
        <div className="flex items-center justify-between pt-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Notificações Recentes</span>
          <div className="size-1.5 rounded-full bg-red-500"></div>
        </div>

        {/* Notification Item */}
        <div className="bg-surface-card rounded-2xl p-4 border border-white/5 flex items-center gap-4">
          <p className="text-xs text-gray-300 font-medium line-clamp-2">
            Seu plano de treino foi atualizado pelo Coach.
          </p>
        </div>

        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-4">Atalhos e Comunidade</span>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-3 gap-3 pb-8">
          {[
            { label: 'Comunidade', icon: 'groups', screen: 'community' as ScreenType },
            { label: 'Conteúdos', icon: 'article', screen: 'workout' as ScreenType },
            { label: 'Ajustes', icon: 'settings', screen: 'profile' as ScreenType },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className="aspect-square bg-surface-card rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all group"
            >
              <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors">{item.icon}</span>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors">{item.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;