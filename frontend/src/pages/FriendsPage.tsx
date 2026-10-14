import React, { useState, useEffect } from 'react';
import { Friend, FriendRequest, User } from '../types';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { 
  Users, 
  UserCheck, 
  Send, 
  Ban, 
  MessageSquare, 
  Phone, 
  Video, 
  Check, 
  X, 
  Radio, 
  ShieldCheck, 
  Sparkles,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FriendsPageProps {
  onOpenChat: (userId: number) => void;
  onOpenProfile: (userId: number) => void;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({ onOpenChat, onOpenProfile }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'incoming' | 'sent' | 'blocked'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [blocked, setBlocked] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { startCall } = useSocket();

  const loadData = async () => {
    setLoading(true);
    try {
      const [f, inc, out, blk] = await Promise.all([
        api.getFriends(),
        api.getIncomingRequests(),
        api.getOutgoingRequests(),
        api.getBlockedUsers(),
      ]);
      setFriends(f);
      setIncoming(inc);
      setOutgoing(out);
      setBlocked(blk);
    } catch (err) {
      console.error('Error loading social data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (reqId: number) => {
    try {
      await api.acceptRequest(reqId);
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#10b981']
      });
      loadData();
    } catch (e: any) {
      alert(e.message || 'Could not accept');
    }
  };

  const handleReject = async (reqId: number) => {
    try {
      await api.rejectRequest(reqId);
      setIncoming(prev => prev.filter(r => r.id !== reqId));
    } catch (e: any) {
      alert(e.message || 'Could not reject');
    }
  };

  const handleWithdraw = async (reqId: number) => {
    try {
      await api.withdrawRequest(reqId);
      setOutgoing(prev => prev.filter(r => r.id !== reqId));
    } catch (e: any) {
      alert(e.message || 'Could not withdraw');
    }
  };

  const handleUnblock = async (userId: number) => {
    try {
      await api.unblockUser(userId);
      setBlocked(prev => prev.filter(u => u.id !== userId));
    } catch (e: any) {
      alert(e.message || 'Could not unblock');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Users className="w-7 h-7 text-purple-400" />
          <span>Vibe Connections & Requests</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your established frequencies, incoming invitations, and sent requests
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'friends'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-glow-purple'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Friends ({friends.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'incoming'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-glow-purple'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Received ({incoming.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'sent'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-glow-purple'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent ({outgoing.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blocked')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'blocked'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-glow-purple'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Blocked ({blocked.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="glass-panel h-36 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* 1. Friends Tab */}
          {activeTab === 'friends' && (
            <div>
              {friends.length === 0 ? (
                <div className="py-16 text-center glass-panel rounded-3xl p-8 space-y-3">
                  <Users className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Friends Connected Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Head over to Discover to explore high-compatibility profiles and initiate connections!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((item) => (
                    <div
                      key={item.friendshipId}
                      className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="relative">
                          <img
                            src={item.friend.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                            alt={item.friend.fullName}
                            className="w-12 h-12 rounded-2xl object-cover border border-purple-500/40"
                          />
                          {item.friend.isOnline && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#0d0f1d] animate-pulse" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 
                              onClick={() => onOpenProfile(item.friend.id)}
                              className="text-sm font-bold text-white hover:text-cyan-300 cursor-pointer truncate"
                            >
                              {item.friend.fullName}
                            </h3>
                            {item.friend.isVerified && <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />}
                          </div>

                          <p className="text-[11px] text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                            <Radio className="w-3 h-3" />
                            {item.friend.vibeArchetype || 'Cosmic Explorer'}
                          </p>

                          {item.lastMessage && (
                            <p className="text-xs text-slate-400 truncate mt-1 italic">
                              "{item.lastMessage}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                        <button
                          onClick={() => onOpenChat(item.friend.id)}
                          className="flex-1 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat
                        </button>

                        <button
                          onClick={() => startCall(item.friend.id, item.friend.fullName, item.friend.avatarUrl, 'AUDIO')}
                          className="p-2 rounded-xl glass-card text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                          title="Audio Call"
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => startCall(item.friend.id, item.friend.fullName, item.friend.avatarUrl, 'VIDEO')}
                          className="p-2 rounded-xl glass-card text-slate-300 hover:text-purple-300 hover:border-purple-500/40 transition-colors"
                          title="Video Call"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Received Requests Tab */}
          {activeTab === 'incoming' && (
            <div>
              {incoming.length === 0 ? (
                <div className="py-16 text-center glass-panel rounded-3xl p-8 space-y-3">
                  <Sparkles className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Pending Received Requests</h3>
                  <p className="text-xs text-slate-400">
                    When someone feels a harmonic vibe with your profile, their invitation will appear here!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {incoming.map((req) => (
                    <div
                      key={req.id}
                      className="glass-card rounded-2xl p-5 border border-purple-500/30 space-y-4 shadow-glow-purple"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={req.sender.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                          alt={req.sender.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border border-purple-500/40"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => onOpenProfile(req.sender.id)}
                            className="text-sm font-bold text-white hover:text-cyan-300 cursor-pointer truncate"
                          >
                            {req.sender.fullName}
                          </h4>
                          <p className="text-[11px] text-purple-400 font-semibold mt-0.5">
                            {req.sender.vibeArchetype}
                          </p>
                          {req.sender.location && (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-cyan-400" />
                              {req.sender.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleReject(req.id)}
                          className="flex-1 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-rose-400 hover:border-rose-500/30 transition-colors flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Decline
                        </button>

                        <button
                          onClick={() => handleAccept(req.id)}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-cyan flex items-center justify-center gap-1 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Sent Requests Tab */}
          {activeTab === 'sent' && (
            <div>
              {outgoing.length === 0 ? (
                <div className="py-16 text-center glass-panel rounded-3xl p-8 space-y-3">
                  <Send className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Outgoing Requests Pending</h3>
                  <p className="text-xs text-slate-400">
                    Discover new profiles and send vibe requests to build your circle!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {outgoing.map((req) => (
                    <div
                      key={req.id}
                      className="glass-card rounded-2xl p-5 border border-white/10 space-y-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={req.receiver.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                          alt={req.receiver.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => onOpenProfile(req.receiver.id)}
                            className="text-sm font-bold text-white hover:text-cyan-300 cursor-pointer truncate"
                          >
                            {req.receiver.fullName}
                          </h4>
                          <p className="text-[11px] text-purple-400 font-semibold mt-0.5">
                            {req.receiver.vibeArchetype}
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            Awaiting response...
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleWithdraw(req.id)}
                          className="w-full py-2 rounded-xl glass-card text-xs text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                        >
                          Withdraw Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Blocked Tab */}
          {activeTab === 'blocked' && (
            <div>
              {blocked.length === 0 ? (
                <div className="py-16 text-center glass-panel rounded-3xl p-8 space-y-3">
                  <Ban className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Blocked Users</h3>
                  <p className="text-xs text-slate-400">
                    Your space is clear and tranquil.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blocked.map((u) => (
                    <div
                      key={u.id}
                      className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                          alt={u.fullName}
                          className="w-10 h-10 rounded-xl object-cover grayscale"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-300">{u.fullName}</h4>
                          <span className="text-xs text-slate-500">@{u.username}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnblock(u.id)}
                        className="px-3 py-1.5 rounded-xl glass-card text-xs text-slate-300 hover:text-white"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
};
