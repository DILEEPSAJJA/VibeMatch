import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  Maximize2, 
  Volume2,
  Sparkles
} from 'lucide-react';

export const VideoCallModal: React.FC = () => {
  const { 
    activeCall, 
    localStream, 
    remoteStream, 
    isMuted, 
    isVideoOff, 
    isScreenSharing, 
    toggleMute, 
    toggleVideo, 
    toggleScreenShare, 
    endCall 
  } = useSocket();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Bind local stream to local video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Bind remote stream to remote video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Timer
  useEffect(() => {
    if (!activeCall) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      setCallDuration(0);
    };
  }, [activeCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeCall) return null;

  const isVideoCall = activeCall.callType === 'VIDEO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl h-[85vh] glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-[#0a0b14]/90 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-purple-500/40 overflow-hidden shadow-glow-purple">
              <img
                src={activeCall.partnerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={activeCall.partnerName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {activeCall.partnerName}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live P2P
                </span>
              </h4>
              <p className="text-xs text-purple-300 font-mono tracking-wider">
                {formatDuration(callDuration)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WebRTC Encrypted Audio/Video</span>
          </div>
        </div>

        {/* Center Canvas / Video Feeds */}
        <div className="relative flex-1 w-full h-full bg-[#07080f] overflow-hidden flex items-center justify-center">
          
          {isVideoCall ? (
            <>
              {/* Remote Video Stream */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Placeholder when remote video is not yet transmitting */}
              {!remoteStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#0f1122] to-[#080911]">
                  <div className="relative w-28 h-28 rounded-full border-2 border-purple-400/50 p-1 shadow-glow-purple animate-pulse">
                    <img
                      src={activeCall.partnerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                      alt={activeCall.partnerName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-white">Connecting WebRTC P2P stream...</p>
                    <p className="text-xs text-slate-400 mt-1">Establishing direct browser media channel</p>
                  </div>
                </div>
              )}

              {/* Local Video Stream (PiP Corner) */}
              <div className="absolute bottom-4 right-4 w-36 sm:w-48 aspect-video rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-2xl glass-panel z-20">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
                />
                {isVideoOff && (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-xs text-slate-400">
                    Camera Off
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white">
                  You
                </div>
              </div>
            </>
          ) : (
            /* Audio-Only Visualizer */
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative w-36 h-36 rounded-full border-4 border-purple-500/50 p-2 shadow-glow-purple animate-pulse">
                <img
                  src={activeCall.partnerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                  alt={activeCall.partnerName}
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute -inset-4 rounded-full border border-cyan-400/20 animate-ping pointer-events-none" />
              </div>

              {/* Sound waves representation */}
              <div className="flex items-center gap-1.5 h-10">
                {[16, 28, 40, 24, 36, 48, 30, 20, 38, 22].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}px` }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-cyan-400 animate-pulse"
                  />
                ))}
              </div>

              <p className="text-sm font-semibold text-slate-200">
                Audio Call in Progress with {activeCall.partnerName}
              </p>
            </div>
          )}

        </div>

        {/* Bottom Control Tray */}
        <div className="relative z-20 p-4 bg-gradient-to-t from-[#0a0b14]/95 via-[#0a0b14]/80 to-transparent flex items-center justify-center gap-4 sm:gap-6">
          
          {/* Mute Mic */}
          <button
            onClick={toggleMute}
            className={`p-3.5 rounded-2xl glass-card transition-all ${
              isMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          {isVideoCall && (
            <button
              onClick={toggleVideo}
              className={`p-3.5 rounded-2xl glass-card transition-all ${
                isVideoOff ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
              title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* Screen Share */}
          {isVideoCall && (
            <button
              onClick={toggleScreenShare}
              className={`p-3.5 rounded-2xl glass-card transition-all ${
                isScreenSharing ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan' : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
              title="Share Screen"
            >
              <Monitor className="w-5 h-5" />
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-900/40 transition-all hover:scale-105"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </button>

        </div>

      </div>
    </div>
  );
};
