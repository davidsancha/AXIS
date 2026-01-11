import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Exercise } from '../types';

interface AdminExercisePanelProps {
    onBack: () => void;
}

const AdminExercisePanel: React.FC<AdminExercisePanelProps> = ({ onBack }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<Partial<Exercise>>({});

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .order('name');

            if (error) throw error;
            setExercises(data || []);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!currentExercise.name || !currentExercise.muscle_group) {
            alert('Nome e Grupo Muscular são obrigatórios.');
            return;
        }

        try {
            if (currentExercise.id) {
                // Update
                const { error } = await supabase
                    .from('exercises')
                    .update(currentExercise)
                    .eq('id', currentExercise.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('exercises')
                    .insert([currentExercise]);
                if (error) throw error;
            }

            setIsEditing(false);
            setCurrentExercise({});
            fetchExercises();
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este exercício?')) return;

        try {
            const { error } = await supabase
                .from('exercises')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchExercises();
        } catch (error: any) {
            alert('Erro ao excluir: ' + error.message);
        }
    };

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.muscle_group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background-dark pb-32 flex flex-col">
            {/* Header */}
            <header className="bg-surface-card border-b border-white/5 p-6 sticky top-0 z-20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-white">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-xl font-bold text-white">Gerenciar Exercícios</h1>
                    </div>
                    <button
                        onClick={() => { setCurrentExercise({}); setIsEditing(true); }}
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Novo
                    </button>
                </div>

                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background-dark border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-gray-600 focus:border-primary/50 outline-none transition-all"
                    />
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredExercises.map(ex => (
                            <div key={ex.id} className="bg-surface-card border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="size-12 bg-white/5 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                                        {ex.image_url ? (
                                            <img src={ex.image_url} alt={ex.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-gray-600">fitness_center</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-white font-bold truncate">{ex.name}</h3>
                                        <p className="text-xs text-gray-500 uppercase font-bold">{ex.muscle_group} • MET: {ex.met_value || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setCurrentExercise(ex); setIsEditing(true); }}
                                        className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 hover:bg-blue-400/10 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ex.id)}
                                        className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Editor Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
                    <div className="w-full max-w-lg bg-surface-card border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {currentExercise.id ? 'Editar Exercício' : 'Novo Exercício'}
                        </h2>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={currentExercise.name || ''}
                                    onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="Ex: Supino Reto"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Grupo Muscular</label>
                                    <select
                                        value={currentExercise.muscle_group || ''}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, muscle_group: e.target.value })}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none appearance-none"
                                    >
                                        <option value="">Selecione...</option>
                                        {['Peitoral', 'Dorsal', 'Pernas', 'Ombros', 'Tríceps', 'Bíceps', 'Abdômen', 'Cardio'].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Equipamento</label>
                                    <input
                                        type="text"
                                        value={currentExercise.equipment || ''}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, equipment: e.target.value })}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ex: Barra"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">MET Value</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={currentExercise.met_value || ''}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, met_value: parseFloat(e.target.value) })}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ex: 5.0"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">Fator de queima calórica</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Músculo Alvo</label>
                                    <input
                                        type="text"
                                        value={currentExercise.target_muscle || ''}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, target_muscle: e.target.value })}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ex: Peitoral Maior"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">URL da Imagem</label>
                                <input
                                    type="text"
                                    value={currentExercise.image_url || ''}
                                    onChange={(e) => setCurrentExercise({ ...currentExercise, image_url: e.target.value })}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">URL do Vídeo</label>
                                <input
                                    type="text"
                                    value={currentExercise.video_url || ''}
                                    onChange={(e) => setCurrentExercise({ ...currentExercise, video_url: e.target.value })}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminExercisePanel;
