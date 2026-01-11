import React, { useState } from 'react';

interface MealRegistrationProps {
    onBack: () => void;
    onSave: () => void;
}

const MealRegistration: React.FC<MealRegistrationProps> = ({ onBack, onSave }) => {
    const [activeTab, setActiveTab] = useState('recentes');
    const [searchQuery, setSearchQuery] = useState('');

    const recentFoods = [
        { name: 'Ovo de Galinha (Cozido)', portion: '1 unidade (50g)', kcal: 78, p: 6.3, c: 0.6, f: 5.3 },
        { name: 'Arroz Branco (Cozido)', portion: '100g', kcal: 128, p: 2.5, c: 28.1, f: 0.2 },
        { name: 'Peito de Frango (Grelhado)', portion: '100g', kcal: 159, p: 32.0, c: 0, f: 2.5 },
    ];

    return (
        <div className="bg-background-dark min-h-screen pb-32">
            {/* Header */}
            <div className="bg-surface-dark border-b border-white/5 p-6 sticky top-0 z-20">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={onBack}
                        className="size-10 rounded-full bg-surface-highlight flex items-center justify-center text-white active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex-1">
                        <h2 className="text-white text-lg font-bold">Registrar Refeição</h2>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Almoço • Hoje</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar alimento..."
                        className="w-full bg-background-dark text-white pl-12 pr-4 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600 font-medium"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 px-6 py-4 border-b border-white/5 overflow-x-auto no-scrollbar">
                {['Recentes', 'Favoritos', 'Meus Pratos', 'Criar Novo'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`whitespace-nowrap text-xs font-bold uppercase tracking-wider pb-2 transition-colors relative ${activeTab === tab.toLowerCase() ? 'text-primary' : 'text-gray-500'
                            }`}
                    >
                        {tab}
                        {activeTab === tab.toLowerCase() && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full layout-id-underline"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-4">
                {recentFoods.map((food, index) => (
                    <button
                        key={index}
                        className="bg-surface-card border border-white/5 rounded-2xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-white/5 text-left"
                    >
                        <div className="flex-1">
                            <h4 className="text-white font-bold mb-1">{food.name}</h4>
                            <p className="text-gray-500 text-xs font-medium">{food.portion} • <span className="text-primary font-bold">{food.kcal} kcal</span></p>

                            <div className="flex gap-3 mt-2">
                                <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">P: {food.p}g</span>
                                <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded">C: {food.c}g</span>
                                <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">G: {food.f}g</span>
                            </div>
                        </div>
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined">add</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Float Action Button or Summary */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent pt-12">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={onSave}
                        className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">check</span>
                        Concluir Registro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealRegistration;
