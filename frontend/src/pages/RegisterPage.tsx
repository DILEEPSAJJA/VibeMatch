import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Sparkles, ArrowRight, User, Mail, Lock, MapPin, Radio, Check } from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  onBackToLanding: () => void;
}

const AVAILABLE_TAGS = [
  'Cyberpunk', 'AI Art', 'Synthwave', 'Tech', 'Coffee', 'Gaming', 
  'Ambient Music', 'Design', 'Sci-Fi', 'Astronomy', 'Generative Art',
  'Minimalism', 'Photography', 'Night Cycling', 'Open Source', 'Techno'
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin, onBackToLanding }) => {
  const { register, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('Non-Binary');
  const [vibeArchetype, setVibeArchetype] = useState('Tech Alchemist');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Cyberpunk', 'AI Art', 'Synthwave', 'Tech'
  ]);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (tag: string) => {
    setSelectedInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (selectedInterests.length < 2) {
      setError('Please select at least 2 vibe tags to tune your frequency.');
      return;
    }

    try {
      await register({
        fullName,
        username,
        email,
        password,
        location,
        age,
        gender,
        vibeArchetype,
        interests: selectedInterests,
        hobbies: ['Coding', 'Music Production'],
        languages: ['English'],
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 py-12">
      <ParticlesBackground />

      <div className="relative z-10 w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        
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
          <h2 className="text-xl font-bold text-white">Initialize Your Frequency</h2>
          <p className="text-xs text-slate-400">Create your unique persona and start matching with kindred souls</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kai Sterling"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-500"
                />
                <User className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. kai_resonance"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-500"
                />
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">@</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kai@resonance.io"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-500"
                />
                <Mail className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-500"
                />
                <Lock className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full pl-8 pr-2 py-2 rounded-xl glass-input text-xs text-white placeholder:text-slate-500"
                />
                <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Age
              </label>
              <input
                type="number"
                min={18}
                max={99}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gender Identity
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-2 py-2 rounded-xl glass-input text-xs text-white"
              >
                <option value="Non-Binary" className="bg-[#121422]">Non-Binary</option>
                <option value="Female" className="bg-[#121422]">Female</option>
                <option value="Male" className="bg-[#121422]">Male</option>
                <option value="Other" className="bg-[#121422]">Other</option>
              </select>
            </div>
          </div>

          {/* Vibe Archetype */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              Vibe Archetype
            </label>
            <select
              value={vibeArchetype}
              onChange={(e) => setVibeArchetype(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
            >
              <option value="Tech Alchemist" className="bg-[#121422]">Tech Alchemist (AI, Hackers, Software, Systems)</option>
              <option value="Cosmic Dreamer" className="bg-[#121422]">Cosmic Dreamer (Ambient, Visual Arts, Philosophy)</option>
              <option value="Synthwave Producer" className="bg-[#121422]">Synthwave Producer (Sound Design, Analog Gear)</option>
              <option value="Creative Polymath" className="bg-[#121422]">Creative Polymath (Poetry, Techno, Sci-Fi)</option>
              <option value="Night Owl Adventurer" className="bg-[#121422]">Night Owl Adventurer (Urban Exploration, Acoustics)</option>
              <option value="Mystic Explorer" className="bg-[#121422]">Mystic Explorer (Meditation, Lucid Dreaming, Nature)</option>
            </select>
          </div>

          {/* Tag Cloud Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Interest Tags ({selectedInterests.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-xl bg-black/20 border border-white/5">
              {AVAILABLE_TAGS.map((tag) => {
                const selected = selectedInterests.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      selected
                        ? 'bg-purple-600/40 text-purple-200 border border-purple-500/50 shadow-glow-purple'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 text-cyan-300" />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-purple transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <span>Complete Onboarding & Tune In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
