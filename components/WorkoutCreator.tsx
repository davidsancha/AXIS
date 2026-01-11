
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface WorkoutCreatorProps {
    onBack: () => void;
    onCreated: (id: string) => void;
}

const WorkoutCreator: React.FC<WorkoutCreatorProps> = ({ onBack, onCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [days, setDays] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleDay = (day: number) => {
        setDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort()
        );
    };

    const handleSave = async () => {
        if (!name.trim()) {
            alert('Por favor, dê um nome ao treino.');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not found');

            const { data, error } = await supabase
                .from('workouts')
                // @ts-ignore
                .insert([{
                    user_id: user.id,
                    name,
                    description,
                    scheduled_days: days
                }])
                .select()
                .single();

            if (error) throw error;
            if (data) {
                onCreated(data.id);
            }
        } catch (error: any) {
            console.error('Error creating workout:', error);
            alert('Erro ao criar treino: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const weekDays = [
        { id: 0, label: 'D' },
        { id: 1, label: 'S' },
        { id: 2, label: 'T' },
        { id: 3, label: 'Q' },
        { id: 4, label: 'Q' },
        { id: 5, label: 'S' },
        { id: 6, label: 'S' },
    ];

    return (
    return (
        <div className="min-h-screen bg-gradient-to-br from-background-dark via-background-dark to-[#111827] text-white p-6 pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/5"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Novo Treino</h1>
            </header>

            <div className="space-y-6">
                <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 group-focus-within:text-primary transition-colors">Nome do Treino</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Treino A - Peito e Tríceps"
                            className="w-full bg-surface-card/50 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none text-lg font-bold placeholder:font-normal placeholder:text-gray-600 transition-all focus:shadow-lg focus:shadow-primary/10"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 material-symbols-outlined">edit</span>
                    </div>
                </div>

                <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 group-focus-within:text-primary transition-colors">Descrição / Notas</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Ex: Foco em hipertrofia, descanso de 60s..."
                        rows={3}
                        className="w-full bg-surface-card/50 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none placeholder:text-gray-600 resize-none transition-all focus:shadow-lg focus:shadow-primary/10"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Dias da Semana</label>
                    <div className="flex justify-between gap-2">
                        {weekDays.map(day => (
                            <button
                                key={day.id}
                                onClick={() => toggleDay(day.id)}
                                className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative overflow-hidden ${days.includes(day.id)
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 border-primary'
                                    : 'bg-surface-card/50 border border-white/10 text-gray-500 hover:bg-white/10'
                                    }`}
                            >
                                <span className="relative z-10">{day.label}</span>
                                {days.includes(day.id) && <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark -z-0"></div>}
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-xs">info</span>
                        Selecione os dias para repetir este treino
                    </p>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-20">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 max-w-md mx-auto relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {loading ? (
                        <span className="material-symbols-outlined animate-spin">sync</span>
                    ) : (
                        <>
                            <span>Salvar e Adicionar Exercícios</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default WorkoutCreator;
