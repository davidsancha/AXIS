import React from 'react';
import { IMAGES } from '../constants';

interface WelcomeOnboardingProps {
    onNext: () => void;
    firstName: string;
}

const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({ onNext, firstName }) => {
    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-dark text-white p-8 justify-center items-center text-center">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full"></div>

            <div className="relative z-10 flex flex-col gap-6 max-w-sm">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                    <span className="material-symbols-outlined text-4xl text-primary animate-bounce">celebration</span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Bem-vindo, <span className="text-primary">{firstName}</span>!
                </h1>

                <p className="text-gray-400 leading-relaxed">
                    Ficamos felizes em ter você conosco na Kinecis. Para personalizarmos sua experiência e seus resultados, precisamos conhecer você um pouco melhor.
                </p>

                <div className="bg-surface-dark/50 border border-white/5 rounded-2xl p-4 text-left flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-xs text-gray-400">
                        Leva menos de 2 minutos e é fundamental para criarmos seu plano de ação baseado em ciência.
                    </p>
                </div>

                <button
                    onClick={onNext}
                    className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-primary-hover transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary/20 mt-4"
                >
                    <span className="relative text-white text-base font-bold leading-normal tracking-wide flex items-center gap-2">
                        Preencher Perfil
                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default WelcomeOnboarding;
