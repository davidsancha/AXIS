import React from 'react';
import { IMAGES } from '../constants';

const Community: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background-dark pb-24">
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <h2 className="text-white text-base font-semibold uppercase tracking-wider">Comunidade</h2>
        <div className="flex gap-3">
          <button className="flex size-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </header>

      <div className="pt-4 px-4 sticky top-[65px] z-30 bg-background-dark/95 backdrop-blur-sm pb-2">
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          <button className="flex-none px-5 py-2 rounded-full bg-primary text-white text-sm font-medium border border-primary shadow-glow">Populares</button>
          <button className="flex-none px-5 py-2 rounded-full bg-surface-dark text-gray-300 text-sm font-medium border border-white/10">🥗 Nutrição</button>
          <button className="flex-none px-5 py-2 rounded-full bg-surface-dark text-gray-300 text-sm font-medium border border-white/10">💪 Treinos</button>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4">
        {/* Post 1 */}
        <div className="bg-surface-card rounded-2xl border border-primary/30 shadow-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 pl-4 pb-4 bg-primary/10 rounded-bl-3xl border-b border-l border-primary/20">
            <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">push_pin</span> Em destaque
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="size-11 rounded-full bg-cover bg-center ring-2 ring-primary ring-offset-2 ring-offset-surface-card" style={{ backgroundImage: `url("${IMAGES.prof_carlos}")` }}></div>
              </div>
              <div>
                <h4 className="text-white text-sm font-bold flex items-center gap-1">
                  Carlos Mendes <span className="material-symbols-outlined text-[16px] text-blue-400 fill-1">verified</span>
                </h4>
                <span className="text-gray-400 text-xs">Personal Trainer • 2h atrás</span>
              </div>
            </div>
            <h3 className="text-white text-lg font-bold mb-2 leading-tight">Mito ou Verdade: Carboidrato à noite engorda? 🍝</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Vejo muita gente cortando carbo no jantar sem necessidade. O que importa é o balanço calórico total do dia! Se o seu objetivo é hipertrofia, o carbo à noite pode até ajudar na recuperação do sono.
            </p>
            <div className="w-full h-48 bg-surface-dark rounded-xl mb-4 overflow-hidden border border-white/5">
              <div className="w-full h-full bg-cover bg-center opacity-80" style={{ backgroundImage: `url("${IMAGES.post_myth}")` }}></div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-4">
                <button className="flex items-center gap-1.5 text-primary hover:text-primary-hover transition-colors">
                  <span className="material-symbols-outlined text-[20px] fill-1">thumb_up</span>
                  <span className="text-sm font-bold">245</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                  <span className="text-sm font-medium">42</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post 2 */}
        <div className="bg-surface-card rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${IMAGES.prof_julia}")` }}></div>
              <div>
                <h4 className="text-white text-sm font-bold">Dra. Júlia</h4>
                <span className="text-gray-500 text-xs">Fisioterapeuta • 3h atrás</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Dica rápida para quem sente dores no joelho durante o agachamento: verifique a mobilidade do tornozelo! 🦶
          </p>
          <div className="flex gap-2 mb-4">
            <span className="px-2.5 py-1 rounded bg-surface-dark border border-white/5 text-xs text-accent font-medium">#Dicas</span>
            <span className="px-2.5 py-1 rounded bg-surface-dark border border-white/5 text-xs text-accent font-medium">#Fisio</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex gap-4">
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
                <span className="text-sm font-medium">12</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                <span className="text-sm font-medium">8 respostas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;