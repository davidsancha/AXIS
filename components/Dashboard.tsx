import React, { useEffect, useState } from 'react';
import { IMAGES } from '../constants';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import EbookBanner from './EbookBanner';

const weightData = [
  { name: '01 Set', weight: 81.2 },
  { name: '08 Set', weight: 81.5 },
  { name: '15 Set', weight: 82.2 },
  { name: '22 Set', weight: 82.5 },
  { name: 'Hoje', weight: 82.4 },
];

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'peso' | 'medidas' | 'desempenho'>('peso');

  return (
    <div className="flex-1 flex flex-col bg-background-dark overflow-hidden">
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
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5">Bom dia</p>
              <h2 className="text-white text-2xl font-bold leading-none tracking-tight">
                {profile?.first_name ? profile.first_name.split(' ')[0] : 'Atleta'}
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

      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32 no-scrollbar">
        <EbookBanner />

        {/* Workout Card */}
        <section className="relative overflow-hidden rounded-3xl bg-surface-dark border border-white/5 mb-6 shadow-xl">
          <div
            className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-center bg-cover scale-110"
            style={{ backgroundImage: `url("${IMAGES.workout_bg}")` }}
          ></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-background-dark via-background-dark/20 to-transparent"></div>
          <div className="relative z-10 p-6 flex flex-col h-full justify-between min-h-[180px]">
            <div>
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 rounded bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">Treino de Hoje</span>
                <span className="text-white/60 text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> 45 min
                </span>
              </div>
              <h3 className="text-white text-2xl font-bold mt-3 leading-tight">Hipertrofia Superior B</h3>
              <p className="text-gray-400 text-sm mt-1">Foco: Peito e Tríceps</p>
            </div>
            <div className="flex items-center justify-end">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover active:scale-95 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                Começar
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard Tabs Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            {(['peso', 'medidas', 'desempenho'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-500'
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-highlight border border-white/5 text-gray-400">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          </button>
        </div>

        {/* Tab Content: Peso */}
        {activeTab === 'peso' && (
          <div className="flex flex-col gap-6">
            <section className="rounded-3xl bg-surface-dark border border-white/5 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase mb-1">Peso Atual</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white tracking-tight">82.4</span>
                    <span className="text-lg font-bold text-gray-500">kg</span>
                    <span className="text-xs font-bold text-accent flex items-center ml-2">
                      <span className="material-symbols-outlined text-[16px]">trending_down</span>
                      -0.8kg
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs font-bold uppercase mb-1">Meta</p>
                  <p className="text-xl font-bold text-white tracking-tight shrink-0">78.0 kg</p>
                </div>
              </div>

              <div className="h-[140px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1f603c" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#1f603c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#9dbeac"
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                      strokeWidth={3}
                      dot={{ fill: '#9dbeac', strokeWidth: 2, r: 4, stroke: '#121212' }}
                      activeDot={{ r: 6, fill: '#1f603c', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-2 px-1">
                {['01 Set', '08 Set', '15 Set', '22 Set', 'Hoje'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{d}</span>
                ))}
              </div>
            </section>

            {/* Dobras Pollock Section */}
            <section className="rounded-3xl bg-surface-dark border border-white/5 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">straighten</span>
                  <h3 className="text-white font-bold text-sm">Dobras (Pollock 7)</h3>
                </div>
                <button className="text-[10px] font-bold uppercase text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">Histórico</button>
              </div>

              <div className="grid grid-cols-4 gap-x-2 gap-y-6 mb-8">
                {[
                  { label: 'Peit.', value: 45 },
                  { label: 'Axil.', value: 55 },
                  { label: 'Sube.', value: 40 },
                  { label: 'Tric.', value: 30 },
                  { label: 'Supr.', value: 65 },
                  { label: 'Abdo.', value: 75 },
                  { label: 'Coxa', value: 35 },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="w-full aspect-[1/2] bg-surface-highlight rounded-lg relative overflow-hidden flex items-end">
                      <div
                        className="w-full bg-primary/40 border-t border-white/30"
                        style={{ height: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 mt-2 uppercase text-center leading-none">{item.label}</span>
                  </div>
                ))}
                {/* Empty slot to fill the grid if needed, or status */}
                <div className="flex flex-col items-center justify-center bg-primary/5 rounded-lg border border-primary/10 aspect-[1/2]">
                  <span className="material-symbols-outlined text-primary text-xs">done</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Gordura Atual (BF)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">14.2%</span>
                    <span className="text-xs font-bold text-red-400">-1.5%</span>
                  </div>
                </div>
                <button className="bg-surface-highlight text-white border border-white/5 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-white/5 transition-colors shadow-lg active:scale-95">
                  Nova Medição
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Macros Section */}
        <section className="grid grid-cols-2 gap-4 mt-6">
          <div className="rounded-3xl bg-surface-dark border border-white/5 p-5 aspect-square flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full"></div>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 w-fit">
              <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight leading-none">1.850</p>
              <p className="text-[11px] text-gray-500 font-bold uppercase mt-2">de 2.200 kcal</p>
            </div>
          </div>
          <div className="rounded-3xl bg-surface-dark border border-white/5 p-5 aspect-square flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
              </div>
              <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight leading-none">1.5L</p>
              <p className="text-[11px] text-gray-500 font-bold uppercase mt-2">Meta: 3.0L</p>
            </div>
          </div>
        </section>

        {/* Diário de Hoje */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">book</span>
              <h3 className="text-white font-bold text-base">Diário de Hoje</h3>
            </div>
            <button className="text-xs font-bold text-primary opacity-60 uppercase tracking-widest">Ver Completo</button>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Café da Manhã', detail: 'Ovos, Pão Integral • 450 kcal', done: true },
              { label: 'Almoço', detail: 'Registrar refeição', done: false, active: true },
              { label: 'Jantar', detail: 'Agendado para 20:00', done: false, scheduled: true },
            ].map((meal) => (
              <div key={meal.label} className="flex items-center gap-4 p-4 rounded-3xl bg-surface-dark border border-white/5 shadow-sm">
                <div className={`p-2.5 rounded-2xl ${meal.done ? 'bg-primary/10 text-primary' : 'bg-surface-highlight text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[20px]">{meal.label === 'Café da Manhã' ? 'coffee' : meal.label === 'Almoço' ? 'lunch_dining' : 'dinner_dining'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{meal.label}</p>
                  <p className={`text-xs ${meal.done ? 'text-gray-500' : meal.active ? 'text-primary' : 'text-gray-600'}`}>{meal.detail}</p>
                </div>
                {meal.done ? (
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                ) : meal.active ? (
                  <button className="bg-primary/20 text-primary p-1 rounded-lg">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Metas & Lembretes */}
        <section className="grid grid-cols-2 gap-4 mt-8">
          <div className="rounded-3xl bg-surface-dark border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-yellow-500 text-sm">flag</span>
              <h4 className="text-white font-bold text-xs">Metas</h4>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Peso (kg)', current: 82.4, target: 78, progress: 84 },
                { label: 'Treinos/Semana', current: 3, target: 5, progress: 60 },
              ].map(meta => (
                <div key={meta.label}>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1.5 uppercase">
                    <span>{meta.label}</span>
                    <span>{meta.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-highlight rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${meta.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-[10px] font-bold text-primary uppercase tracking-widest w-full text-center">+ Definir nova meta</button>
          </div>
          <div className="rounded-3xl bg-surface-dark border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-purple-500 text-sm">notifications_active</span>
              <h4 className="text-white font-bold text-xs">Lembretes</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Creatina (14h)', checked: true },
                { label: 'Dormir 22h', checked: false },
                { label: 'Foto shape', checked: false },
              ].map(rem => (
                <div key={rem.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border ${rem.checked ? 'bg-primary border-primary' : 'border-gray-700'} flex items-center justify-center`}>
                    {rem.checked && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                  </div>
                  <span className={`text-[11px] font-bold ${rem.checked ? 'text-gray-400' : 'text-gray-500'}`}>{rem.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Histórico de Atividades */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-white font-bold text-base">Histórico de Atividades</h3>
            <button className="text-xs font-bold text-primary opacity-60 uppercase tracking-widest">Ver tudo</button>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Treino de Pernas', time: 'Ontem • 52 min', kcal: '450 kcal', icon: 'fitness_center' },
              { label: 'Cardio HIIT', time: 'Terça • 30 min', kcal: '320 kcal', icon: 'directions_run' },
              { label: 'Meditação Guiada', time: 'Segunda • 15 min', kcal: '', icon: 'self_improvement' },
            ].map((activity) => (
              <div key={activity.label} className="flex items-center gap-4 p-4 rounded-3xl bg-surface-dark border border-white/5">
                <div className="p-2.5 rounded-2xl bg-surface-highlight text-primary">
                  <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{activity.label}</p>
                  <p className="text-[11px] text-gray-500 font-bold uppercase mt-0.5">{activity.time} {activity.kcal && `• ${activity.kcal}`}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                  <span>Concluído</span>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Próxima Sessão Card */}
        <section className="mt-8 rounded-3xl bg-primary/20 border border-primary/30 p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Próxima Sessão</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-white text-lg font-bold mb-1">Consulta Nutricional</h4>
              <p className="text-gray-400 text-xs font-medium">Quinta, 14:00 com Dra. Ana</p>
            </div>
            <button className="size-12 rounded-full bg-white text-primary flex items-center justify-center shadow-xl active:scale-95 transition-transform">
              <span className="material-symbols-outlined font-bold">videocam</span>
            </button>
          </div>
        </section>

        {/* Bottom Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button className="flex items-center justify-center gap-2 bg-surface-highlight border border-white/5 text-white py-4 rounded-2xl font-bold text-xs hover:bg-white/5 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary text-lg">restaurant</span>
            Registrar Refeição
          </button>
          <button className="flex items-center justify-center gap-2 bg-surface-highlight border border-white/5 text-white py-4 rounded-2xl font-bold text-xs hover:bg-white/5 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary text-lg">scale</span>
            Atualizar Peso
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;