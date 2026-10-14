import React, { useState, useEffect } from 'react';
import { MatchProfile } from '../types';
import { api } from '../services/api';
import { 
  Sparkles, 
  Heart, 
  X, 
  SlidersHorizontal, 
  MapPin, 
  Radio, 
  MessageSquare, 
  Info, 
  Flame, 
  LayoutGrid, 
  Layers, 
  RefreshCw,
  Check,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiscoveryPageProps {
  onOpenProfile: (userId: number) => void;
  onOpenChat: (userId: number) => void;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ onOpenProfile, onOpenChat }) => {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [minScore, setMinScore] = useState<number>(0);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [locationQuery, setLocationQuery] = useState('');

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await api.discover({
        minMatchScore: minScore,
        gender: selectedGender !== 'all' ? selectedGender : undefined,
        location: locationQuery || undefined,
      });
      setMatches(data);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [minScore, selectedGender]);

  const handleLike = async (profile: MatchProfile) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#06b6d4', '#ec4899']
    });

    try {
      await api.sendFriendRequest(profile.user.id);
      setMatches(prev => prev.map(m => m.user.id === profile.user.id ? { ...m, friendshipStatus: 'PENDING_SENT' } : m));
    } catch (e) {
      // Ignored if already sent
    }

    if (viewMode === 'card') {
      setCurrentIndex(prev => Math.min(prev + 1, matches.length));
    }
  };

  const handlePass = () => {
    if (viewMode === 'card') {
      setCurrentIndex(prev => Math.min(prev + 1, matches.length));
    }
  };

  const currentCard = matches[currentIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-cyan-300 animate-pulse" />
            <span>Harmonic Resonance Discovery</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Profiles dynamically ordered by neural interest matching & archetype synergy
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-[#121422] p-1 rounded-2xl border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-purple-600/40 text-purple-300 shadow-glow-purple' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'card' ? 'bg-purple-600/40 text-purple-300 shadow-glow-purple' : 'text-slate-400 hover:text-white'}`}
              title="Card Deck View"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-2xl glass-card text-xs font-bold flex items-center gap-2 transition-all ${
              showFilters ? 'border-purple-500/60 bg-purple-950/40 text-purple-300' : 'text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Filters</span>
          </button>

          <button
            onClick={loadMatches}
            className="p-2.5 rounded-2xl glass-card text-slate-400 hover:text-cyan-300 transition-colors"
            title="Refresh Frequency"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              Tune Discovery Frequency
            </h3>
            <button 
              onClick={() => { setMinScore(60); setSelectedGender('all'); setLocationQuery(''); }}
              className="text-xs text-purple-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Minimum Match Resonance</span>
                <span className="text-cyan-400 font-bold">{minScore}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Gender Preference
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
              >
                <option value="all" className="bg-[#121422]">All Genders</option>
                <option value="Female" className="bg-[#121422]">Female</option>
                <option value="Male" className="bg-[#121422]">Male</option>
                <option value="Non-Binary" className="bg-[#121422]">Non-Binary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Location Search
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Brooklyn, Austin, Tokyo"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
                <button
                  onClick={loadMatches}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Matches View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel h-80 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Radio className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Profiles at Current Frequency</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your minimum resonance score or relaxing gender and location filters.
          </p>
          <button
            onClick={() => { setMinScore(50); setSelectedGender('all'); setLocationQuery(''); }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-glow-purple"
          >
            Broaden Frequency
          </button>
        </div>
      ) : viewMode === 'card' ? (
        /* Swipeable Deck Mode */
        <div className="max-w-md mx-auto relative">
          {currentCard ? (
            <div className="glass-panel rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl space-y-4">
              
              {/* Photo & Match Ring */}
              <div className="relative h-96 w-full overflow-hidden">
                <img
                  src={currentCard.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
                  alt={currentCard.user.fullName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b14] via-transparent to-transparent" />

                {/* Match Score Badge */}
                <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-cyan-400/50 shadow-glow-cyan flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                    {currentCard.matchPercentage}%
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-white">{currentCard.user.fullName}</h3>
                    {currentCard.user.isVerified && <ShieldCheck className="w-5 h-5 text-cyan-400" />}
                    <span className="text-sm text-slate-300">{currentCard.user.age}</span>
                  </div>
                  <p className="text-xs text-purple-300 font-semibold flex items-center gap-1 mt-0.5">
                    <Radio className="w-3.5 h-3.5" />
                    {currentCard.user.vibeArchetype || 'Cosmic Explorer'}
                  </p>
                  {currentCard.user.location && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {currentCard.user.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-300 line-clamp-2">
                  {currentCard.user.bio || "Searching for high harmonic resonance in creative spaces."}
                </p>

                {/* Shared Interest Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {currentCard.user.interests?.slice(0, 4).map((interest) => {
                    const isShared = currentCard.sharedInterests.includes(interest);
                    return (
                      <span
                        key={interest}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                          isShared
                            ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {isShared && <Flame className="w-3 h-3 text-cyan-300" />}
                        {interest}
                      </span>
                    );
                  })}
                </div>

                {/* Deck Action Buttons */}
                <div className="flex items-center justify-center gap-6 pt-2">
                  <button
                    onClick={handlePass}
                    className="w-14 h-14 rounded-full glass-card border-rose-500/30 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
                    title="Pass"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => onOpenProfile(currentCard.user.id)}
                    className="w-12 h-12 rounded-full glass-card border-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-transform hover:scale-110"
                    title="View Profile Details"
                  >
                    <Info className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleLike(currentCard)}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-glow-purple"
                    title="Connect / Match"
                  >
                    <Heart className="w-6 h-6 fill-white" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-16 text-center glass-panel rounded-3xl p-6">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Deck Completed!</h3>
              <p className="text-xs text-slate-400 mt-1">You've explored all current candidates in this stack.</p>
              <button
                onClick={() => setCurrentIndex(0)}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Review Again
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Grid Mode */
        matches.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl p-8 border border-white/10 space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white">No Other Registered Users Yet</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              You are among the first members on VibeMatch! As new people register and tune into their frequency, their profiles will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
            <div
              key={match.user.id}
              className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/40 flex flex-col justify-between transition-all group"
            >
              {/* Image & Match Tag */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={match.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={match.user.fullName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e101f] via-transparent to-transparent" />

                {/* Match Percentage Pill */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-400/40 shadow-glow-cyan flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                    {match.matchPercentage}% Vibe
                  </span>
                </div>

                {match.user.isOnline && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      {match.user.fullName}
                      {match.user.isVerified && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                    </h3>
                    <span className="text-xs text-slate-400">{match.user.age} yrs</span>
                  </div>

                  <p className="text-xs text-purple-300 font-semibold flex items-center gap-1 mt-0.5">
                    <Radio className="w-3.5 h-3.5 text-purple-400" />
                    {match.user.vibeArchetype || 'Cosmic Explorer'}
                  </p>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                    {match.user.bio || "Exploring frequencies in art, cybernetics, and late-night philosophy."}
                  </p>

                  {/* Shared Interest Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {match.user.interests?.slice(0, 3).map((interest) => {
                      const isShared = match.sharedInterests.includes(interest);
                      return (
                        <span
                          key={interest}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1 ${
                            isShared
                              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                              : 'bg-white/5 text-slate-400 border border-white/5'
                          }`}
                        >
                          {isShared && <Flame className="w-3 h-3 text-cyan-300" />}
                          {interest}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenProfile(match.user.id)}
                    className="flex-1 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Profile
                  </button>

                  <button
                    onClick={() => onOpenChat(match.user.id)}
                    className="p-2 rounded-xl glass-card text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                    title="Direct Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleLike(match)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      match.friendshipStatus === 'PENDING_SENT'
                        ? 'bg-white/5 text-slate-400 border border-white/10'
                        : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-glow-purple'
                    }`}
                  >
                    {match.friendshipStatus === 'PENDING_SENT' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        Sent
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        Connect
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    )}

    </div>
  );
};
