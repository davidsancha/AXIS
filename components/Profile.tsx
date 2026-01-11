import React, { useEffect, useState } from 'react';
import { IMAGES } from '../constants';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface ProfileProps {
  onAdminClick: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onAdminClick }) => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState(true);
  const [healthSync, setHealthSync] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
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
    <div className="bg-background-dark pb-32">
      <header className="px-4 py-6 flex items-center justify-between border-b border-white/5">
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-base font-bold tracking-tight text-white">Configurações</h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* Profile Info Section */}
      <div className="flex flex-col items-center pt-8 pb-10 px-4">
        <div className="relative">
          <div className="size-32 rounded-full p-1 border-2 border-primary overflow-hidden">
            <div
              className="w-full h-full rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url("${profile?.avatar_url || IMAGES.user_alex}")` }}
            ></div>
          </div>
          <button className="absolute bottom-1 right-1 bg-primary rounded-full p-2 border-4 border-background-dark shadow-lg active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-white text-sm font-bold">photo_camera</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {profile?.first_name} {profile?.last_name || ''}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold">
              {profile?.plan || 'Free'}
            </span>
            <span className="text-gray-600 font-bold text-sm">•</span>
            <span className="text-gray-400 text-sm font-semibold italic">Hipertrofia</span>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-highlight/50 border border-white/5">
              <span className="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
              <span className="text-xs font-bold text-gray-300">12 Semanas Ativo</span>
            </div>
          </div>
        </div>

        <button className="mt-8 flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all w-full max-w-[240px] justify-center">
          <span className="material-symbols-outlined text-lg">edit</span>
          Editar Perfil
        </button>
      </div>

      <div className="flex flex-col gap-8 px-6">
        {/* Account Section */}
        <section>
          <h3 className="px-2 pb-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Conta</h3>
          <div className="flex flex-col overflow-hidden rounded-3xl bg-surface-dark/40 border border-white/5">
            <button className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="flex flex-1 flex-col items-start">
                <p className="text-sm font-bold text-white mb-0.5">Dados Pessoais</p>
                <p className="text-[11px] text-gray-500 font-medium">Nome, idade, peso inicial</p>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </button>
            <div className="h-px w-[calc(100%-44px)] self-end bg-white/5"></div>

            <button className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="flex flex-1 flex-col items-start">
                <p className="text-sm font-bold text-white mb-0.5">Segurança</p>
                <p className="text-[11px] text-gray-500 font-medium">Senha, 2FA</p>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </button>
            <div className="h-px w-[calc(100%-44px)] self-end bg-white/5"></div>

            <button className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined">credit_card</span>
              </div>
              <div className="flex flex-1 flex-col items-start">
                <p className="text-sm font-bold text-white mb-0.5">Plano & Assinatura</p>
                <p className="text-[11px] text-primary font-bold">Plano {profile?.plan || 'Free'} Ativo</p>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h3 className="px-2 pb-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Preferências</h3>
          <div className="flex flex-col overflow-hidden rounded-3xl bg-surface-dark/40 border border-white/5">
            <div className="flex items-center gap-4 p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <div className="flex flex-1">
                <p className="text-sm font-bold text-white">Notificações Push</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full relative transition-colors ${notifications ? 'bg-primary' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="h-px w-[calc(100%-44px)] self-end bg-white/5"></div>

            <div className="flex items-center gap-4 p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <span className="material-symbols-outlined">add_box</span>
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-bold text-white">Apple Health</p>
                <p className="text-[11px] text-gray-500">Sincronizar passos e cardio</p>
              </div>
              <button
                onClick={() => setHealthSync(!healthSync)}
                className={`w-12 h-6 rounded-full relative transition-colors ${healthSync ? 'bg-primary' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${healthSync ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="h-px w-[calc(100%-44px)] self-end bg-white/5"></div>

            <button className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gray-500/10 text-gray-400 group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined">straighten</span>
              </div>
              <div className="flex flex-1">
                <p className="text-sm font-bold text-white">Unidades</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 font-bold">Métrico (kg, cm)</span>
                <span className="material-symbols-outlined text-gray-700">chevron_right</span>
              </div>
            </button>
          </div>
        </section>

        {/* Support Section */}
        <section>
          <h3 className="px-2 pb-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Suporte</h3>
          <div className="flex flex-col overflow-hidden rounded-3xl bg-surface-dark/40 border border-white/5">
            <button className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gray-500/10 text-gray-400 group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined">help</span>
              </div>
              <div className="flex flex-1">
                <p className="text-sm font-bold text-white">Central de Ajuda</p>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </button>
            <div className="h-px w-[calc(100%-44px)] self-end bg-white/5"></div>

            <button className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gray-500/10 text-gray-400 group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="flex flex-1">
                <p className="text-sm font-bold text-white">Termos e Privacidade</p>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Admin Section (Restricted) */}
        {profile?.is_admin && (
          <section>
            <h3 className="px-2 pb-3 text-[11px] font-black uppercase tracking-[0.2em] text-purple-400">Admin</h3>
            <div className="flex flex-col overflow-hidden rounded-3xl bg-surface-dark/40 border border-purple-500/10">
              <button
                onClick={onAdminClick}
                className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 group-active:scale-90 transition-transform">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                </div>
                <div className="flex flex-1">
                  <p className="text-sm font-bold text-white">Painel de Controle</p>
                </div>
                <span className="material-symbols-outlined text-gray-700">chevron_right</span>
              </button>
            </div>
          </section>
        )}

        <div className="py-10 flex flex-col items-center gap-6">
          <button
            onClick={() => signOut()}
            className="text-red-500 font-black text-sm uppercase tracking-widest hover:text-red-400 transition-colors active:scale-95"
          >
            Sair da Conta
          </button>
          <div className="text-center">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[.2em]">Versão 2.4.0 (Build 302)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;