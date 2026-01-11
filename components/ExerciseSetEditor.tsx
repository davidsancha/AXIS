import React, { useState } from 'react';
import { SetConfig, WorkoutExercise } from '../types';

interface ExerciseSetEditorProps {
    exercise: WorkoutExercise;
    onSave: (sets: SetConfig[], notes: string) => void;
    onClose: () => void;
}

const ExerciseSetEditor: React.FC<ExerciseSetEditorProps> = ({ exercise, onSave, onClose }) => {
    const [sets, setSets] = useState<SetConfig[]>(exercise.sets.length > 0 ? exercise.sets : [
        { reps: 12, weight: 0, completed: false, rest_seconds: 60 },
        { reps: 12, weight: 0, completed: false, rest_seconds: 60 },
        { reps: 12, weight: 0, completed: false, rest_seconds: 60 }
    ]);
    const [notes, setNotes] = useState(exercise.notes || '');

    const updateSet = (index: number, field: keyof SetConfig, value: number | boolean) => {
        const newSets = [...sets];
        // @ts-ignore
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);

        // Smart fill: if updating set 1 (index 0) weight/reps/rest, cascade to others
        if (index === 0 && (field === 'weight' || field === 'reps' || field === 'rest_seconds') && typeof value === 'number') {
            const updatedSets = newSets.map((s, i) => {
                if (i === 0) return s;
                if (!s.completed) {
                    return { ...s, [field]: value };
                }
                return s;
            });
            setSets(updatedSets);
        }
    };

    const addSet = () => {
        const lastSet = sets[sets.length - 1] || { reps: 12, weight: 0, completed: false, rest_seconds: 60 };
        setSets([...sets, { ...lastSet, completed: false }]);
    };

    const removeSet = (index: number) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    // Calculate stats
    const totalTime = sets.reduce((acc, s) => acc + (s.rest_seconds || 60) + 30, 0) / 60; // 30s execution estimate
    const totalCalories = (exercise.exercise?.met_value || 5) * 75 * (totalTime / 60);

    return (
        <div className="fixed inset-0 z-[60] bg-gradient-to-b from-[#05100a] to-[#000000] text-white flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <header className="px-6 py-6 flex items-center justify-between bg-transparent border-b border-white/5">
                <button onClick={onClose} className="size-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors -ml-2">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Editar Exercício</h2>
                <button
                    onClick={() => onSave(sets, notes)}
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-black px-4 py-2 rounded-full font-bold text-sm transition-colors"
                >
                    Salvar
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
                {/* Exercise Name */}
                <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">NOME DO EXERCÍCIO</p>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold truncate pr-4">{exercise.exercise?.name}</h1>
                        <span className="material-symbols-outlined text-gray-500">edit</span>
                    </div>
                </div>

                {/* Media Cards */}
                <div className="flex gap-4">
                    <div className="flex-1 bg-[#121814] rounded-2xl p-3 border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                        {exercise.exercise?.image_url ? (
                            <img src={exercise.exercise.image_url} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                <span className="material-symbols-outlined text-4xl text-white/20">fitness_center</span>
                            </div>
                        )}
                        <div className="relative z-20 flex flex-col h-24 justify-between">
                            <span className="material-symbols-outlined text-white text-lg self-end bg-black/40 p-1 rounded-full backdrop-blur-md">photo_camera</span>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase">MÚSCULOS</p>
                                <p className="text-sm font-bold text-white truncate">{exercise.exercise?.muscle_group}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-[#121814] rounded-2xl p-3 border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                        {exercise.exercise?.video_url ? (
                            <div className="absolute inset-0 bg-black/50"></div> // Thumbnail placeholder
                        ) : (
                            <div className="absolute inset-0 bg-white/5"></div>
                        )}
                        <img src="https://i.ytimg.com/vi/S1J0w-3xT1c/hqdefault.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt="Tutorial" />

                        <div className="relative z-20 flex flex-col h-24 justify-between">
                            <span className="material-symbols-outlined text-white text-lg self-end bg-black/40 p-1 rounded-full backdrop-blur-md">link</span>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">play_circle</span>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">TUTORIAL</p>
                                    <p className="text-xs font-bold text-white underline decoration-white/30 truncate max-w-[80px]">youtube.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-4">
                    <div className="flex-1 bg-[#121814] rounded-2xl p-3 flex items-center gap-3 border border-white/5">
                        <div className="size-10 rounded-full bg-[#22c55e]/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#22c55e]">timer</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500">Tempo Total</p>
                            <p className="text-lg font-bold text-white leading-none">{Math.round(totalTime)} <span className="text-xs font-normal text-gray-400">min</span></p>
                        </div>
                    </div>
                    <div className="flex-1 bg-[#121814] rounded-2xl p-3 flex items-center gap-3 border border-white/5">
                        <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500">Calorias</p>
                            <p className="text-lg font-bold text-white leading-none">{Math.round(totalCalories)} <span className="text-xs font-normal text-gray-400">kcal</span></p>
                        </div>
                    </div>
                </div>

                {/* Sets Editor */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Séries & Carga</h3>
                        <span className="text-xs text-gray-500 font-medium">{sets.length} Séries</span>
                    </div>

                    <div className="grid grid-cols-[30px_1fr_1fr_1fr_30px] gap-3 mb-2 px-1">
                        <div className="text-[9px] font-bold text-gray-500 uppercase text-center self-end">#</div>
                        <div className="text-[9px] font-bold text-gray-500 uppercase text-center self-end">REPS</div>
                        <div className="text-[9px] font-bold text-gray-500 uppercase text-center self-end">KG</div>
                        <div className="text-[9px] font-bold text-gray-500 uppercase text-center self-end">PAUSA</div>
                        <div></div>
                    </div>

                    <div className="space-y-2">
                        {sets.map((set, index) => (
                            <div key={index} className="grid grid-cols-[30px_1fr_1fr_1fr_30px] gap-2 items-center bg-[#121814] rounded-xl p-2 border border-white/5">
                                <div className="size-6 rounded-full bg-[#22c55e]/20 text-[#22c55e] text-xs font-bold flex items-center justify-center border border-[#22c55e]/30">
                                    {index + 1}
                                </div>

                                <input
                                    type="number"
                                    value={set.reps}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => updateSet(index, 'reps', Number(e.target.value))}
                                    className="h-10 w-full bg-[#0a0f0c] text-center text-white font-bold rounded-lg border border-transparent focus:border-[#22c55e] outline-none transition-colors"
                                />

                                <input
                                    type="number"
                                    value={set.weight}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => updateSet(index, 'weight', Number(e.target.value))}
                                    className="h-10 w-full bg-[#0a0f0c] text-center text-white font-bold rounded-lg border border-transparent focus:border-[#22c55e] outline-none transition-colors"
                                />

                                <div className="relative h-10 w-full">
                                    <input
                                        type="number"
                                        value={set.rest_seconds || 60}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updateSet(index, 'rest_seconds', Number(e.target.value))}
                                        className="h-full w-full bg-[#0a0f0c] text-center text-white font-bold rounded-lg border border-transparent focus:border-[#22c55e] outline-none transition-colors pr-4"
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">s</span>
                                </div>

                                <button
                                    onClick={() => removeSet(index)}
                                    className="text-gray-600 hover:text-red-500 flex justify-center w-full"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addSet}
                        className="w-full py-3 mt-4 rounded-xl border border-dashed border-[#22c55e]/30 text-[#22c55e] font-bold text-sm bg-[#22c55e]/5 hover:bg-[#22c55e]/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        Adicionar Série
                    </button>
                </div>

                {/* Instructions */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-gray-500 text-sm">subject</span>
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase">INSTRUÇÕES ESPECÍFICAS</h3>
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex: Mantenha os cotovelos a 45 graus e controle a descida..."
                        className="w-full h-32 bg-[#121814] border border-white/5 rounded-2xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:border-[#22c55e] outline-none resize-none leading-relaxed transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};

export default ExerciseSetEditor;
