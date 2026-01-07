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
    <div className="flex flex-col h-full bg-background-dark pb-24">
      <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-base font-bold tracking-tight text-white">Perfil</h1>
        <button className="text-gray-400 text-sm font-medium hover:text-white transition-colors">
          Editar
        </button>
      </header>

      <div className="flex flex-col items-center pt-6 pb-8 px-4">
        <div className="relative group cursor-pointer">
          <div className="size-28 rounded-full p-1 border-2 border-primary/30 relative overflow-hidden">
            <div
              className="w-full h-full rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url("${profile?.avatar_url || IMAGES.user_alex}")` }}
            ></div>
          </div>
          <div className="absolute bottom-1 right-1 bg-surface-highlight rounded-full p-2 border border-background-dark shadow-lg">
            <span className="material-symbols-outlined text-primary text-sm font-bold">photo_camera</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Carregando...'}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1 text-accent text-sm font-medium">
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs uppercase tracking-wide font-bold">
              {profile?.plan || 'Free'}
            </span>
            <span>•</span>
            <span>Hipertrofia</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4">
        <section>
          <h3 className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Conta</h3>
          <div className="flex flex-col overflow-hidden rounded-2xl bg-surface-dark border border-white/5">
            <button className="flex items-center gap-4 p-4 hover:bg-white/5 w-full text-left">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-sm font-semibold leading-tight">Dados Pessoais</p>
              </div>
              <span className="material-symbols-outlined text-gray-500">chevron_right</span>
            </button>
            <div className="h-px w-full bg-white/5 ml-16"></div>
            <button className="flex items-center gap-4 p-4 hover:bg-white/5 w-full text-left">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined">credit_card</span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-sm font-semibold leading-tight">Assinatura</p>
                <p className="text-xs text-primary font-medium">Plano {profile?.plan || 'Free'} Ativo</p>
              </div>
              <span className="material-symbols-outlined text-gray-500">chevron_right</span>
            </button>
          </div>
        </section>

        <section>
          <h3 className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500">App</h3>
          <div className="flex flex-col overflow-hidden rounded-2xl bg-surface-dark border border-white/5">
            {(profile?.is_admin || true) && ( // Temporary simplified admin check
              <button
                onClick={onAdminClick}
                className="flex items-center gap-4 p-4 hover:bg-white/5 w-full text-left"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="text-sm font-semibold leading-tight">Painel Admin</p>
                </div>
                <span className="material-symbols-outlined text-gray-500">chevron_right</span>
              </button>
            )}
            <div className="h-px w-full bg-white/5 ml-16"></div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-4 p-4 hover:bg-white/5 w-full text-left"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-sm font-semibold leading-tight text-red-400">Sair</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;