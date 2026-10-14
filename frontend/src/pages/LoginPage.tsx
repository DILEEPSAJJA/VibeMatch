import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Sparkles, ArrowRight, Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, onBackToLanding }) => {
  const { login, quickLogin, isLoading } = useAuth();
  const [username, setUsername] = useState('alex_vibe');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    }
  };

  const handleDemoClick = async (u: string, p: string) => {
    setError(null);
    setUsername(u);
    setPassword(p);
    try {
      await quickLogin(u, p);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <ParticlesBackground />

      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 cursor-pointer group mb-1"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] shadow-glow-purple">
              <div className="w-full h-full bg-[#0d0f1d] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <span className="text-2xl font-black gradient-text">VibeMatch</span>
          </div>
          <h2 className="text-xl font-bold text-white">Tune into Your Frequency</h2>
          <p className="text-xs text-slate-400">Sign in to resume conversations and discover matches</p>
        </div>

        {/* 1-Click Quick Demo Accounts */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-bold text-purple-400 text-center">
            ⚡ Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('alex_vibe', 'password123')}
              className="p-2.5 rounded-xl glass-card text-left hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-purple-300">Alex Rivera</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Tech Alchemist</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('maya_cosmic', 'password123')}
              className="p-2.5 rounded-xl glass-card text-left hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300">Maya Lin</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Cosmic Dreamer</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('jordan_cyber', 'password123')}
              className="p-2.5 rounded-xl glass-card text-left hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-purple-300">Jordan Vance</span>
                <span className="w-2 h-2 rounded-full bg-slate-500" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Synthwave Producer</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('admin', 'admin123')}
              className="p-2.5 rounded-xl glass-card text-left hover:border-pink-500/50 transition-all group bg-pink-950/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-300 group-hover:text-pink-200">Admin</span>
                <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Moderator Dashboard</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#121422] px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider relative">
            Or Standard Login
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="alex_vibe or alex@vibematch.io"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder:text-slate-500"
              />
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm text-white placeholder:text-slate-500"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-purple transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
            >
              Create Vibe Profile
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
