import React, { useState } from 'react';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  MessageSquare, 
  Video, 
  Radio, 
  ShieldCheck, 
  Users, 
  Cpu, 
  Zap, 
  CheckCircle2,
  Heart
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  // Interactive Live Match Simulator
  const [selectedVibe1, setSelectedVibe1] = useState('Tech Alchemist');
  const [selectedVibe2, setSelectedVibe2] = useState('Cosmic Dreamer');

  const calculateSimulatedScore = (v1: string, v2: string) => {
    if (v1 === v2) return 96;
    const combo = `${v1}+${v2}`.toLowerCase();
    if (combo.includes('tech') && combo.includes('cosmic')) return 94;
    if (combo.includes('synthwave') && combo.includes('night owl')) return 91;
    if (combo.includes('creative') && combo.includes('cosmic')) return 89;
    return 85;
  };

  const simScore = calculateSimulatedScore(selectedVibe1, selectedVibe2);

  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden">
      <ParticlesBackground />

      {/* Top Navigation */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] shadow-glow-purple">
            <div className="w-full h-full bg-[#0d0f1d] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tight gradient-text">VibeMatch</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSignIn}
            className="px-4 py-2 rounded-xl glass-card text-xs sm:text-sm font-semibold text-purple-300 hover:text-white hover:border-purple-500/50 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-glow-purple transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <span>Create Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-purple-500/30 text-purple-300 text-xs font-bold shadow-glow-purple">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Gen High-Frequency Social Networking</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Find Your Soul's <br />
            <span className="gradient-text">Exact Frequency.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Stop swiping surface-level profiles. VibeMatch pairs you by shared passions, niche subcultures, vibe archetypes, and creative frequencies.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-glow-purple transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>Join VibeMatch Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onSignIn}
              className="px-6 py-4 rounded-2xl glass-card text-slate-200 hover:text-white hover:border-cyan-500/50 font-bold text-sm transition-all cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>

        {/* Live Interactive Resonance Simulator */}
        <div className="mt-16 max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-300" />
                Live Frequency Resonance Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select archetypes to preview how our multi-factor algorithm scores compatibility
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center gap-3 shadow-glow-purple">
              <span className="text-xs uppercase font-extrabold text-purple-300 tracking-wider">Synergy Score</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                {simScore}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Vibe 1 */}
            <div className="glass-card p-4 rounded-2xl border border-purple-500/20">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                Your Archetype
              </label>
              <select
                value={selectedVibe1}
                onChange={(e) => setSelectedVibe1(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white"
              >
                <option value="Tech Alchemist" className="bg-[#121422]">Tech Alchemist (AI, Hackers, Open Source)</option>
                <option value="Cosmic Dreamer" className="bg-[#121422]">Cosmic Dreamer (Ambient, Art, Lucid Vision)</option>
                <option value="Synthwave Producer" className="bg-[#121422]">Synthwave Producer (Analog Gear, Retro Sound)</option>
                <option value="Creative Polymath" className="bg-[#121422]">Creative Polymath (Techno, Poetry, Sci-Fi)</option>
                <option value="Night Owl Adventurer" className="bg-[#121422]">Night Owl Adventurer (Urban Nights, Acoustics)</option>
              </select>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[11px]">Cyberpunk</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[11px]">Synthesizers</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[11px]">AI Models</span>
              </div>
            </div>

            {/* Vibe 2 */}
            <div className="glass-card p-4 rounded-2xl border border-cyan-500/20">
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Match Candidate
              </label>
              <select
                value={selectedVibe2}
                onChange={(e) => setSelectedVibe2(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white"
              >
                <option value="Cosmic Dreamer" className="bg-[#121422]">Cosmic Dreamer (Ambient, Art, Lucid Vision)</option>
                <option value="Tech Alchemist" className="bg-[#121422]">Tech Alchemist (AI, Hackers, Open Source)</option>
                <option value="Synthwave Producer" className="bg-[#121422]">Synthwave Producer (Analog Gear, Retro Sound)</option>
                <option value="Creative Polymath" className="bg-[#121422]">Creative Polymath (Techno, Poetry, Sci-Fi)</option>
                <option value="Night Owl Adventurer" className="bg-[#121422]">Night Owl Adventurer (Urban Nights, Acoustics)</option>
              </select>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[11px]">Generative Art</span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[11px]">Analog Frequencies</span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[11px]">Neo Tokyo</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                Predicted dynamic: <span className="text-cyan-300">Electrifying creative flow & shared nocturnal aesthetics.</span>
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
            >
              Find Matches Now
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Quantum Match Engine</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jaccard interest scoring, hobby synergy, and vibe archetypes deliver 90%+ authentic resonance.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">WhatsApp-Grade Chat</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time STOMP messaging with voice notes, image sharing, read double ticks, and emoji vibe reactions.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">P2P WebRTC Calls</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              One-to-one encrypted audio and video calling with camera toggle, mute mic, and screen sharing.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Curated Vibe Hubs</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Join exclusive communities like AI Builders, Neon Synth Heads, and Midnight Gamers.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};
