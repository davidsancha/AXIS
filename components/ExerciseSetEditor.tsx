
import React, { useState, useEffect } from 'react';
import { SetConfig, WorkoutExercise } from '../types';

interface ExerciseSetEditorProps {
    exerciseName: string;
    initialSets: SetConfig[];
    onSave: (sets: SetConfig[]) => void;
    onClose: () => void;
    onRemove?: () => void;
}

const ExerciseSetEditor: React.FC<ExerciseSetEditorProps> = ({ exerciseName, initialSets, onSave, onClose, onRemove }) => {
    const [sets, setSets] = useState<SetConfig[]>(initialSets.length > 0 ? initialSets : [
        { reps: 12, weight: 0, completed: false },
        { reps: 12, weight: 0, completed: false },
        { reps: 12, weight: 0, completed: false }
    ]);

    const updateSet = (index: number, field: keyof SetConfig, value: number | boolean) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);

        // Smart fill: if updating set 1 (index 0) weight/reps, and following sets match previous set 1, update them too?
        if (index === 0 && (field === 'weight' || field === 'reps') && typeof value === 'number') {
            // Apply to all subsequent sets that are NOT completed
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

    const toggleComplete = (index: number) => {
        updateSet(index, 'completed', !sets[index].completed);
    };

    const addSet = () => {
        const lastSet = sets[sets.length - 1] || { reps: 12, weight: 0, completed: false };
        setSets([...sets, { ...lastSet, completed: false }]);
    };

    const removeSet = (index: number) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-surface-card border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white truncate pr-4 flex-1">{exerciseName}</h2>
                    <div className="flex items-center gap-1">
                        {onRemove && (
                            <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors" title="Remover exercício">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-white rounded-full transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-[40px_1fr_1fr_50px] gap-4 mb-2 px-2">
                    <div className="text-[10px] font-bold text-gray-500 uppercase text-center self-end pb-2">Set</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase text-center self-end pb-2">KG</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase text-center self-end pb-2">Reps</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase text-center self-end pb-2"></div>
                </div>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar px-1">
                    {sets.map((set, index) => (
                        <div key={index} className="grid grid-cols-[40px_1fr_1fr_50px] gap-4 items-center">
                            <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${set.completed ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-gray-400'
                                }`}>
                                {index + 1}
                            </div>

                            <div className="relative">
                                <input
                                    type="number"
                                    value={set.weight}
                                    onChange={(e) => updateSet(index, 'weight', Number(e.target.value))}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl py-3 text-center text-white font-bold text-lg focus:border-primary outline-none"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-bold">KG</span>
                            </div>

                            <div className="relative">
                                <input
                                    type="number"
                                    value={set.reps}
                                    onChange={(e) => updateSet(index, 'reps', Number(e.target.value))}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl py-3 text-center text-white font-bold text-lg focus:border-primary outline-none"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-bold">REP</span>
                            </div>

                            <button
                                onClick={() => toggleComplete(index)}
                                className={`size-12 rounded-xl flex items-center justify-center transition-all ${set.completed
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                    : 'bg-surface-highlight border border-white/5 text-gray-500 hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined">
                                    {set.completed ? 'check' : 'check'}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 mt-6 items-center">
                    <button
                        onClick={addSet}
                        className="text-primary font-bold text-sm px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        + Adicionar Série
                    </button>
                    <div className="flex-1"></div>
                    <button
                        onClick={() => onSave(sets)}
                        className="flex-1 py-3 px-8 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseSetEditor;
