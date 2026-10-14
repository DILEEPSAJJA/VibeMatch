import { 
  User, 
  UserPreferences, 
  MatchProfile, 
  FriendRequest, 
  Friend, 
  ChatMessage, 
  Reaction, 
  Community, 
  CommunityPost, 
  Notification, 
  AdminMetrics, 
  ReportItem 
} from '../types';
function getApiBase(): string {
  if (typeof window !== 'undefined') {
    if ((import.meta as any).env?.VITE_API_BASE) {
      return (import.meta as any).env.VITE_API_BASE;
    }
    // If running in Docker nginx reverse proxy on port 3000
    if (window.location.port === '3000') {
      return '/api';
    }
    // If running inside IntelliJ preview (63342), Vite dev (5173), Spring Boot static (8080), or file://
    const host = window.location.hostname || 'localhost';
    return `http://${host}:8080/api`;
  }
  return '/api';
}

const API_BASE = getApiBase();

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let errMsg = `Request failed: ${res.status}`;
    try {
      const json = await res.json();
      if (json.message) errMsg = json.message;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return res.json();
}

export const api = {
  // Auth
  async login(usernameOrEmail: string, password: string):Promise<{ token: string; user: User }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    });
  },

  async register(data: any): Promise<{ token: string; user: User }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<User> {
    return request('/auth/me');
  },

  async getDemoAccounts(): Promise<Array<{ username: string; password: string; role: string; name: string }>> {
    return request('/auth/demo-accounts');
  },

  // Users
  async getUser(id: number): Promise<User> {
    return request(`/users/${id}`);
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getPreferences(): Promise<UserPreferences> {
    return request('/users/preferences');
  },

  async updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
    return request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async setOnlineStatus(isOnline: boolean): Promise<void> {
    return request('/users/status', {
      method: 'POST',
      body: JSON.stringify({ isOnline }),
    });
  },

  // Matches
  async discover(filter?: any): Promise<MatchProfile[]> {
    return request('/matches/discover', {
      method: 'POST',
      body: JSON.stringify(filter || {}),
    });
  },

  async getCompatibility(targetUserId: number): Promise<MatchProfile> {
    return request(`/matches/${targetUserId}/compatibility`);
  },

  // Social
  async getFriends(): Promise<Friend[]> {
    return request('/social/friends');
  },

  async getIncomingRequests(): Promise<FriendRequest[]> {
    return request('/social/requests/incoming');
  },

  async getOutgoingRequests(): Promise<FriendRequest[]> {
    return request('/social/requests/outgoing');
  },

  async sendFriendRequest(receiverId: number): Promise<FriendRequest> {
    return request(`/social/requests/send/${receiverId}`, {
      method: 'POST',
    });
  },

  async acceptRequest(requestId: number): Promise<FriendRequest> {
    return request(`/social/requests/${requestId}/accept`, {
      method: 'POST',
    });
  },

  async rejectRequest(requestId: number): Promise<FriendRequest> {
    return request(`/social/requests/${requestId}/reject`, {
      method: 'POST',
    });
  },

  async withdrawRequest(requestId: number): Promise<FriendRequest> {
    return request(`/social/requests/${requestId}/withdraw`, {
      method: 'POST',
    });
  },

  async blockUser(targetUserId: number): Promise<void> {
    return request(`/social/block/${targetUserId}`, { method: 'POST' });
  },

  async unblockUser(targetUserId: number): Promise<void> {
    return request(`/social/unblock/${targetUserId}`, { method: 'POST' });
  },

  async getBlockedUsers(): Promise<User[]> {
    return request('/social/blocked');
  },

  async reportUser(reportedUserId: number, reason: string, details: string): Promise<void> {
    return request('/social/report', {
      method: 'POST',
      body: JSON.stringify({ reportedUserId, reason, details }),
    });
  },

  // Chat
  async getConversations(): Promise<Friend[]> {
    return request('/chat/conversations');
  },

  async getMessages(otherUserId: number): Promise<ChatMessage[]> {
    return request(`/chat/messages/${otherUserId}`);
  },

  async sendMessage(receiverId: number, content: string, messageType: string = 'TEXT', mediaUrl?: string, mediaMeta?: string): Promise<ChatMessage> {
    return request('/chat/messages/send', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content, messageType, mediaUrl, mediaMeta }),
    });
  },

  async addReaction(messageId: number, emoji: string): Promise<Reaction> {
    return request('/chat/messages/reaction', {
      method: 'POST',
      body: JSON.stringify({ messageId, emoji }),
    });
  },

  async markAsRead(senderId: number): Promise<void> {
    return request(`/chat/messages/read/${senderId}`, { method: 'POST' });
  },

  async getIcebreakers(targetUserId: number): Promise<string[]> {
    return request(`/chat/icebreakers/${targetUserId}`);
  },

  async uploadMedia(file: File): Promise<{ url: string; contentType: string; meta: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/chat/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload media');
    return res.json();
  },

  // Communities
  async getCommunities(): Promise<Community[]> {
    return request('/communities');
  },

  async getCommunity(id: number): Promise<Community> {
    return request(`/communities/${id}`);
  },

  async joinCommunity(id: number): Promise<Community> {
    return request(`/communities/${id}/join`, { method: 'POST' });
  },

  async leaveCommunity(id: number): Promise<Community> {
    return request(`/communities/${id}/leave`, { method: 'POST' });
  },

  async getCommunityPosts(id: number): Promise<CommunityPost[]> {
    return request(`/communities/${id}/posts`);
  },

  async createCommunityPost(id: number, content: string): Promise<CommunityPost> {
    return request(`/communities/${id}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return request('/notifications');
  },

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    return request('/notifications/unread-count');
  },

  async markNotificationsRead(): Promise<void> {
    return request('/notifications/read-all', { method: 'POST' });
  },

  // Admin
  async getAdminMetrics(): Promise<AdminMetrics> {
    return request('/admin/metrics');
  },

  async getAdminUsers(): Promise<User[]> {
    return request('/admin/users');
  },

  async toggleVerify(userId: number): Promise<User> {
    return request(`/admin/users/${userId}/toggle-verify`, { method: 'POST' });
  },

  async toggleBan(userId: number): Promise<User> {
    return request(`/admin/users/${userId}/toggle-ban`, { method: 'POST' });
  },

  async getAdminReports(): Promise<ReportItem[]> {
    return request('/admin/reports');
  },

  async resolveReport(reportId: number, status: string): Promise<ReportItem> {
    return request(`/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },
};
