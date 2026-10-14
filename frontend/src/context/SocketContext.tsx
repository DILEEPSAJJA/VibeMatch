import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { ChatMessage, Reaction, Notification, WebRtcSignal } from '../types';

interface CallSession {
  partnerId: number;
  partnerName: string;
  partnerAvatar?: string;
  callType: 'AUDIO' | 'VIDEO';
  isInitiator: boolean;
}

interface SocketContextType {
  isConnected: boolean;
  incomingCall: WebRtcSignal | null;
  activeCall: CallSession | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  startCall: (partnerId: number, partnerName: string, partnerAvatar?: string, callType?: 'AUDIO' | 'VIDEO') => Promise<void>;
  acceptCall: () => Promise<void>;
  declineCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  sendTyping: (receiverId: number, isTyping: boolean) => void;
  subscribeToMessages: (handler: (msg: ChatMessage) => void) => () => void;
  subscribeToReactions: (handler: (reaction: Reaction) => void) => () => void;
  subscribeToTyping: (handler: (typing: { senderId: number; isTyping: boolean }) => void) => () => void;
  subscribeToNotifications: (handler: (notif: Notification) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// WebRTC STUN servers
const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [incomingCall, setIncomingCall] = useState<WebRtcSignal | null>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const messageSubscribers = useRef<Set<(msg: ChatMessage) => void>>(new Set());
  const reactionSubscribers = useRef<Set<(reaction: Reaction) => void>>(new Set());
  const typingSubscribers = useRef<Set<(typing: { senderId: number; isTyping: boolean }) => void>>(new Set());
  const notificationSubscribers = useRef<Set<(notif: Notification) => void>>(new Set());

  // Helper to send frame / signal over WebSocket
  const sendWsPayload = useCallback((destination: string, payload: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // Send JSON message wrapper
      const msg = JSON.stringify({ destination, payload });
      socketRef.current.send(msg);
    }
  }, []);

  // WebRTC Signal handler
  const handleSignal = useCallback(async (signal: WebRtcSignal) => {
    if (!user || signal.receiverId !== user.id) return;

    switch (signal.type) {
      case 'CALL_REQUEST':
        setIncomingCall(signal);
        break;

      case 'CALL_DECLINE':
        endCall();
        break;

      case 'CALL_ACCEPT':
        // Partner accepted call, now create Offer
        if (peerConnectionRef.current && activeCall) {
          try {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            sendWsPayload('/app/call.signal', {
              type: 'OFFER',
              senderId: user.id,
              receiverId: signal.senderId,
              payload: offer,
              callType: activeCall.callType,
              timestamp: Date.now(),
            });
          } catch (err) {
            console.error('Error creating offer:', err);
          }
        }
        break;

      case 'OFFER':
        if (peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal.payload));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            sendWsPayload('/app/call.signal', {
              type: 'ANSWER',
              senderId: user.id,
              receiverId: signal.senderId,
              payload: answer,
              callType: signal.callType,
              timestamp: Date.now(),
            });
          } catch (err) {
            console.error('Error handling offer:', err);
          }
        }
        break;

      case 'ANSWER':
        if (peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal.payload));
          } catch (err) {
            console.error('Error setting remote answer:', err);
          }
        }
        break;

      case 'ICE_CANDIDATE':
        if (peerConnectionRef.current && signal.payload) {
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(signal.payload));
          } catch (err) {
            console.error('Error adding ICE candidate:', err);
          }
        }
        break;

      case 'CALL_END':
        endCall();
        break;
    }
  }, [user, activeCall, sendWsPayload]);

  // Connect WebSocket
  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = (window.location.port === '3000') 
      ? window.location.host 
      : `${window.location.hostname || 'localhost'}:8080`;
    const wsUrl = `${protocol}//${host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.destination) {
            if (data.destination.includes('/topic/messages/')) {
              messageSubscribers.current.forEach(fn => fn(data.payload));
            } else if (data.destination.includes('/topic/reactions/')) {
              reactionSubscribers.current.forEach(fn => fn(data.payload));
            } else if (data.destination.includes('/topic/typing/')) {
              typingSubscribers.current.forEach(fn => fn(data.payload));
            } else if (data.destination.includes('/topic/notifications/')) {
              notificationSubscribers.current.forEach(fn => fn(data.payload));
            } else if (data.destination.includes('/topic/calls/')) {
              handleSignal(data.payload);
            }
          }
        } catch (_) {}
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      return () => {
        ws.close();
      };
    } catch (e) {
      console.warn('WebSocket connection fallback:', e);
    }
  }, [user, handleSignal]);

  // Initialize WebRTC Peer Connection
  const initPeerConnection = (targetUserId: number): RTCPeerConnection => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);

    pc.onicecandidate = (event) => {
      if (event.candidate && user) {
        sendWsPayload('/app/call.signal', {
          type: 'ICE_CANDIDATE',
          senderId: user.id,
          receiverId: targetUserId,
          payload: event.candidate,
          timestamp: Date.now(),
        });
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // Start Call
  const startCall = async (partnerId: number, partnerName: string, partnerAvatar?: string, callType: 'AUDIO' | 'VIDEO' = 'VIDEO') => {
    if (!user) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'VIDEO',
      });
      setLocalStream(stream);

      const pc = initPeerConnection(partnerId);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      setActiveCall({
        partnerId,
        partnerName,
        partnerAvatar,
        callType,
        isInitiator: true,
      });

      sendWsPayload('/app/call.signal', {
        type: 'CALL_REQUEST',
        senderId: user.id,
        receiverId: partnerId,
        senderName: user.fullName || user.username,
        senderAvatar: user.avatarUrl,
        callType,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Could not get local media stream:', err);
      alert('Camera/Microphone access is required for calls.');
    }
  };

  // Accept Call
  const acceptCall = async () => {
    if (!incomingCall || !user) return;

    const callInfo = incomingCall;
    setIncomingCall(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callInfo.callType === 'VIDEO',
      });
      setLocalStream(stream);

      const pc = initPeerConnection(callInfo.senderId);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      setActiveCall({
        partnerId: callInfo.senderId,
        partnerName: callInfo.senderName || 'VibeMatch Friend',
        partnerAvatar: callInfo.senderAvatar,
        callType: callInfo.callType,
        isInitiator: false,
      });

      sendWsPayload('/app/call.signal', {
        type: 'CALL_ACCEPT',
        senderId: user.id,
        receiverId: callInfo.senderId,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Could not access media stream to accept call:', err);
    }
  };

  // Decline Call
  const declineCall = () => {
    if (incomingCall && user) {
      sendWsPayload('/app/call.signal', {
        type: 'CALL_DECLINE',
        senderId: user.id,
        receiverId: incomingCall.senderId,
        timestamp: Date.now(),
      });
    }
    setIncomingCall(null);
  };

  // End Call
  const endCall = () => {
    if (activeCall && user) {
      sendWsPayload('/app/call.signal', {
        type: 'CALL_END',
        senderId: user.id,
        receiverId: activeCall.partnerId,
        timestamp: Date.now(),
      });
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setRemoteStream(null);
    setActiveCall(null);
    setIncomingCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!peerConnectionRef.current || !activeCall) return;

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        screenTrack.onended = () => {
          if (localStream) {
            const originalVideo = localStream.getVideoTracks()[0];
            if (sender && originalVideo) sender.replaceTrack(originalVideo);
          }
          setIsScreenSharing(false);
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error starting screen share:', err);
      }
    } else {
      if (localStream) {
        const originalVideo = localStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
        if (sender && originalVideo) {
          sender.replaceTrack(originalVideo);
        }
      }
      setIsScreenSharing(false);
    }
  };

  const sendTyping = (receiverId: number, isTyping: boolean) => {
    if (!user) return;
    sendWsPayload('/app/chat.typing', {
      senderId: user.id,
      receiverId,
      isTyping,
    });
  };

  const subscribeToMessages = (handler: (msg: ChatMessage) => void) => {
    messageSubscribers.current.add(handler);
    return () => {
      messageSubscribers.current.delete(handler);
    };
  };

  const subscribeToReactions = (handler: (reaction: Reaction) => void) => {
    reactionSubscribers.current.add(handler);
    return () => {
      reactionSubscribers.current.delete(handler);
    };
  };

  const subscribeToTyping = (handler: (typing: { senderId: number; isTyping: boolean }) => void) => {
    typingSubscribers.current.add(handler);
    return () => {
      typingSubscribers.current.delete(handler);
    };
  };

  const subscribeToNotifications = (handler: (notif: Notification) => void) => {
    notificationSubscribers.current.add(handler);
    return () => {
      notificationSubscribers.current.delete(handler);
    };
  };

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        incomingCall,
        activeCall,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        isScreenSharing,
        startCall,
        acceptCall,
        declineCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
        sendTyping,
        subscribeToMessages,
        subscribeToReactions,
        subscribeToTyping,
        subscribeToNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
