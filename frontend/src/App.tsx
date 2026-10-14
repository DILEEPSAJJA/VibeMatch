import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { IncomingCallModal } from './components/IncomingCallModal';
import { VideoCallModal } from './components/VideoCallModal';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { ReportModal } from './components/ReportModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { FriendsPage } from './pages/FriendsPage';
import { ChatPage } from './pages/ChatPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SettingsPage } from './pages/SettingsPage';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('discover');
  
  // Modals state
  const [inspectUserId, setInspectUserId] = useState<number | null>(null);
  const [reportUserId, setReportUserId] = useState<number | null>(null);
  const [chatDirectUserId, setChatDirectUserId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080911] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Unauthenticated Flow
  if (!user) {
    if (authView === 'login') {
      return (
        <LoginPage 
          onSwitchToRegister={() => setAuthView('register')}
          onBackToLanding={() => setAuthView('landing')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterPage 
          onSwitchToLogin={() => setAuthView('login')}
          onBackToLanding={() => setAuthView('landing')}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => setAuthView('register')}
        onSignIn={() => setAuthView('login')}
      />
    );
  }

  // Handlers for switching views from modals
  const handleOpenChat = (userId: number) => {
    setChatDirectUserId(userId);
    setCurrentTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#080911] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        onOpenProfileModal={(uid) => setInspectUserId(uid)}
      />

      {/* Main Page Area */}
      <main className="flex-1 pb-16 md:pb-6">
        {currentTab === 'discover' && (
          <DiscoveryPage 
            onOpenProfile={(uid) => setInspectUserId(uid)}
            onOpenChat={handleOpenChat}
          />
        )}

        {currentTab === 'friends' && (
          <FriendsPage 
            onOpenChat={handleOpenChat}
            onOpenProfile={(uid) => setInspectUserId(uid)}
          />
        )}

        {currentTab === 'chat' && (
          <ChatPage 
            initialChatUserId={chatDirectUserId}
            onOpenProfile={(uid) => setInspectUserId(uid)}
            onOpenReport={(uid) => setReportUserId(uid)}
          />
        )}

        {currentTab === 'communities' && (
          <CommunitiesPage />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}

        {currentTab === 'settings' && (
          <SettingsPage />
        )}
      </main>

      {/* Global Modals */}
      <IncomingCallModal />
      <VideoCallModal />

      {inspectUserId !== null && (
        <ProfileDetailModal
          userId={inspectUserId}
          onClose={() => setInspectUserId(null)}
          onOpenChat={handleOpenChat}
          onOpenReport={(uid) => setReportUserId(uid)}
        />
      )}

      {reportUserId !== null && (
        <ReportModal
          userId={reportUserId}
          onClose={() => setReportUserId(null)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
