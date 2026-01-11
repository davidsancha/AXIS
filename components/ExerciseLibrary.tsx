import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Exercise } from '../types';

const muscleGroups = ['Todos', 'Peitoral', 'Dorsal', 'Pernas', 'Ombros', 'Tríceps', 'Bíceps', 'Abdômen'];

interface ExerciseLibraryProps {
    onBack: () => void;
    onSelect?: (ids: string[]) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onBack, onSelect }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

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

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ex.muscle_group.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'Todos' || ex.muscle_group === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const toggleSelection = (id: string) => {
        if (selectedExercises.includes(id)) {
            setSelectedExercises(selectedExercises.filter(exId => exId !== id));
        } else {
            setSelectedExercises([...selectedExercises, id]);
        }
    };

    const handleConfirmSelection = () => {
        if (onSelect) {
            onSelect(selectedExercises);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark pb-32">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-background-dark/95 backdrop-blur-md border-b border-white/5 z-50 px-4 pt-12 pb-4">
                <div className="flex items-center justify-between max-w-md mx-auto relative">
                    <button onClick={onBack} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-white font-bold text-lg">Biblioteca</h1>
                    <button
                        onClick={handleConfirmSelection}
                        className={`text-[10px] font-bold uppercase tracking-wider ${selectedExercises.length > 0 ? 'text-primary' : 'text-gray-600'
                            }`}
                        disabled={selectedExercises.length === 0}
                    >
                        Concluir
                    </button>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mt-4 relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                    <input
                        type="text"
                        placeholder="Buscar exercício ou músculo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-card border border-white/5 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-white placeholder:text-gray-600 focus:border-primary/50 outline-none transition-all"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <span className="material-symbols-outlined">tune</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="max-w-md mx-auto mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {muscleGroups.map(group => (
                        <button
                            key={group}
                            onClick={() => setActiveFilter(group)}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${activeFilter === group
                                ? 'bg-primary text-white border-primary'
                                : 'bg-surface-card text-gray-500 border-white/5 hover:border-white/10'
                                }`}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content Spacer */}
            <div className="h-[220px]"></div>

            <div className="max-w-md mx-auto px-4 flex flex-col gap-4">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Resultados</h3>
                    <span className="text-[10px] font-bold text-gray-600">{filteredExercises.length} encontrados</span>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                    </div>
                ) : filteredExercises.length > 0 ? (
                    filteredExercises.map(exercise => (
                        <div
                            key={exercise.id}
                            className={`bg-surface-card border rounded-2xl p-3 flex gap-4 items-center transition-all ${selectedExercises.includes(exercise.id) ? 'border-primary/50 bg-primary/5' : 'border-white/5'}`}
                        >
                            <div className="size-16 rounded-xl bg-white/5 overflow-hidden shrink-0 relative">
                                {exercise.image_url ? (
                                    <img src={exercise.image_url} alt={exercise.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                        <span className="material-symbols-outlined">fitness_center</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm truncate">{exercise.name}</h4>
                                <div className="flex flex-col gap-0.5 mt-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px] text-green-500 rotate-45">fitness_center</span>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase truncate">{exercise.muscle_group} • {exercise.equipment}</p>
                                    </div>
                                    {exercise.target_muscle && (
                                        <p className="text-[10px] font-medium text-gray-600 pl-5 truncate">
                                            Alvo: <span className="text-gray-400">{exercise.target_muscle}</span>
                                        </p>
                                    )}
                                    {exercise.secondary_muscles && (
                                        <p className="text-[10px] font-medium text-gray-600 pl-5 truncate">
                                            Secundários: <span className="text-gray-500">{exercise.secondary_muscles}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => toggleSelection(exercise.id)}
                                className={`size-10 rounded-xl flex items-center justify-center transition-all ${selectedExercises.includes(exercise.id)
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-surface-highlight text-gray-400 hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined">
                                    {selectedExercises.includes(exercise.id) ? 'check' : 'add'}
                                </span>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                        <span className="material-symbols-outlined text-4xl mb-4 opacity-50">search_off</span>
                        <p className="text-sm font-medium">Nenhum exercício encontrado</p>
                    </div>
                )}
            </div>

            {/* Bottom Floating Bar */}
            {selectedExercises.length > 0 && (
                <div className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto">
                    <button
                        onClick={handleConfirmSelection}
                        className="w-full bg-primary hover:bg-primary-hover text-white p-4 rounded-xl font-bold text-base shadow-2xl shadow-primary/30 flex items-center justify-between animate-in slide-in-from-bottom duration-300 active:scale-95 transition-all"
                    >
                        <span className="bg-black/20 px-3 py-1 rounded-lg text-sm">{selectedExercises.length} selecionados</span>
                        <div className="flex items-center gap-2">
                            ADICIONAR AO TREINO
                            <span className="material-symbols-outlined">check</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExerciseLibrary;
