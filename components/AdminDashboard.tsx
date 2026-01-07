import React from 'react';
import { IMAGES } from '../constants';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background-dark pb-24">
      <header className="sticky top-0 z-50 bg-[#131f18]/80 backdrop-blur-xl px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-primary" style={{ backgroundImage: `url("${IMAGES.user_carlos}")` }}></div>
            <div className="absolute bottom-0 right-0 size-3 bg-accent rounded-full border-2 border-background-dark"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs font-medium tracking-wide">Bem-vindo de volta,</span>
            <h1 className="text-white text-lg font-bold leading-none">Admin</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 pt-6 gap-6">
        {/* KPI Cards */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="flex flex-col gap-1 z-10 relative">
              <p className="text-gray-400 text-sm font-medium">Usuários Ativos</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-bold text-white">1.240</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="bg-primary/20 text-primary text-xs font-bold px-1.5 py-0.5 rounded flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                </span>
                <span className="text-xs text-gray-500">vs. semana</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="flex flex-col gap-1 z-10 relative">
              <p className="text-gray-400 text-sm font-medium">Receita Mensal</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-bold text-white tracking-tight">45k</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="bg-primary/20 text-primary text-xs font-bold px-1.5 py-0.5 rounded flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 5%
                </span>
                <span className="text-xs text-gray-500">vs. mês</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section>
          <h2 className="text-white text-lg font-bold mb-4 px-1">Acesso Rápido</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: 'group', label: 'Usuários', color: 'text-primary' },
              { icon: 'fitness_center', label: 'Treinos', color: 'text-yellow-500' },
              { icon: 'article', label: 'Planos', color: 'text-blue-400' },
              { icon: 'support_agent', label: 'Suporte', color: 'text-purple-400' }
            ].map((item, index) => (
              <button key={index} className="flex flex-col items-center justify-center gap-2 bg-surface-dark hover:bg-surface-highlight active:scale-95 transition-all p-3 rounded-xl border border-white/5 aspect-square">
                <div className={`bg-white/5 p-2 rounded-full ${item.color}`}>
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                </div>
                <span className="text-[11px] font-medium text-gray-400">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-white text-lg font-bold">Atividade Recente</h2>
            <button className="text-primary text-sm font-bold hover:underline">Ver tudo</button>
          </div>
          <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
              <div className="relative size-10 shrink-0">
                <div className="bg-cover bg-center rounded-full size-10" style={{ backgroundImage: `url("${IMAGES.user_alex}")` }}></div>
                <div className="absolute -bottom-1 -right-1 bg-background-dark p-0.5 rounded-full">
                  <div className="bg-yellow-500 size-3 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[8px] text-black font-bold">star</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">Alex Silva</p>
                <p className="text-gray-400 text-xs truncate">Assinou o plano <span className="text-white font-medium">Gold - Hipertrofia</span></p>
              </div>
              <span className="text-gray-500 text-[10px] font-medium whitespace-nowrap">2 min</span>
            </div>
            <div className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
              <div className="size-10 shrink-0 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">Ticket de Suporte</p>
                <p className="text-gray-400 text-xs truncate">Problema com pagamento #402</p>
              </div>
              <span class="text-gray-500 text-[10px] font-medium whitespace-nowrap">1h atrás</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;