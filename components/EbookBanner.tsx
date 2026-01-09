import React from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const EbookBanner: React.FC = () => {
    const { profile, refreshProfile } = useAuth();

    if (!profile || profile.has_downloaded_ebook || profile.ebook_banner_dismissed) {
        return null;
    }

    const handleDismiss = async () => {
        const { error } = await supabase
            .from('profiles')
            .update({ ebook_banner_dismissed: true })
            .eq('id', profile.id);

        if (!error) refreshProfile();
    };

    const handleDownload = async () => {
        // Here we would trigger the actual download
        alert('Seu Ebook grátis está sendo enviado para seu e-mail!');

        const { error } = await supabase
            .from('profiles')
            .update({ has_downloaded_ebook: true })
            .eq('id', profile.id);

        if (!error) refreshProfile();
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-6 mb-8 shadow-xl shadow-primary/20">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                        <span className="material-symbols-outlined text-sm">auto_stories</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Presente de boas-vindas</span>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Ebook Grátis: Guia de Hipertrofia</h3>
                    <p className="text-white/80 text-sm leading-relaxed max-w-[85%]">
                        O passo a passo baseado em ciência para acelerar seus resultados nos primeiros 90 dias.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleDownload}
                        className="bg-white text-primary font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm hover:bg-gray-100 transition-colors"
                    >
                        Baixar Agora
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="text-white/80 text-sm font-medium hover:text-white px-2 py-2.5 transition-colors"
                    >
                        Não tenho interesse
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EbookBanner;
