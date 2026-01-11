
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Workout, ScreenType } from '../types';

interface WorkoutListProps {
    onNavigate: (screen: ScreenType) => void;
    onSelectWorkout: (id: string) => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ onNavigate, onSelectWorkout }) => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('workouts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWorkouts(data || []);
        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDayLabel = (dayIndex: number) => {
        const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        return days[dayIndex];
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Seus Treinos</h1>
                    <p className="text-gray-400 text-sm">Gerencie sua rotina de exercícios</p>
                </div>
                <button
                    onClick={() => onNavigate('workout_creator')}
                    className="bg-primary hover:bg-primary-hover text-white p-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined">add</span>
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center py-12">
                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                </div>
            ) : workouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                    <div className="size-24 bg-white/5 rounded-full flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-4xl text-gray-600">fitness_center</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">Nenhum treino encontrado</h2>
                        <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                            Você ainda não tem treinos cadastrados. Crie seu próprio treino ou agende uma avaliação com nossos profissionais.
                        </p>
                    </div>
                    <div className="flex flex-col w-full gap-3 mt-4">
                        <button
                            onClick={() => onNavigate('workout_creator')} // Assuming simple creation for now
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all active:scale-95"
                        >
                            Criar meu treino agora
                        </button>
                        <button
                            className="w-full bg-surface-card border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
                        >
                            Agendar Avaliação
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {workouts.map(workout => (
                        <div
                            key={workout.id}
                            onClick={() => onSelectWorkout(workout.id)}
                            className="bg-surface-card border border-white/5 p-5 rounded-2xl cursor-pointer hover:border-primary/50 transition-all group active:scale-[0.98]"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{workout.name}</h3>
                                <span className="material-symbols-outlined text-gray-500 text-sm">arrow_forward_ios</span>
                            </div>

                            {workout.description && (
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{workout.description}</p>
                            )}

                            <div className="flex gap-2">
                                {[0, 1, 2, 3, 4, 5, 6].map(day => {
                                    const isScheduled = workout.scheduled_days?.includes(day);
                                    return (
                                        <div
                                            key={day}
                                            className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isScheduled
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white/5 text-gray-600'
                                                }`}
                                        >
                                            {getDayLabel(day)}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkoutList;
