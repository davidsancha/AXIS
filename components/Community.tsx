import React, { useEffect, useState } from 'react';
import { IMAGES } from '../constants';
import { supabase } from '../lib/supabase';

const Community: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col h-full bg-background-dark pb-24">
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <h2 className="text-white text-base font-semibold uppercase tracking-wider">Comunidade</h2>
        <div className="flex gap-3">
          <button className="flex size-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </header>

      <div className="pt-4 px-4 sticky top-[65px] z-30 bg-background-dark/95 backdrop-blur-sm pb-2">
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          <button className="flex-none px-5 py-2 rounded-full bg-primary text-white text-sm font-medium border border-primary shadow-glow">Populares</button>
          <button className="flex-none px-5 py-2 rounded-full bg-surface-dark text-gray-300 text-sm font-medium border border-white/10">🥗 Nutrição</button>
          <button className="flex-none px-5 py-2 rounded-full bg-surface-dark text-gray-300 text-sm font-medium border border-white/10">💪 Treinos</button>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <span className="material-symbols-outlined animate-spin text-primary">sync</span>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-surface-card rounded-2xl border border-white/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${post.profiles?.avatar_url || IMAGES.prof_julia}")` }}></div>
                <div>
                  <h4 className="text-white text-sm font-bold">{post.profiles?.first_name} {post.profiles?.last_name}</h4>
                  <span className="text-gray-500 text-xs">{post.category} • {new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {post.title && <h3 className="text-white text-lg font-bold mb-2 leading-tight">{post.title}</h3>}
              <p className="text-gray-300 text-sm leading-relaxed mb-3">{post.content}</p>
              {post.image_url && (
                <div className="w-full h-48 bg-surface-dark rounded-xl mb-4 overflow-hidden border border-white/5">
                  <div className="w-full h-full bg-cover bg-center opacity-80" style={{ backgroundImage: `url("${post.image_url}")` }}></div>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                    <span className="text-sm font-medium">0</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                    <span className="text-sm font-medium">Comentar</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500">Nenhum post encontrado na comunidade.</div>
        )}
      </div>
    </div>
  );
};

export default Community;