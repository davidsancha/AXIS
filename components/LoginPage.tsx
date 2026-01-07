import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { IMAGES } from '../constants';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: email.split('@')[0], // Simplified for now
                        }
                    }
                });
                if (error) throw error;
                alert('Confirme seu e-mail para continuar!');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background-dark p-6 justify-center">
            <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
                <div className="flex flex-col gap-2 items-center mb-4">
                    <span className="material-symbols-outlined text-primary text-5xl">ecg_heart</span>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin ? 'Entre para continuar evoluindo.' : 'Comece sua jornada hoje mesmo.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-xs font-medium px-1">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-primary outline-none transition-colors"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-xs font-medium px-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-primary outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs px-1">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
