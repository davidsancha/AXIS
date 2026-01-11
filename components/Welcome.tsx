import React from 'react';
import { IMAGES } from '../constants';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-dark text-white">
      {/* Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-primary/20 blur-[120px] rounded-full opacity-40 pointer-events-none z-0"></div>

      {/* Hero Image */}
      <div className="absolute top-0 left-0 w-full h-[70vh] z-0">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-cover opacity-80 mix-blend-overlay grayscale contrast-125"
          style={{ backgroundImage: `url("${IMAGES.hero_bg}")` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 via-background-dark/60 to-background-dark"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full px-6 py-8">
        <div className="flex justify-center pt-8 opacity-90">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">ecg_heart</span>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/80">Kinecis</span>
          </div>
        </div>

        <div className="flex flex-col gap-8 pb-6">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-white/10 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-medium text-gray-300 tracking-wide">Baseado em ciência</span>
            </div>
            <h1 className="text-white tracking-tight text-[40px] leading-[1.1] font-bold">
              Sua Saúde.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Sem Atalhos.</span>
            </h1>
            <p className="text-gray-400 text-base font-normal leading-relaxed max-w-[90%]">
              Hipertrofia e perda de peso exigem consistência. Acompanhamento especializado para quem busca resultados definitivos.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onStart}
              className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-primary-hover transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <span className="relative text-white text-base font-bold leading-normal tracking-wide flex items-center gap-2">
                Começar Jornada
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </button>
            <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-transparent border border-white/10 hover:bg-white/5 active:bg-white/10 transition-colors text-gray-300 text-sm font-semibold leading-normal tracking-wide">
              <span className="truncate">Já tenho uma conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;