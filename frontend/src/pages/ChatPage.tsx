import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Friend, ChatMessage } from '../types';
import { api } from '../services/api';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  Phone, 
  Video, 
  MoreVertical, 
  Smile, 
  Sparkles, 
  Check, 
  CheckCheck, 
  Play, 
  Pause, 
  Radio, 
  Search,
  ShieldCheck,
  Flag,
  Ban,
  X
} from 'lucide-react';

interface ChatPageProps {
  initialChatUserId?: number | null;
  onOpenProfile: (userId: number) => void;
  onOpenReport: (userId: number) => void;
}

const REACTION_EMOJIS = ['💜', '🔥', '✨', '👏', '😂', '🚀'];

export const ChatPage: React.FC<ChatPageProps> = ({ 
  initialChatUserId, 
  onOpenProfile, 
  onOpenReport 
}) => {
  const { user } = useAuth();
  const { 
    startCall, 
    sendTyping, 
    subscribeToMessages, 
    subscribeToReactions, 
    subscribeToTyping 
  } = useSocket();

  const [conversations, setConversations] = useState<Friend[]>([]);
  const [activePartner, setActivePartner] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<number | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Load conversations list
  useEffect(() => {
    async function fetchConversations() {
      try {
        const convs = await api.getConversations();
        setConversations(convs);

        if (initialChatUserId) {
          const matched = convs.find(c => c.friend.id === initialChatUserId);
          if (matched) {
            setActivePartner(matched);
          } else {
            // Load user profile directly to start chat
            const partnerUser = await api.getUser(initialChatUserId);
            const tempFriend: Friend = {
              friendshipId: 0,
              friend: partnerUser,
              since: new Date().toISOString(),
              unreadCount: 0,
            };
            setActivePartner(tempFriend);
          }
        } else if (convs.length > 0 && !activePartner) {
          setActivePartner(convs[0]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    }
    fetchConversations();
  }, [initialChatUserId]);

  // Load messages when active partner changes
  useEffect(() => {
    if (!activePartner) return;

    setLoadingMessages(true);
    api.getMessages(activePartner.friend.id)
      .then(msgs => {
        setMessages(msgs);
        // Clear unread badge in list
        setConversations(prev => prev.map(c => 
          c.friend.id === activePartner.friend.id ? { ...c, unreadCount: 0 } : c
        ));
      })
      .catch(console.error)
      .finally(() => setLoadingMessages(false));

    // Load AI icebreakers
    api.getIcebreakers(activePartner.friend.id)
      .then(setIcebreakers)
      .catch(() => {});
  }, [activePartner]);

  // Subscribe to real-time events
  useEffect(() => {
    const unsubMsg = subscribeToMessages((newMsg) => {
      if (activePartner && (newMsg.senderId === activePartner.friend.id || newMsg.receiverId === activePartner.friend.id)) {
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        if (newMsg.senderId === activePartner.friend.id) {
          api.markAsRead(activePartner.friend.id).catch(() => {});
        }
      }

      // Update conversations list preview
      setConversations(prev => prev.map(c => {
        const partnerId = newMsg.senderId === user?.id ? newMsg.receiverId : newMsg.senderId;
        if (c.friend.id === partnerId) {
          return {
            ...c,
            lastMessage: newMsg.messageType === 'TEXT' ? newMsg.content : `[${newMsg.messageType}]`,
            lastMessageTime: newMsg.createdAt,
            unreadCount: (activePartner && activePartner.friend.id === partnerId) ? 0 : c.unreadCount + 1,
          };
        }
        return c;
      }));
    });

    const unsubReaction = subscribeToReactions((reaction) => {
      setMessages(prev => prev.map(m => {
        if (m.id === reaction.messageId) {
          const filtered = m.reactions.filter(r => r.userId !== reaction.userId);
          return { ...m, reactions: [...filtered, reaction] };
        }
        return m;
      }));
    });

    const unsubTyping = subscribeToTyping((typing) => {
      if (activePartner && typing.senderId === activePartner.friend.id) {
        setIsPartnerTyping(typing.isTyping);
      }
    });

    return () => {
      unsubMsg();
      unsubReaction();
      unsubTyping();
    };
  }, [activePartner, user, subscribeToMessages, subscribeToReactions, subscribeToTyping]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  // Handle typing notification
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!activePartner) return;

    sendTyping(activePartner.friend.id, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (activePartner) sendTyping(activePartner.friend.id, false);
    }, 2000);
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activePartner) return;

    const content = inputText.trim();
    setInputText('');

    try {
      const sent = await api.sendMessage(activePartner.friend.id, content, 'TEXT');
      setMessages(prev => {
        if (prev.some(m => m.id === sent.id)) return prev;
        return [...prev, sent];
      });
    } catch (err: any) {
      alert(err.message || 'Could not send message');
    }
  };

  // Add Emoji reaction
  const handleAddReaction = async (messageId: number, emoji: string) => {
    try {
      const rx = await api.addReaction(messageId, emoji);
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          const filtered = m.reactions.filter(r => r.userId !== rx.userId);
          return { ...m, reactions: [...filtered, rx] };
        }
        return m;
      }));
    } catch (_) {}
  };

  // Media file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePartner) return;

    try {
      const uploaded = await api.uploadMedia(file);
      const isImg = file.type.startsWith('image/');
      const sent = await api.sendMessage(
        activePartner.friend.id,
        file.name,
        isImg ? 'IMAGE' : 'VIDEO',
        uploaded.url,
        uploaded.meta
      );
      setMessages(prev => [...prev, sent]);
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    }
  };

  // Simulated Voice Note recording
  const handleToggleVoiceRecord = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
    } else {
      setIsRecordingVoice(false);
      if (!activePartner) return;

      const durationStr = `0:${recordingSeconds.toString().padStart(2, '0')}`;
      api.sendMessage(
        activePartner.friend.id,
        "Audio Voice Note",
        'VOICE',
        "https://actions.google.com/sounds/v1/science_fiction/alien_hum.ogg",
        durationStr
      ).then(sent => {
        setMessages(prev => [...prev, sent]);
      }).catch(console.error);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  // Voice note play/pause toggle
  const togglePlayVoice = (id: number) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      setTimeout(() => setPlayingVoiceId(null), 5000);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.friend.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 h-[calc(100vh-80px)] flex gap-4">
      
      {/* Left Column: Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 glass-panel rounded-3xl border border-white/10 flex flex-col overflow-hidden ${activePartner ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header & Search */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Direct Frequencies</h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
              {conversations.length} Active
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs text-white placeholder:text-slate-500"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations found. Connect with friends to begin chatting!
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = activePartner?.friend.id === c.friend.id;
              return (
                <div
                  key={c.friend.id}
                  onClick={() => setActivePartner(c)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected ? 'bg-purple-600/20 border-l-4 border-purple-500' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={c.friend.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={c.friend.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-purple-500/30"
                    />
                    {c.friend.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0d0f1d] animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1">
                        {c.friend.fullName}
                        {c.friend.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                      </h4>
                      {c.lastMessageTime && (
                        <span className="text-[10px] text-slate-500">
                          {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-400 truncate">
                        {c.lastMessage || c.friend.vibeArchetype || "Connected"}
                      </p>
                      {c.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-[10px] font-bold shadow-glow-purple">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Right Column: Active Chat Stream */}
      {activePartner ? (
        <div className="flex-1 glass-panel rounded-3xl border border-white/10 flex flex-col overflow-hidden">
          
          {/* Active Partner Top Bar */}
          <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-[#101222]/90">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActivePartner(null)}
                className="md:hidden p-1.5 rounded-xl glass-card text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>

              <div 
                onClick={() => onOpenProfile(activePartner.friend.id)}
                className="relative cursor-pointer group"
              >
                <img
                  src={activePartner.friend.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt={activePartner.friend.fullName}
                  className="w-10 h-10 rounded-2xl object-cover border border-purple-500/40 group-hover:scale-105 transition-transform"
                />
                {activePartner.friend.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0d0f1d]" />
                )}
              </div>

              <div>
                <h3 
                  onClick={() => onOpenProfile(activePartner.friend.id)}
                  className="text-sm font-bold text-white hover:text-cyan-300 cursor-pointer flex items-center gap-1.5"
                >
                  {activePartner.friend.fullName}
                  {activePartner.friend.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                </h3>
                <p className="text-[11px] text-purple-400 font-semibold flex items-center gap-1">
                  <Radio className="w-3 h-3" />
                  {activePartner.friend.vibeArchetype || 'Cosmic Explorer'}
                  {isPartnerTyping && (
                    <span className="text-cyan-300 font-normal animate-pulse ml-2">typing...</span>
                  )}
                </p>
              </div>
            </div>

            {/* Calling & Menu Shortcuts */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => startCall(activePartner.friend.id, activePartner.friend.fullName, activePartner.friend.avatarUrl, 'AUDIO')}
                className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                title="Start Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => startCall(activePartner.friend.id, activePartner.friend.fullName, activePartner.friend.avatarUrl, 'VIDEO')}
                className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-purple-300 hover:border-purple-500/40 transition-colors"
                title="Start Video Call"
              >
                <Video className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 glass-panel rounded-2xl shadow-2xl p-1.5 border border-white/10 z-30 space-y-1">
                    <button
                      onClick={() => {
                        onOpenProfile(activePartner.friend.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-200 hover:bg-white/10 rounded-xl"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        onOpenReport(activePartner.friend.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-300 hover:bg-rose-500/10 rounded-xl flex items-center gap-1.5"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      Report User
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#090a12] to-[#0c0e1a]">
            {loadingMessages ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Direct Channel Established</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Break the silence! Tap an icebreaker suggestion below or say hello to harmonize frequencies.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                  >
                    <div className="relative max-w-sm sm:max-w-md">
                      
                      {/* Bubble */}
                      <div
                        className={`p-3.5 rounded-3xl ${
                          isMe
                            ? 'bg-gradient-to-r from-purple-700/85 to-indigo-700/85 text-white border border-purple-500/30 rounded-br-none shadow-glow-purple'
                            : 'glass-card text-slate-100 rounded-bl-none border border-white/10'
                        }`}
                      >
                        {/* Message Type: TEXT */}
                        {msg.messageType === 'TEXT' && (
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        )}

                        {/* Message Type: IMAGE */}
                        {msg.messageType === 'IMAGE' && (
                          <div className="space-y-1">
                            <img
                              src={msg.mediaUrl || msg.content}
                              alt="Media Attachment"
                              className="rounded-2xl max-h-60 w-full object-cover border border-white/10"
                            />
                            {msg.mediaMeta && <span className="text-[10px] text-slate-300 block">{msg.mediaMeta}</span>}
                          </div>
                        )}

                        {/* Message Type: VOICE NOTE */}
                        {msg.messageType === 'VOICE' && (
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <button
                              onClick={() => togglePlayVoice(msg.id)}
                              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95"
                            >
                              {playingVoiceId === msg.id ? (
                                <Pause className="w-4 h-4 fill-white" />
                              ) : (
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                              )}
                            </button>

                            {/* Equalizer waves */}
                            <div className="flex-1 flex items-center gap-1 h-6">
                              {[8, 16, 24, 12, 20, 14, 22, 10, 18, 12, 16, 8].map((h, i) => (
                                <span
                                  key={i}
                                  style={{ height: `${h}px` }}
                                  className={`w-1 rounded-full ${playingVoiceId === msg.id ? 'bg-cyan-300 animate-pulse' : 'bg-white/40'}`}
                                />
                              ))}
                            </div>

                            <span className="text-[11px] font-mono text-slate-300 shrink-0">
                              {msg.mediaMeta || '0:15'}
                            </span>
                          </div>
                        )}

                        {/* Timestamp & Read Double Ticks */}
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-300/80">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            msg.isRead ? (
                              <CheckCheck className="w-3.5 h-3.5 text-cyan-300 font-bold" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-slate-400" />
                            )
                          )}
                        </div>
                      </div>

                      {/* Emoji Reactions List on Bubble */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 -mb-1">
                          {msg.reactions.map((rx) => (
                            <span
                              key={rx.id}
                              className="px-1.5 py-0.5 rounded-full bg-black/60 border border-purple-500/30 text-xs backdrop-blur-md"
                            >
                              {rx.emoji}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quick Emoji Reaction Hover Trigger */}
                      <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-full border border-white/10 z-10 -right-24">
                        {REACTION_EMOJIS.slice(0, 3).map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(msg.id, emoji)}
                            className="hover:scale-125 transition-transform text-xs p-1"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Expandable AI Icebreakers Tray */}
          {icebreakers.length > 0 && (
            <div className="px-4 py-2 border-t border-white/5 bg-[#0e101f]">
              <div className="flex items-center justify-between mb-1.5">
                <button
                  onClick={() => setShowIcebreakers(!showIcebreakers)}
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>AI Icebreaker Prompts ({icebreakers.length})</span>
                </button>
              </div>

              {showIcebreakers && (
                <div className="flex flex-wrap gap-2 pt-1 pb-2">
                  {icebreakers.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => setInputText(starter)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-200 border border-cyan-500/20 text-xs text-left transition-colors"
                    >
                      "{starter}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-white/10 glass-panel bg-[#101222]">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              
              {/* Media file attachment */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-cyan-300 transition-colors"
                title="Attach Image / Media"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder={`Message ${activePartner.friend.fullName}...`}
                className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder:text-slate-500"
              />

              {/* Voice Note Button */}
              <button
                type="button"
                onClick={handleToggleVoiceRecord}
                className={`p-2.5 rounded-xl glass-card transition-all ${
                  isRecordingVoice
                    ? 'bg-rose-500/30 text-rose-400 border-rose-500 animate-pulse'
                    : 'text-slate-400 hover:text-purple-300'
                }`}
                title={isRecordingVoice ? "Stop & Send Voice Note" : "Record Voice Note"}
              >
                {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-glow-purple hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {isRecordingVoice && (
              <p className="text-[11px] text-rose-400 font-semibold mt-2 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Recording voice note: 0:{recordingSeconds.toString().padStart(2, '0')} (tap mic to send)
              </p>
            )}
          </div>

        </div>
      ) : (
        /* Empty Right Column when no conversation selected */
        <div className="flex-1 glass-panel rounded-3xl border border-white/10 hidden md:flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shadow-glow-purple">
            <Radio className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Select a Vibe to Chat</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Choose a friend from the left list or jump over to Discover to start fresh conversations.
          </p>
        </div>
      )}

    </div>
  );
};
