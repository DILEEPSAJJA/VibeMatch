export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  gender?: string;
  age?: number;
  vibeArchetype?: string;
  isOnline?: boolean;
  lastSeen?: string;
  isVerified?: boolean;
  isBanned?: boolean;
  role?: string;
  interests?: string[];
  hobbies?: string[];
  languages?: string[];
  createdAt?: string;
}

export interface UserPreferences {
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  ghostMode: boolean;
  showReadReceipts: boolean;
  showActiveStatus: boolean;
  profileVisibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
}

export interface MatchProfile {
  user: User;
  matchPercentage: number;
  sharedInterests: string[];
  sharedHobbies: string[];
  sharedLanguages: string[];
  scoreBreakdown: {
    interests: number;
    vibe: number;
    hobbies: number;
    languages: number;
  };
  compatibilityVerdict: string;
  icebreakers: string[];
  friendshipStatus: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'FRIENDS' | 'BLOCKED';
  requestId?: number;
}

export interface FriendRequest {
  id: number;
  sender: User;
  receiver: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt: string;
}

export interface Friend {
  friendshipId: number;
  friend: User;
  since: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface Reaction {
  id: number;
  messageId: number;
  userId: number;
  emoji: string;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'VOICE' | 'VIDEO';
  mediaUrl?: string;
  mediaMeta?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  reactions: Reaction[];
}

export interface Community {
  id: number;
  name: string;
  description: string;
  icon: string;
  banner?: string;
  category: string;
  memberCount: number;
  isMember: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id: number;
  communityId: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  actorId?: number;
  actorName?: string;
  actorAvatar?: string;
  type: 'FRIEND_REQUEST' | 'REQUEST_ACCEPTED' | 'CHAT_MESSAGE' | 'CALL_MISSED' | 'VIBE_MATCH' | 'COMMUNITY_INVITE';
  title: string;
  message: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminMetrics {
  totalUsers: number;
  activeUsersOnline: number;
  totalMatchesMade: number;
  totalMessagesExchanged: number;
  pendingReportsCount: number;
  totalCommunities: number;
}

export interface ReportItem {
  id: number;
  reporter: User;
  reported: User;
  reason: string;
  details: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface WebRtcSignal {
  type: 'OFFER' | 'ANSWER' | 'ICE_CANDIDATE' | 'CALL_REQUEST' | 'CALL_ACCEPT' | 'CALL_DECLINE' | 'CALL_END';
  senderId: number;
  receiverId: number;
  senderName?: string;
  senderAvatar?: string;
  callType: 'AUDIO' | 'VIDEO';
  payload?: any;
  timestamp: number;
}
