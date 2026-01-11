import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Workout, WorkoutExercise, SetConfig } from '../types';
import ExerciseLibrary from './ExerciseLibrary';
import ExerciseSetEditor from './ExerciseSetEditor';

interface WorkoutEditorProps {
    workoutId: string;
    onBack: () => void;
}

const WorkoutEditor: React.FC<WorkoutEditorProps> = ({ workoutId, onBack }) => {
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLibrary, setShowLibrary] = useState(false);
    const [editingExercise, setEditingExercise] = useState<WorkoutExercise | null>(null);

    useEffect(() => {
        fetchWorkoutDetails();
    }, [workoutId]);

    const fetchWorkoutDetails = async () => {
        try {
            // Fetch workout metadata
            const { data: workoutData, error: workoutError } = await supabase
                .from('workouts')
                .select('*')
                .eq('id', workoutId)
                .single();

            if (workoutError) throw workoutError;
            setWorkout(workoutData);

            // Fetch exercises
            const { data: exercisesData, error: exercisesError } = await supabase
                .from('workout_exercises')
                .select(`
                    *,
                    exercise:exercises(*)
                `)
                .eq('workout_id', workoutId)
                .order('exercise_order', { ascending: true });

            if (exercisesError) throw exercisesError;

            // Map data to match Type interface (sets_config -> sets)
            const formattedExercises: WorkoutExercise[] = (exercisesData || []).map(item => {
                const rawConfig = item.sets_config as any;
                let sets: SetConfig[] = [];
                let notes = '';

                // Handle both array (legacy) and object (new) formats
                if (Array.isArray(rawConfig)) {
                    sets = rawConfig;
                } else if (rawConfig && typeof rawConfig === 'object') {
                    sets = rawConfig.sets || [];
                    notes = rawConfig.notes || '';
                }

                return {
                    id: item.id,
                    workout_id: item.workout_id,
                    exercise_id: item.exercise_id,
                    sort_order: item.exercise_order,
                    sets: sets,
                    notes: notes,
                    exercise: item.exercise
                };
            });

            setExercises(formattedExercises);
        } catch (error) {
            console.error('Error fetching workout details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExercises = async (ids: string[]) => {
        try {
            const currentOrder = exercises.length;
            const newExercises = ids.map((id, index) => ({
                workout_id: workoutId,
                exercise_id: id,
                exercise_order: currentOrder + index,
                sets_config: [
                    { reps: 12, weight: 0, completed: false, rest_seconds: 60 },
                    { reps: 12, weight: 0, completed: false, rest_seconds: 60 },
                    { reps: 12, weight: 0, completed: false, rest_seconds: 60 }
                ]
            }));

            const { error } = await supabase
                .from('workout_exercises')
                // @ts-ignore
                .insert(newExercises);

            if (error) throw error;
            setShowLibrary(false);
            fetchWorkoutDetails();
        } catch (error) {
            console.error('Error adding exercises:', error);
            alert('Erro ao adicionar exercícios');
        }
    };

    const handleUpdateExercise = async (sets: SetConfig[], notes: string) => {
        if (!editingExercise) return;

        try {
            const { error } = await supabase
                .from('workout_exercises')
                // @ts-ignore
                .update({
                    sets_config: {
                        sets,
                        notes
                    }
                })
                .eq('id', editingExercise.id);

            if (error) throw error;
            setEditingExercise(null);
            fetchWorkoutDetails();
        } catch (error) {
            console.error('Error updating sets:', error);
            alert('Erro ao salvar exercício');
        }
    };

    const handleDeleteExercise = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm('Remover exercício?')) return;

        try {
            const { error } = await supabase
                .from('workout_exercises')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Should properly cascade/update order, but for now just refresh
            if (editingExercise?.id === id) setEditingExercise(null);
            fetchWorkoutDetails();
        } catch (error) {
            console.error('Error deleting exercise:', error);
        }
    };

    if (showLibrary) {
        return <ExerciseLibrary onBack={() => setShowLibrary(false)} onSelect={handleAddExercises} />;
    }

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center p-6"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>;
    }

    if (!workout) return null;

    // Calculate stats
    const totalExercises = exercises.length;
    // Estimate: 2 mins per set (including rest) * MET (avg 5 if missing) * Weight (default 75kg)
    const estimatedTimeMin = exercises.reduce((acc, ex) => {
        // Avg 90s rest + 30s execution = 2 mins per set
        return acc + (ex.sets.length * 2);
    }, 0);

    // Formula: MET * Weight * Time(hours)
    // Time = (Sets * 2) / 60
    const estimatedConsumers = exercises.reduce((acc, ex) => {
        const met = ex.exercise?.met_value || 5;
        const timeHours = (ex.sets.length * 2) / 60;
        return acc + (met * 75 * timeHours);
    }, 0);

    return (
        <div className="min-h-screen bg-black text-white pb-32">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-md px-6 py-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={onBack} className="size-10 rounded-full bg-transparent flex items-center justify-center hover:bg-white/10 transition-colors -ml-2">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    <h1 className="text-lg font-bold flex-1 text-center truncate px-4">{workout.name}</h1>

                    <button onClick={onBack} className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-sm px-4 py-2 rounded-full transition-colors">
                        Salvar
                    </button>
                </div>

                <div className="flex gap-4">
                    <div className="bg-[#111827] rounded-2xl p-4 flex-1 flex items-center justify-between relative overflow-hidden">
                        <div className="z-10">
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">TEMPO ESTIMADO</p>
                            <p className="text-2xl font-bold text-white leading-none">{Math.round(estimatedTimeMin)} <span className="text-sm font-normal text-gray-500">min</span></p>
                        </div>
                        <div className="size-8 rounded-full bg-[#22c55e]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#22c55e] text-lg">schedule</span>
                        </div>
                    </div>
                    <div className="bg-[#111827] rounded-2xl p-4 flex-1 flex items-center justify-between relative overflow-hidden">
                        <div className="z-10">
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">CALORIAS</p>
                            <p className="text-2xl font-bold text-white leading-none">{Math.round(estimatedConsumers)} <span className="text-sm font-normal text-gray-500">kcal</span></p>
                        </div>
                        <div className="size-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-lg font-bold">Exercícios</h2>
                    <span className="text-xs text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded-md font-bold">{totalExercises} exercícios</span>
                </div>

                {exercises.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl mx-2">
                        <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-2xl text-gray-600">fitness_center</span>
                        </div>
                        <p className="text-gray-500 font-medium">Adicione exercícios ao seu treino</p>
                        <button
                            onClick={() => setShowLibrary(true)}
                            className="text-[#22c55e] font-bold text-sm mt-4 hover:underline"
                        >
                            Explorar Biblioteca
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {exercises.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => setEditingExercise(item)}
                                className="bg-[#111827] rounded-2xl p-4 relative group active:scale-[0.99] transition-all cursor-pointer border border-transparent hover:border-white/5"
                            >
                                {/* Drag & Delete - Top Right */}
                                <div className="absolute top-4 right-4 flex gap-3">
                                    <button className="text-gray-600 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-lg">drag_indicator</span>
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteExercise(item.id, e)}
                                        className="text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>

                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-black rounded-xl overflow-hidden shrink-0 relative">
                                        {item.exercise?.image_url ? (
                                            <>
                                                <img src={item.exercise.image_url} alt={item.exercise.name} className="w-full h-full object-cover opacity-80" />
                                                <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase backdrop-blur-sm">
                                                    Anatomia
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                <span className="material-symbols-outlined text-2xl">fitness_center</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-1 min-w-0 pr-16">
                                        <h3 className="font-bold text-white text-lg truncate leading-tight mb-1">{item.exercise?.name}</h3>
                                        <p className="text-xs text-gray-400 mb-4 truncate">{item.exercise?.muscle_group} &bull; {item.exercise?.target_muscle}</p>

                                        {/* Grid Stats */}
                                        <div className="grid grid-cols-4 gap-2">
                                            <div className="bg-black/30 rounded-lg p-1.5 text-center">
                                                <p className="text-[9px] text-gray-500 uppercase font-black mb-0.5">Séries</p>
                                                <p className="text-sm font-bold text-white">{item.sets.length}</p>
                                            </div>
                                            <div className="bg-black/30 rounded-lg p-1.5 text-center">
                                                <p className="text-[9px] text-gray-500 uppercase font-black mb-0.5">Reps</p>
                                                <p className="text-sm font-bold text-white">
                                                    {item.sets.length > 0 ? (
                                                        item.sets[0].reps
                                                    ) : '-'}
                                                </p>
                                            </div>
                                            <div className="bg-black/30 rounded-lg p-1.5 text-center">
                                                <p className="text-[9px] text-gray-500 uppercase font-black mb-0.5">Carga</p>
                                                <p className="text-sm font-bold text-white">
                                                    {item.sets.length > 0 ? (
                                                        item.sets[0].weight
                                                    ) : 0} <span className="text-[8px] text-gray-500">kg</span>
                                                </p>
                                            </div>
                                            <div className="bg-black/30 rounded-lg p-1.5 text-center">
                                                <p className="text-[9px] text-gray-500 uppercase font-black mb-0.5">Pausa</p>
                                                <p className="text-sm font-bold text-white">
                                                    {item.sets.length > 0 ? (
                                                        item.sets[0].rest_seconds || 60
                                                    ) : 60} <span className="text-[8px] text-gray-500">s</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={() => setShowLibrary(true)}
                    className="w-full py-5 rounded-3xl border-2 border-dashed border-white/10 text-gray-400 font-bold hover:bg-white/5 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-2 mt-6 active:scale-[0.99]"
                >
                    <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">add</span>
                    </div>
                    <span className="text-xs uppercase tracking-widest">Adicionar Exercício</span>
                </button>
            </div>

            {editingExercise && (
                <ExerciseSetEditor
                    exercise={editingExercise}
                    onSave={handleUpdateExercise}
                    onClose={() => setEditingExercise(null)}
                />
            )}
        </div>
    );
};

export default WorkoutEditor;
