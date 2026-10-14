import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../types';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { 
  Sparkles, 
  MessageSquare, 
  Users, 
  Compass, 
  ShieldAlert, 
  Bell, 
  Settings, 
  LogOut, 
  CheckCheck, 
  Flame,
  Radio
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenProfileModal?: (userId: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();
  const { isConnected, subscribeToNotifications } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    api.getNotifications().then(setNotifications).catch(() => {});
    api.getUnreadCount().then(res => setUnreadCount(res.unreadCount)).catch(() => {});
  }, [user]);

  // Subscribe to live notifications
  useEffect(() => {
    const unsubscribe = subscribeToNotifications((newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    return unsubscribe;
  }, [subscribeToNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (_) {}
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('discover')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] transition-transform group-hover:scale-105 shadow-glow-purple">
            <div className="w-full h-full bg-[#0d0f1d] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight gradient-text">VibeMatch</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Find Your Frequency</p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121422]/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          <button
            onClick={() => setCurrentTab('discover')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'discover'
                ? 'bg-gradient-to-r from-purple-600/90 to-cyan-600/90 text-white shadow-glow-purple font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            Discover
          </button>

          <button
            onClick={() => setCurrentTab('friends')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'friends'
                ? 'bg-gradient-to-r from-purple-600/90 to-cyan-600/90 text-white shadow-glow-purple font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            Friends
          </button>

          <button
            onClick={() => setCurrentTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'chat'
                ? 'bg-gradient-to-r from-purple-600/90 to-cyan-600/90 text-white shadow-glow-purple font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>

          <button
            onClick={() => setCurrentTab('communities')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'communities'
                ? 'bg-gradient-to-r from-purple-600/90 to-cyan-600/90 text-white shadow-glow-purple font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-4 h-4" />
            Vibe Hub
          </button>

          {user.role === 'ROLE_ADMIN' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'admin'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-glow-pink font-semibold'
                  : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Admin
            </button>
          )}
        </nav>

        {/* Right Section: Notification & User Pill */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-purple-500/40 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-glow-pink">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-white/10 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-sm text-white">Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-white/5 mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No notifications yet. You're fully in tune! ✨
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`py-3 px-2 rounded-xl transition-colors ${n.isRead ? 'opacity-70' : 'bg-purple-950/20'}`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={n.actorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                            alt={n.actorName || "User"}
                            className="w-9 h-9 rounded-full object-cover border border-purple-500/30"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-100">{n.title}</p>
                            <p className="text-xs text-slate-300 truncate mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">Just now</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div 
            onClick={() => setCurrentTab('settings')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl glass-card cursor-pointer hover:border-purple-500/40 transition-all"
          >
            <div className="relative">
              <img
                src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
              />
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#0d0f1d] ${isConnected ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-100 leading-tight">{user.fullName}</p>
              <p className="text-[10px] text-purple-400 leading-tight">{user.vibeArchetype || 'Cosmic Explorer'}</p>
            </div>
          </div>

          {/* Settings & Logout Quick Actions */}
          <button
            onClick={() => setCurrentTab('settings')}
            title="Settings"
            className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-white transition-colors hidden sm:flex"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-pink-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('discover')}
          className={`flex flex-col items-center gap-1 text-[11px] ${currentTab === 'discover' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          <Compass className="w-5 h-5" />
          Discover
        </button>

        <button
          onClick={() => setCurrentTab('friends')}
          className={`flex flex-col items-center gap-1 text-[11px] ${currentTab === 'friends' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          <Users className="w-5 h-5" />
          Friends
        </button>

        <button
          onClick={() => setCurrentTab('chat')}
          className={`flex flex-col items-center gap-1 text-[11px] ${currentTab === 'chat' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          <MessageSquare className="w-5 h-5" />
          Chat
        </button>

        <button
          onClick={() => setCurrentTab('communities')}
          className={`flex flex-col items-center gap-1 text-[11px] ${currentTab === 'communities' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          <Radio className="w-5 h-5" />
          Hub
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center gap-1 text-[11px] ${currentTab === 'settings' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </header>
  );
};
