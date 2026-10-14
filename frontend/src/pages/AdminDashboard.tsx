import React, { useState, useEffect } from 'react';
import { AdminMetrics, ReportItem, User } from '../types';
import { api } from '../services/api';
import { 
  ShieldAlert, 
  Users, 
  MessageSquare, 
  Heart, 
  Radio, 
  CheckCircle, 
  Ban, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [m, u, r] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminUsers(),
        api.getAdminReports(),
      ]);
      setMetrics(m);
      setUsers(u);
      setReports(r);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleVerify = async (userId: number) => {
    try {
      const updated = await api.toggleVerify(userId);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBan = async (userId: number) => {
    try {
      const updated = await api.toggleBan(userId);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (reportId: number, status: string) => {
    try {
      const resolved = await api.resolveReport(reportId, status);
      setReports(prev => prev.map(r => r.id === reportId ? resolved : r));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-pink-400" />
            <span>Admin Moderation & Analytics Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            System overview, user trust & safety verification, and flagged reports
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="p-2.5 rounded-2xl glass-card text-slate-300 hover:text-cyan-300 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.totalUsers || 0}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Online Now</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{metrics?.activeUsersOnline || 0}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Matches Made</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-2xl font-black text-pink-400">{metrics?.totalMatchesMade || 0}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Messages</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400">{metrics?.totalMessagesExchanged || 0}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Communities</span>
            <Radio className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-indigo-300">{metrics?.totalCommunities || 0}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-rose-500/30 space-y-1 bg-rose-950/20">
          <div className="flex items-center justify-between text-rose-300 text-xs font-semibold">
            <span>Pending Reports</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400">{metrics?.pendingReportsCount || 0}</p>
        </div>
      </div>

      {/* Reported Users Moderation Table */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          Flagged Reports Queue
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-4 font-bold">Reporter</th>
                <th className="py-3 px-4 font-bold">Reported User</th>
                <th className="py-3 px-4 font-bold">Reason</th>
                <th className="py-3 px-4 font-bold">Details</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No open reports. All user conduct is aligned with guidelines!
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-slate-300">
                      @{report.reporter.username}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      @{report.reported.username}
                    </td>
                    <td className="py-3 px-4 text-rose-300 font-semibold">
                      {report.reason}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                      {report.details}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        report.status === 'PENDING'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {report.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleResolveReport(report.id, 'RESOLVED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 font-bold"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleResolveReport(report.id, 'DISMISSED')}
                            className="px-2.5 py-1 rounded-lg glass-card text-slate-400 hover:text-white"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Directory Management Table */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          User Directory & Verification Controls
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-4 font-bold">User</th>
                <th className="py-3 px-4 font-bold">Vibe Archetype</th>
                <th className="py-3 px-4 font-bold">Location</th>
                <th className="py-3 px-4 font-bold">Role</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Moderator Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={u.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-purple-500/30"
                    />
                    <div>
                      <span className="font-bold text-white block">{u.fullName}</span>
                      <span className="text-[10px] text-slate-400">@{u.username}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-purple-300 font-semibold">
                    {u.vibeArchetype || 'Cosmic Explorer'}
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {u.location || 'Cyberspace'}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px]">
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {u.isBanned ? (
                      <span className="text-rose-400 font-bold">Banned</span>
                    ) : u.isOnline ? (
                      <span className="text-emerald-400 font-bold">Online</span>
                    ) : (
                      <span className="text-slate-500">Offline</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleVerify(u.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        u.isVerified
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'glass-card text-slate-400 hover:text-white'
                      }`}
                    >
                      {u.isVerified ? 'Verified ✓' : 'Verify'}
                    </button>

                    <button
                      onClick={() => handleToggleBan(u.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        u.isBanned
                          ? 'bg-emerald-600/30 text-emerald-300'
                          : 'bg-rose-600/30 text-rose-300 hover:bg-rose-600/50'
                      }`}
                    >
                      {u.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
