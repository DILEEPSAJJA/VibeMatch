import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Eye, 
  Sparkles, 
  Save, 
  Check, 
  MapPin, 
  Radio, 
  Globe,
  Ghost
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, preferences, updateUser, updatePreferences } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [location, setLocation] = useState(user?.location || '');
  const [vibeArchetype, setVibeArchetype] = useState(user?.vibeArchetype || 'Tech Alchemist');

  const [ghostMode, setGhostMode] = useState(preferences?.ghostMode || false);
  const [showReadReceipts, setShowReadReceipts] = useState(preferences?.showReadReceipts ?? true);
  const [showActiveStatus, setShowActiveStatus] = useState(preferences?.showActiveStatus ?? true);
  const [profileVisibility, setProfileVisibility] = useState(preferences?.profileVisibility || 'PUBLIC');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await Promise.all([
        updateUser({
          fullName,
          bio,
          avatarUrl,
          location,
          vibeArchetype,
        }),
        updatePreferences({
          ghostMode,
          showReadReceipts,
          showActiveStatus,
          profileVisibility,
        }),
      ]);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-purple-400" />
          <span>Vibe Profile & Privacy Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your persona, adjust frequency discovery visibility, and configure privacy options
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <User className="w-5 h-5 text-purple-400" />
            Persona & Identity
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt="Avatar"
                className="w-24 h-24 rounded-3xl object-cover border-2 border-purple-500/50 shadow-glow-purple"
              />
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vibe Archetype
                  </label>
                  <select
                    value={vibeArchetype}
                    onChange={(e) => setVibeArchetype(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                  >
                    <option value="Tech Alchemist" className="bg-[#121422]">Tech Alchemist</option>
                    <option value="Cosmic Dreamer" className="bg-[#121422]">Cosmic Dreamer</option>
                    <option value="Synthwave Producer" className="bg-[#121422]">Synthwave Producer</option>
                    <option value="Creative Polymath" className="bg-[#121422]">Creative Polymath</option>
                    <option value="Night Owl Adventurer" className="bg-[#121422]">Night Owl Adventurer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs text-white"
                />
                <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bio Description
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What frequence are you currently broadcasting?"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            Privacy & Frequency Cloaking
          </h3>

          <div className="space-y-4">
            {/* Ghost Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Ghost className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Ghost Mode (Cloaking)</h4>
                  <p className="text-[11px] text-slate-400">
                    Hide your profile from active discovery feeds while browsing
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ghostMode}
                onChange={(e) => setGhostMode(e.target.checked)}
                className="w-5 h-5 rounded-md accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Read Receipts */}
            <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Read Receipts (Double Blue Ticks)</h4>
                  <p className="text-[11px] text-slate-400">
                    Let others see when you've opened and read their messages
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={showReadReceipts}
                onChange={(e) => setShowReadReceipts(e.target.checked)}
                className="w-5 h-5 rounded-md accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Profile Visibility Scope</h4>
                  <p className="text-[11px] text-slate-400">
                    Choose who can view full profile details and initiate calls
                  </p>
                </div>
              </div>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl glass-input text-xs text-white"
              >
                <option value="PUBLIC" className="bg-[#121422]">Public (Everyone)</option>
                <option value="FRIENDS_ONLY" className="bg-[#121422]">Friends Only</option>
                <option value="PRIVATE" className="bg-[#121422]">Private</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              Settings saved successfully!
            </span>
          )}
          {!savedSuccess && <div />}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-glow-purple transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
