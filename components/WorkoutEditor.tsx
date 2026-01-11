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
                    <div className="space-y-4">
                        {exercises.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => setEditingExercise(item)}
                                className="bg-[#111827] rounded-xl p-4 relative group active:scale-[0.99] transition-all cursor-pointer border border-transparent hover:border-white/5 overflow-hidden"
                            >
                                {/* Green Left Border */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#22c55e] rounded-l-xl"></div>

                                {/* Header: Title + Actions */}
                                <div className="flex justify-between items-start mb-1 pl-3">
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight">{item.exercise?.name}</h3>
                                        <p className="text-xs text-gray-400">{item.exercise?.muscle_group} &bull; {item.exercise?.target_muscle}</p>
                                    </div>
                                    <div className="flex gap-2">
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
                                </div>

                                {/* Middle: Images (Anatomy + Video) */}
                                <div className="flex gap-3 my-4 pl-3">
                                    {/* Anatomy Image */}
                                    <div className="w-24 h-24 bg-black rounded-lg overflow-hidden relative shrink-0">
                                        {item.exercise?.image_url ? (
                                            <>
                                                <img src={item.exercise.image_url} alt="Anatomia" className="w-full h-full object-cover opacity-90" />
                                                <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[7px] font-bold text-white uppercase backdrop-blur-sm border border-white/10">
                                                    Anatomia
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                <span className="material-symbols-outlined text-gray-700">accessibility_new</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Video/Tutorial Image */}
                                    <div className="flex-1 h-24 bg-black rounded-lg overflow-hidden relative">
                                        {item.exercise?.video_url ? (
                                            <img src="https://i.ytimg.com/vi/placeholder/hqdefault.jpg" className="w-full h-full object-cover opacity-60" alt="Video" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                <span className="material-symbols-outlined text-gray-700">play_circle</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="size-8 rounded-full bg-[#22c55e] flex items-center justify-center shadow-lg shadow-[#22c55e]/30">
                                                <span className="material-symbols-outlined text-black text-lg">play_arrow</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom: Stats Grid */}
                                <div className="grid grid-cols-4 gap-3 pl-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] uppercase font-bold text-gray-500">Séries</span>
                                        <div className="bg-[#0f0f0f] border border-white/5 rounded-lg py-2 flex items-center justify-center">
                                            <span className="font-bold text-white text-sm">{item.sets.length}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] uppercase font-bold text-gray-500">Reps</span>
                                        <div className="bg-[#0f0f0f] border border-white/5 rounded-lg py-2 flex items-center justify-center">
                                            <span className="font-bold text-white text-sm">{item.sets[0]?.reps || 12}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] uppercase font-bold text-gray-500">Carga</span>
                                        <div className="bg-[#0f0f0f] border border-white/5 rounded-lg py-2 flex items-center justify-center gap-0.5">
                                            <span className="font-bold text-white text-sm">{item.sets[0]?.weight || 0}</span>
                                            <span className="text-[8px] text-gray-500 mt-0.5">kg</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] uppercase font-bold text-gray-500">Pausa</span>
                                        <div className="bg-[#0f0f0f] border border-white/5 rounded-lg py-2 flex items-center justify-center gap-0.5">
                                            <span className="font-bold text-white text-sm">{item.sets[0]?.rest_seconds || 60}</span>
                                            <span className="text-[8px] text-gray-500 mt-0.5">s</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

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
                )}
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
