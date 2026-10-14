import React, { useEffect, useState } from 'react';
import { MatchProfile } from '../types';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { 
  X, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  UserPlus, 
  Check, 
  Phone, 
  Video, 
  Flag, 
  Flame,
  Globe,
  Radio,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileDetailModalProps {
  userId: number;
  onClose: () => void;
  onOpenChat: (userId: number) => void;
  onOpenReport: (userId: number) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  userId,
  onClose,
  onOpenChat,
  onOpenReport,
}) => {
  const [profile, setProfile] = useState<MatchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { startCall } = useSocket();

  useEffect(() => {
    setLoading(true);
    api.getCompatibility(userId)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSendFriendRequest = async () => {
    if (!profile) return;
    try {
      await api.sendFriendRequest(profile.user.id);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#ec4899']
      });
      setProfile(prev => prev ? { ...prev, friendshipStatus: 'PENDING_SENT' } : null);
    } catch (err: any) {
      alert(err.message || 'Could not send request');
    }
  };

  const handleAcceptRequest = async () => {
    if (!profile || !profile.requestId) return;
    try {
      await api.acceptRequest(profile.requestId);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#10b981']
      });
      setProfile(prev => prev ? { ...prev, friendshipStatus: 'FRIENDS' } : null);
    } catch (err: any) {
      alert(err.message || 'Could not accept request');
    }
  };

  const handleSendIcebreaker = (starter: string) => {
    if (!profile) return;
    api.sendMessage(profile.user.id, starter).then(() => {
      onOpenChat(profile.user.id);
      onClose();
    }).catch(() => {
      onOpenChat(profile.user.id);
      onClose();
    });
  };

  if (!profile && loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const { user, matchPercentage, scoreBreakdown, compatibilityVerdict, icebreakers, friendshipStatus } = profile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-panel rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full glass-card text-slate-300 hover:text-white transition-all hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-purple-500/50 shadow-glow-purple">
                <img
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              {user.isOnline && (
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-[#0d0f1d] animate-pulse" />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-extrabold text-white">{user.fullName}</h2>
                {user.isVerified && (
                  <span title="Verified VibeMatch User">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </span>
                )}
                <span className="text-sm font-semibold text-slate-400">@{user.username}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-purple-400" />
                  {user.vibeArchetype || 'Cosmic Explorer'}
                </span>
                {user.location && (
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {user.location}
                  </span>
                )}
                {user.age && (
                  <span className="text-xs text-slate-400">
                    {user.age} yrs • {user.gender}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {user.bio || "Crafting sonic realities and seeking kindred frequencies in the digital ether."}
              </p>
            </div>
          </div>

          {/* Match Score & Verdict Card */}
          <div className="glass-card rounded-2xl p-5 border border-purple-500/30 shadow-glow-purple bg-gradient-to-r from-purple-950/20 via-slate-900/40 to-cyan-950/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-300">
                  Resonance Compatibility
                </span>
              </div>
              <div className="flex items-center gap-1 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                {matchPercentage}%
              </div>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-purple-200 mb-4">
              {compatibilityVerdict}
            </p>

            {/* Score Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Interests</span>
                  <span className="text-purple-300 font-bold">{scoreBreakdown?.interests || 35}/40</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((scoreBreakdown?.interests || 35) / 40) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Vibe Archetype</span>
                  <span className="text-cyan-300 font-bold">{scoreBreakdown?.vibe || 22}/25</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((scoreBreakdown?.vibe || 22) / 25) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Hobbies</span>
                  <span className="text-pink-300 font-bold">{scoreBreakdown?.hobbies || 16}/20</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((scoreBreakdown?.hobbies || 16) / 20) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Languages</span>
                  <span className="text-emerald-300 font-bold">{scoreBreakdown?.languages || 15}/15</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((scoreBreakdown?.languages || 15) / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interests & Tags */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">Interests & Vibes</h4>
            <div className="flex flex-wrap gap-2">
              {user.interests?.map((interest) => {
                const isShared = profile.sharedInterests.includes(interest);
                return (
                  <span
                    key={interest}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isShared
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-glow-purple'
                        : 'bg-slate-800/60 text-slate-300 border border-white/5'
                    }`}
                  >
                    {isShared && <Flame className="w-3.5 h-3.5 text-cyan-300" />}
                    {interest}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Hobbies & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Hobbies</h4>
              <div className="flex flex-wrap gap-1.5">
                {user.hobbies?.map(h => (
                  <span key={h} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-slate-300 border border-white/5">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Languages
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.languages?.map(l => (
                  <span key={l} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-cyan-300 border border-white/5">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Icebreaker Suggestions */}
          {icebreakers && icebreakers.length > 0 && (
            <div className="glass-card p-5 rounded-2xl border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs uppercase tracking-wider font-bold text-cyan-300">
                  AI-Curated Icebreaker Starters
                </h4>
              </div>
              <div className="space-y-2">
                {icebreakers.map((starter, i) => (
                  <div
                    key={i}
                    onClick={() => handleSendIcebreaker(starter)}
                    className="p-3 rounded-xl bg-cyan-950/20 hover:bg-cyan-900/30 border border-cyan-500/20 text-xs text-slate-200 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <span>"{starter}"</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 p-1 flex items-center gap-1 font-bold">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/10 glass-panel flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenReport(user.id);
                onClose();
              }}
              className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              title="Report User"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio / Video Quick Calls */}
            {friendshipStatus === 'FRIENDS' && (
              <>
                <button
                  onClick={() => {
                    startCall(user.id, user.fullName, user.avatarUrl, 'AUDIO');
                    onClose();
                  }}
                  className="p-3 rounded-xl glass-card text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    startCall(user.id, user.fullName, user.avatarUrl, 'VIDEO');
                    onClose();
                  }}
                  className="p-3 rounded-xl glass-card text-slate-200 hover:text-purple-300 hover:border-purple-500/40 transition-colors"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Friend Request / Status Button */}
            {friendshipStatus === 'NONE' && (
              <button
                onClick={handleSendFriendRequest}
                className="px-5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 font-bold text-xs flex items-center gap-2 transition-all shadow-glow-purple"
              >
                <UserPlus className="w-4 h-4" />
                Send Request
              </button>
            )}

            {friendshipStatus === 'PENDING_SENT' && (
              <span className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-semibold text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400" />
                Request Pending
              </span>
            )}

            {friendshipStatus === 'PENDING_RECEIVED' && (
              <button
                onClick={handleAcceptRequest}
                className="px-5 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/50 font-bold text-xs flex items-center gap-2 transition-all shadow-glow-cyan"
              >
                <Check className="w-4 h-4" />
                Accept Request
              </button>
            )}

            {/* Direct Message Button */}
            <button
              onClick={() => {
                onOpenChat(user.id);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-glow-purple"
            >
              <MessageSquare className="w-4 h-4" />
              Direct Message
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
