import React, { useEffect, useState } from 'react';
import { IMAGES } from '../constants';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const data = [
  { name: '01 Set', weight: 83.2 },
  { name: '08 Set', weight: 82.9 },
  { name: '15 Set', weight: 82.7 },
  { name: '22 Set', weight: 82.5 },
  { name: 'Hoje', weight: 82.4 },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
        }
      };

      fetchProfile();
    }
  }, [user]);

  return (
    <div className="flex flex-col h-full bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/5 pt-12 pb-4 px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-12 h-12 rounded-full bg-surface-highlight overflow-hidden border-2 border-primary/30 shadow-inner bg-cover bg-center"
                style={{ backgroundImage: `url("${profile?.avatar_url || IMAGES.user_alex}")` }}
              ></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-[#141414]"></div>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Bom dia</p>
              <h2 className="text-white text-xl font-bold leading-none">
                {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Carregando...'}
              </h2>
            </div>
          </div>
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-surface-highlight border border-white/5 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-white text-[24px]">notifications</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-surface-highlight"></span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
            <span className="material-symbols-outlined text-accent text-[18px]">local_fire_department</span>
            <span className="text-accent text-sm font-bold">12 Dias de Foco</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-6 gap-6 relative z-10 pb-32">
        {/* Workout Card */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-dark border border-white/5 group shadow-lg">
          <div
            className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-center bg-cover"
            style={{ backgroundImage: `url("${IMAGES.workout_bg}")` }}
          ></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent"></div>
          <div className="relative z-10 p-5 flex flex-col h-full justify-between min-h-[160px]">
            <div>
              <div className="flex justify-between items-start">
                <span className="px-2 py-1 rounded bg-white/10 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">Treino de Hoje</span>
                <span className="text-white/60 text-xs font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span> 45 min
                </span>
              </div>
              <h3 className="text-white text-2xl font-bold mt-2 leading-tight w-3/4">Hipertrofia Superior B</h3>
              <p className="text-gray-400 text-sm mt-1">Foco: Peito e Tríceps</p>
            </div>
            <div className="flex items-center justify-end mt-4">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover active:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                Começar
              </button>
            </div>
          </div>
        </section>

        {/* Weight Chart */}
        <section className="rounded-2xl bg-surface-dark border border-white/5 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Evolução do Peso</h3>
            <span className="text-accent text-xs font-bold">-0.8kg</span>
          </div>
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f603c" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1f603c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#9dbeac" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Macros */}
        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-surface-dark border border-white/5 p-4 flex flex-col justify-between aspect-square relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
              </div>
            </div>
            <div className="z-10 mt-2">
              <p className="text-2xl font-bold text-white leading-none">1.850</p>
              <p className="text-xs text-gray-400 mt-1">de 2.200 kcal</p>
            </div>
          </div>
          <div className="rounded-2xl bg-surface-dark border border-white/5 p-4 flex flex-col justify-between aspect-square relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
              </div>
              <button className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
            <div className="z-10 mt-2">
              <p className="text-2xl font-bold text-white leading-none">1.5L</p>
              <p className="text-xs text-gray-400 mt-1">Meta: 3.0L</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

export default Dashboard;