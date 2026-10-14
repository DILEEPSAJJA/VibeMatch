import React, { useState } from 'react';
import { api } from '../services/api';
import { X, ShieldAlert, Flag } from 'lucide-react';

interface ReportModalProps {
  userId: number;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ userId, onClose }) => {
  const [reason, setReason] = useState('Harassment or Bullying');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.reportUser(userId, reason, details);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-card text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Report Received</h3>
            <p className="text-xs text-slate-300">
              Our moderation team will review this user profile according to VibeMatch Trust & Safety guidelines.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Report User Profile</h3>
                <p className="text-xs text-slate-400">Help keep the VibeMatch frequency safe</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Violation Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-100"
              >
                <option value="Harassment or Bullying" className="bg-[#121422] text-white">Harassment or Bullying</option>
                <option value="Inappropriate / NSFW Media" className="bg-[#121422] text-white">Inappropriate / NSFW Media</option>
                <option value="Spam or Commercial Bot" className="bg-[#121422] text-white">Spam or Commercial Bot</option>
                <option value="Impersonation / Fake Account" className="bg-[#121422] text-white">Impersonation / Fake Account</option>
                <option value="Hate Speech or Threats" className="bg-[#121422] text-white">Hate Speech or Threats</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe what occurred or paste relevant messages..."
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl glass-card text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
