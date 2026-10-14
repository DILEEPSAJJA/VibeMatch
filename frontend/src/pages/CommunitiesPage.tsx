import React, { useState, useEffect } from 'react';
import { Community, CommunityPost } from '../types';
import { api } from '../services/api';
import { 
  Radio, 
  Users, 
  MessageSquare, 
  Heart, 
  Send, 
  Sparkles, 
  Check, 
  Plus, 
  ArrowLeft 
} from 'lucide-react';

export const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const data = await api.getCommunities();
      setCommunities(data);
    } catch (err) {
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadPosts = async (communityId: number) => {
    try {
      const p = await api.getCommunityPosts(communityId);
      setPosts(p);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  const handleSelectCommunity = (c: Community) => {
    setActiveCommunity(c);
    loadPosts(c.id);
  };

  const handleToggleJoin = async (c: Community, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (c.isMember) {
        const updated = await api.leaveCommunity(c.id);
        setCommunities(prev => prev.map(item => item.id === c.id ? updated : item));
        if (activeCommunity?.id === c.id) setActiveCommunity(updated);
      } else {
        const updated = await api.joinCommunity(c.id);
        setCommunities(prev => prev.map(item => item.id === c.id ? updated : item));
        if (activeCommunity?.id === c.id) setActiveCommunity(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !activeCommunity) return;

    try {
      const created = await api.createCommunityPost(activeCommunity.id, newPostContent.trim());
      setPosts(prev => [created, ...prev]);
      setNewPostContent('');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const categories = ['All', 'Music & Audio', 'Tech & AI', 'Creatives & Writers', 'Gaming & Esports'];

  const filtered = selectedCategory === 'All' 
    ? communities 
    : communities.filter(c => c.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Radio className="w-7 h-7 text-cyan-400" />
            <span>Vibe Hub Communities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immerse yourself in specialized subcultures, discuss topics, and discover group synergy
          </p>
        </div>

        {activeCommunity && (
          <button
            onClick={() => setActiveCommunity(null)}
            className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Hubs
          </button>
        )}
      </div>

      {!activeCommunity ? (
        <>
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-glow-purple'
                    : 'glass-card text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Communities Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="glass-panel h-64 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectCommunity(c)}
                  className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/40 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  {/* Banner */}
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={c.banner || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80"}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e101f] via-[#0e101f]/40 to-transparent" />
                    
                    <span className="absolute top-3 left-3 text-2xl p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                      {c.icon}
                    </span>

                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 text-cyan-300 text-[11px] font-bold border border-cyan-500/30">
                      {c.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span>{c.memberCount} members</span>
                      </div>

                      <button
                        onClick={(e) => handleToggleJoin(c, e)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          c.isMember
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 shadow-glow-purple'
                        }`}
                      >
                        {c.isMember ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Joined
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Join Hub
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Active Community Feed */
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl p-3.5 rounded-3xl bg-purple-950/60 border border-purple-500/40 shadow-glow-purple">
                {activeCommunity.icon}
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">{activeCommunity.category}</span>
                <h2 className="text-2xl font-black text-white">{activeCommunity.name}</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">{activeCommunity.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="text-xs text-slate-400 block">Community</span>
                <span className="text-base font-bold text-white">{activeCommunity.memberCount} Members</span>
              </div>
              <button
                onClick={(e) => handleToggleJoin(activeCommunity, e)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCommunity.isMember
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-glow-purple'
                }`}
              >
                {activeCommunity.isMember ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {activeCommunity.isMember ? 'Member' : 'Join Space'}
              </button>
            </div>
          </div>

          {/* Create Post Form */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-lg">
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share a thought, audio link, or question with the hub..."
                rows={2}
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white placeholder:text-slate-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs disabled:opacity-40 transition-all shadow-glow-purple flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post to Hub
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="py-12 text-center glass-panel rounded-3xl text-xs text-slate-400">
                No discussion posts in this hub yet. Be the first to spark the conversation!
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={post.authorName}
                      className="w-9 h-9 rounded-full object-cover border border-purple-500/30"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{post.authorName}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
                    <button className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.likesCount}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
