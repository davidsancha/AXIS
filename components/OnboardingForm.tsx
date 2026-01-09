import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface OnboardingFormProps {
    onComplete: () => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
    const { user, refreshProfile } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: '',
        phone: '',
        address_street: '',
        address_city: '',
        address_state: '',
        address_zip: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...formData,
                    onboarding_completed: true,
                    updated_at: new Date().toISOString(),
                    ebook_banner_dismissed: true,
                    has_downloaded_ebook: true,
                } as any)
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            onComplete();
        } catch (error: any) {
            alert('Erro ao salvar perfil: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStepNumbers = () => (
        <div className="flex justify-between items-center mb-8 px-2">
            {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= num ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-dark text-gray-500 border border-white/5'
                        }`}>
                        {num}
                    </div>
                    {num < 3 && (
                        <div className={`w-12 h-1 mb-0 mx-2 rounded-full ${step > num ? 'bg-primary' : 'bg-surface-dark'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-background-dark text-white p-6 flex flex-col">
            <div className="max-w-sm mx-auto w-full pt-8">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">
                        {step === 1 && 'Informações Pessoais'}
                        {step === 2 && 'Endereço e Contato'}
                        {step === 3 && 'Tudo pronto?'}
                    </h2>
                    <p className="text-gray-400 text-sm">Passo {step} de 3</p>
                </header>

                {renderStepNumbers()}

                <div className="flex flex-col gap-5 flex-grow">
                    {step === 1 && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-400 px-1">Primeiro Nome</label>
                                <input
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                                    placeholder="Ex: João"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-400 px-1">Sobrenome</label>
                                <input
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                                    placeholder="Ex: Silva"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-400 px-1">Data de Nascimento</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-400 px-1">Sexo</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                                >
                                    <option value="">Selecione</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                    <option value="O">Outro</option>
                                    <option value="N">Prefiro não dizer</option>
                                </select>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-400 px-1">Telefone</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-400 px-1">Endereço (Rua, Nº)</label>
                                <input
                                    name="address_street"
                                    value={formData.address_street}
                                    onChange={handleChange}
                                    className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                                    placeholder="Rua Exemplo, 123"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-400 px-1">Cidade</label>
                                    <input
                                        name="address_city"
                                        value={formData.address_city}
                                        onChange={handleChange}
                                        className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                                        placeholder="Sua cidade"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-400 px-1">UF</label>
                                    <input
                                        name="address_state"
                                        value={formData.address_state}
                                        onChange={handleChange}
                                        className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                                        placeholder="SP"
                                        maxLength={2}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-400 px-1">CEP</label>
                                <input
                                    name="address_zip"
                                    value={formData.address_zip}
                                    onChange={handleChange}
                                    className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                                    placeholder="00000-000"
                                />
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-6 text-center py-8">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                                <span className="material-symbols-outlined text-5xl text-primary animate-pulse">check_circle</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Quase lá!</h3>
                                <p className="text-gray-400">Verifique se suas informações estão corretas. Você poderá editá-las depois no seu perfil.</p>
                            </div>
                            <div className="bg-surface-dark/30 border border-white/5 rounded-2xl p-4 text-left space-y-2">
                                <p className="text-sm"><span className="text-gray-500">Nome:</span> {formData.first_name} {formData.last_name}</p>
                                <p className="text-sm"><span className="text-gray-500">Contato:</span> {formData.phone}</p>
                                <p className="text-sm"><span className="text-gray-500">Cidade:</span> {formData.address_city} - {formData.address_state}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-8 flex gap-4">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className="flex-1 bg-surface-dark border border-white/10 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
                        >
                            Voltar
                        </button>
                    )}
                    <button
                        onClick={step === 3 ? handleSubmit : nextStep}
                        disabled={loading}
                        className="flex-[2] bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : (step === 3 ? 'Finalizar' : 'Continuar')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingForm;
