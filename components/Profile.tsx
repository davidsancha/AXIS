import React, { useEffect, useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
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
  const [activeView, setActiveView] = useState<'overview' | 'edit_personal' | 'edit_billing'>('overview');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    birth_date: '',
    gender: '',
    height: '',
    cpf: '',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_city: '',
    address_state: '',
    address_zip: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            phone: data.phone || '',
            birth_date: data.birth_date || '',
            gender: data.gender || '',
            height: data.height || '',
            cpf: data.cpf || '',
            address_street: data.address_street || '',
            address_number: data.address_number || '',
            address_complement: data.address_complement || '',
            address_city: data.address_city || '',
            address_state: data.address_state || '',
            address_zip: data.address_zip || '',
          });
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!formData.cpf) {
      alert('CPF é um campo obrigatório.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...formData });
      setActiveView('overview');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImage(reader.result as string);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleSaveAvatar = async () => {
    if (!tempImage || !croppedAreaPixels || !user) return;
    setLoading(true);
    try {
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);

      // In a real app, upload to storage. For now, we'll update the profile with base64/placeholder
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: croppedImage, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, avatar_url: croppedImage });
      setShowCropper(false);
      setTempImage(null);
    } catch (error) {
      console.error('Error saving avatar:', error);
      alert('Erro ao salvar foto.');
    } finally {
      setLoading(false);
    }
  };

  const CustomSelect = ({ label, value, options, onChange }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="flex flex-col gap-2 relative">
        <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">{label}</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all flex justify-between items-center"
        >
          <span className={value ? 'text-white' : 'text-gray-500'}>
            {value ? options.find((o: any) => o.value === value)?.label : 'Selecionar'}
          </span>
          <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-highlight border border-white/5 rounded-2xl overflow-hidden z-50 shadow-2xl">
            {options.map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3.5 text-sm hover:bg-primary/10 transition-colors ${value === opt.value ? 'text-primary font-bold bg-primary/5' : 'text-white'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <>
      {/* Profile Info Section */}
      <div className="flex flex-col items-center pt-8 pb-10 px-4">
        <div className="relative">
          <div className="size-32 rounded-full p-1 border-2 border-primary overflow-hidden">
            <div
              className="w-full h-full rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url("${profile?.avatar_url || IMAGES.user_alex}")` }}
            ></div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          <button
            onClick={() => setShowCameraOptions(true)}
            className="absolute bottom-1 right-1 bg-primary rounded-full size-10 flex items-center justify-center border-4 border-background-dark shadow-lg active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-white text-[20px] font-bold">photo_camera</span>
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

        <button
          onClick={() => setActiveView('edit_personal')}
          className="mt-8 flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all w-full max-w-[240px] justify-center"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
          Editar Perfil
        </button>
      </div>

      <div className="flex flex-col gap-8 px-6">
        {/* Account Section */}
        <section>
          <h3 className="px-2 pb-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Conta</h3>
          <div className="flex flex-col overflow-hidden rounded-3xl bg-surface-dark/40 border border-white/5">
            <button
              onClick={() => setActiveView('edit_personal')}
              className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="flex flex-1 flex-col items-start">
                <p className="text-sm font-bold text-white mb-0.5">Dados Pessoais</p>
                <p className="text-[11px] text-gray-500 font-medium">Nome, contatos, endereços</p>
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

            <button
              onClick={() => setActiveView('edit_billing')}
              className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div className="flex flex-1 flex-col items-start">
                <p className="text-sm font-bold text-white mb-0.5">Métodos de Pagamento</p>
                <p className="text-[11px] text-gray-500 font-medium">Cartões e faturamento</p>
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
    </>
  );

  const renderEditPersonal = () => (
    <div className="px-6 py-4 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
      <section>
        <h3 className="px-2 pb-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Dados Pessoais</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">CPF *</label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
              placeholder="000.000.000-00"
              required
              className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Nome</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Sobrenome</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Nascimento</label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all color-scheme-dark"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Altura (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="175"
                className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
          </div>
          <CustomSelect
            label="Gênero"
            value={formData.gender}
            options={[
              { label: 'Masculino', value: 'masculino' },
              { label: 'Feminino', value: 'feminino' },
              { label: 'Outro', value: 'outro' }
            ]}
            onChange={(val: string) => setFormData({ ...formData, gender: val })}
          />
        </div>
      </section>

      <section>
        <h3 className="px-2 pb-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Contatos</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
              placeholder="(00) 00000-0000"
              className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all font-mono"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="px-2 pb-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Endereço</h3>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-[1fr_80px] gap-4">
            <div className="flex flex-col gap-2">
              <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Rua</label>
              <input
                type="text"
                value={formData.address_street}
                onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
                className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Nº</label>
              <input
                type="text"
                value={formData.address_number}
                onChange={(e) => setFormData({ ...formData, address_number: e.target.value })}
                className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Complemento</label>
            <input
              type="text"
              value={formData.address_complement}
              onChange={(e) => setFormData({ ...formData, address_complement: e.target.value })}
              placeholder="Apt, Bloco, etc"
              className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Cidade</label>
              <input
                type="text"
                value={formData.address_city}
                onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
                className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">Estado</label>
              <input
                type="text"
                value={formData.address_state}
                onChange={(e) => setFormData({ ...formData, address_state: e.target.value })}
                className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="px-2 text-[10px] font-bold text-gray-500 uppercase">CEP</label>
            <input
              type="text"
              value={formData.address_zip}
              onChange={(e) => setFormData({ ...formData, address_zip: e.target.value })}
              className="bg-surface-dark/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-primary/50 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-4 pb-12">
        <button
          onClick={handleSaveProfile}
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        <button
          onClick={() => setActiveView('overview')}
          className="w-full bg-white/5 text-gray-400 py-4 rounded-2xl font-bold transition-all hover:text-white active:scale-95"
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  const renderBillingView = () => (
    <div className="px-6 py-12 flex flex-col items-center justify-center gap-4 text-center animate-in slide-in-from-right duration-300">
      <div className="size-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-blue-400 text-4xl">payments</span>
      </div>
      <h3 className="text-xl font-bold text-white">Métodos de Pagamento</h3>
      <p className="text-sm text-gray-500 max-w-[280px]">
        A gestão de cartões e histórico de faturamento estará disponível em breve através da nossa integração segura.
      </p>
      <button
        onClick={() => setActiveView('overview')}
        className="mt-6 px-8 py-3 bg-white/5 text-white rounded-2xl font-bold text-sm active:scale-95 transition-all"
      >
        Voltar para Perfil
      </button>
    </div>
  );

  return (
    <div className="bg-background-dark pb-32">
      <header className="px-4 py-6 flex items-center justify-between border-b border-white/5 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <button
          onClick={() => activeView === 'overview' ? null : setActiveView('overview')}
          className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white"
        >
          <span className="material-symbols-outlined">
            {activeView === 'overview' ? 'arrow_back' : 'chevron_left'}
          </span>
        </button>
        <h1 className="text-base font-bold tracking-tight text-white">
          {activeView === 'overview' ? 'Configurações' :
            activeView === 'edit_personal' ? 'Dados do Perfil' :
              'Pagamento'}
        </h1>
        <div className="w-10"></div>
      </header>

      {activeView === 'overview' && renderOverview()}
      {activeView === 'edit_personal' && renderEditPersonal()}
      {activeView === 'edit_billing' && renderBillingView()}

      {/* Camera Options Modal */}
      {showCameraOptions && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end animate-in fade-in duration-200">
          <div className="w-full bg-surface-card rounded-t-3xl p-6 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-center font-bold text-white mb-2">Alterar Foto de Perfil</h3>

            <button
              onClick={() => {
                setShowCameraOptions(false);
                cameraInputRef.current?.click();
              }}
              className="flex items-center gap-4 p-4 bg-surface-highlight rounded-2xl active:bg-white/10 transition-colors"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">photo_camera</span>
              </div>
              <span className="font-bold text-white">Tirar Foto</span>
            </button>

            <button
              onClick={() => {
                setShowCameraOptions(false);
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-4 p-4 bg-surface-highlight rounded-2xl active:bg-white/10 transition-colors"
            >
              <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <span className="material-symbols-outlined">image</span>
              </div>
              <span className="font-bold text-white">Escolher da Galeria</span>
            </button>

            <button
              onClick={() => setShowCameraOptions(false)}
              className="mt-2 p-4 text-center font-bold text-gray-500 active:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Avatar Cropper Modal */}
      {showCropper && tempImage && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <button onClick={() => setShowCropper(false)} className="text-white text-sm font-bold">Cancelar</button>
            <h2 className="text-white font-bold">Enquadrar Foto</h2>
            <button onClick={handleSaveAvatar} className="text-primary font-bold">Concluir</button>
          </div>
          <div className="flex-1 relative bg-[#000]">
            <Cropper
              image={tempImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="p-8 bg-background-dark/80 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-gray-500">zoom_in</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e: any) => setZoom(e.target.value)}
                className="flex-1 accent-primary h-1 bg-white/10 rounded-full appearance-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;