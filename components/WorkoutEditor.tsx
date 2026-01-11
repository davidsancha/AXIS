
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
            const formattedExercises: WorkoutExercise[] = (exercisesData || []).map(item => ({
                id: item.id,
                workout_id: item.workout_id,
                exercise_id: item.exercise_id,
                sort_order: item.exercise_order,
                sets: item.sets_config as SetConfig[],
                exercise: item.exercise
            }));

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
                    { reps: 12, weight: 0, completed: false },
                    { reps: 12, weight: 0, completed: false },
                    { reps: 12, weight: 0, completed: false }
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

    const handleUpdateSets = async (sets: SetConfig[]) => {
        if (!editingExercise) return;

        try {
            const { error } = await supabase
                .from('workout_exercises')
                // @ts-ignore
                .update({ sets_config: sets })
                .eq('id', editingExercise.id);

            if (error) throw error;
            setEditingExercise(null);
            fetchWorkoutDetails(); // Refresh to show updated sets count? Or just update local state
        } catch (error) {
            console.error('Error updating sets:', error);
            alert('Erro ao salvar séries');
        }
    };

    const handleDeleteExercise = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Remover exercício?')) return;

        try {
            const { error } = await supabase
                .from('workout_exercises')
                .delete()
                .eq('id', id);

            if (error) throw error;
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
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    // Estimate: 2 mins per set (including rest) * MET (avg 5 if missing) * Weight (default 75kg)
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
            <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md px-6 py-6 border-b border-white/5">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={onBack} className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold truncate">{workout.name}</h1>
                        {workout.description && <p className="text-xs text-gray-400 truncate">{workout.description}</p>}
                    </div>
                    <button className="text-primary font-bold text-xs uppercase tracking-wider">Editar</button>
                </div>

                <div className="flex gap-4">
                    <div className="bg-surface-card border border-white/5 rounded-xl px-4 py-2 flex-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Volume</p>
                        <p className="text-lg font-bold text-white">{totalSets} <span className="text-xs text-gray-500 font-normal">séries</span></p>
                    </div>
                    <div className="bg-surface-card border border-white/5 rounded-xl px-4 py-2 flex-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Est. Calorias</p>
                        <p className="text-lg font-bold text-orange-500">~{Math.round(estimatedConsumers)} <span className="text-xs text-gray-500 font-normal">kcal</span></p>
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-4">
                {exercises.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-gray-600">fitness_center</span>
                        </div>
                        <p className="text-gray-500 font-medium">Seu treino está vazio.</p>
                        <p className="text-xs text-gray-600 mt-1 mb-6">Adicione exercícios para começar.</p>
                        <button
                            onClick={() => setShowLibrary(true)}
                            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Adicionar Exercícios
                        </button>
                    </div>
                ) : (
                    <>
                        {exercises.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => setEditingExercise(item)}
                                className="bg-surface-card border border-white/5 rounded-2xl p-4 flex gap-4 items-center group active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
                                <div className="flex flex-col items-center justify-center w-8 text-gray-500 font-mono text-xs font-bold">
                                    {index + 1}
                                </div>

                                <div className="size-14 bg-white/5 rounded-xl overflow-hidden shrink-0">
                                    {item.exercise?.image_url ? (
                                        <img src={item.exercise.image_url} alt={item.exercise.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-600">fitness_center</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white truncate">{item.exercise?.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">
                                            {item.sets.length} Séries
                                        </span>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">
                                            {item.exercise?.target_muscle || item.exercise?.muscle_group}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => handleDeleteExercise(item.id, e)}
                                    className="size-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() => setShowLibrary(true)}
                            className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-gray-500 font-bold hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Adicionar Mais Exercícios
                        </button>
                    </>
                )}
            </div>

            {editingExercise && (
                <ExerciseSetEditor
                    exerciseName={editingExercise.exercise?.name || 'Exercício'}
                    initialSets={editingExercise.sets}
                    onSave={handleUpdateSets}
                    onClose={() => setEditingExercise(null)}
                />
            )}
        </div>
    );
};

export default WorkoutEditor;
