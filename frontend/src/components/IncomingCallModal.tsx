import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Phone, PhoneOff, Video, Mic } from 'lucide-react';

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, acceptCall, declineCall } = useSocket();

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm glass-panel rounded-3xl p-6 text-center border border-purple-500/30 shadow-2xl overflow-hidden">
        
        {/* Pulsing Neon Glow Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl animate-pulse -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-ping -z-10" />

        {/* Caller Avatar */}
        <div className="relative mx-auto w-24 h-24 mb-4">
          <img
            src={incomingCall.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt={incomingCall.senderName}
            className="w-full h-full rounded-full object-cover border-2 border-purple-400 shadow-glow-purple"
          />
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg">
            {incomingCall.callType === 'VIDEO' ? <Video className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          {incomingCall.senderName || "VibeMatch Friend"}
        </h3>
        <p className="text-sm text-cyan-300 font-medium mb-6">
          Incoming {incomingCall.callType === 'VIDEO' ? 'Video' : 'Audio'} Call...
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={declineCall}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:bg-rose-500">
              <PhoneOff className="w-6 h-6" />
            </div>
            <span className="text-xs text-slate-300 font-medium">Decline</span>
          </button>

          <button
            onClick={acceptCall}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:bg-emerald-500 shadow-glow-cyan animate-bounce">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-xs text-slate-300 font-medium">Accept</span>
          </button>
        </div>

      </div>
    </div>
  );
};
