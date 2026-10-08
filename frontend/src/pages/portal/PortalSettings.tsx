import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Eye, EyeOff, Save, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function PortalSettings() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    applicationStatus: true,
    documentReady: true,
    newResources: false,
    queryReplies: true,
  });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPw !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPw.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Password changed successfully!');
    setPasswords({ current: '', newPw: '', confirm: '' });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="heading-sm text-brand-dark flex items-center gap-2">
          <Settings size={22} className="text-brand-blue" /> Account Settings
        </h1>
        <p className="text-sm text-brand-slate mt-1">Manage your notification preferences and account security.</p>
      </div>

      {/* Notification Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-5">
          <Bell size={18} className="text-brand-blue" /> Notification Preferences
        </h2>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, val]) => {
            const labels: Record<string, { title: string; desc: string }> = {
              emailUpdates: { title: 'Email Updates', desc: 'General updates and announcements from STATS INNOTECH' },
              applicationStatus: { title: 'Application Status', desc: 'Get notified when your internship application status changes' },
              documentReady: { title: 'Document Ready', desc: 'Alert when offer letters or certificates are available' },
              newResources: { title: 'New Resources', desc: 'Notify when new study material is uploaded for your programs' },
              queryReplies: { title: 'Query Replies', desc: 'Email alert when support replies to your queries' },
            };
            const { title, desc } = labels[key] || { title: key, desc: '' };
            return (
              <div key={key} className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-brand-dark">{title}</p>
                  <p className="text-xs text-brand-slate/60 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !val }))}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${val ? 'bg-brand-blue' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${val ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => toast.success('Notification preferences saved!')}
          className="btn-primary btn-sm mt-5 flex items-center gap-1.5"
        >
          <Save size={14} /> Save Preferences
        </button>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-5">
          <Shield size={18} className="text-brand-blue" /> Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { key: 'current', label: 'Current Password', placeholder: '••••••••' },
            { key: 'newPw', label: 'New Password', placeholder: 'Min 8 characters' },
            { key: 'confirm', label: 'Confirm New Password', placeholder: 'Re-enter new password' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={placeholder}
                  value={passwords[key as keyof typeof passwords]}
                  onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                  className="form-input pr-10"
                />
                {key === 'current' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit" className="btn-primary btn-sm">
            <Shield size={14} /> Update Password
          </button>
        </form>
      </motion.div>

      {/* Account Email */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h2 className="font-bold text-brand-dark mb-3">Account Email</h2>
        <p className="text-sm text-brand-slate/70 mb-4">Your email is used for login and communications.</p>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
            <span className="text-brand-blue font-bold text-sm">{user?.email?.[0]?.toUpperCase()}</span>
          </div>
          <p className="text-sm font-semibold text-brand-dark">{user?.email}</p>
          <span className="badge-green text-xs ml-auto">Verified</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">To change your email, contact support at info@statsinnotech.com</p>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 border border-red-100">
        <h2 className="font-bold text-red-600 flex items-center gap-2 mb-3">
          <AlertTriangle size={18} /> Danger Zone
        </h2>
        <p className="text-sm text-brand-slate/70 mb-4">
          Deleting your account is permanent and cannot be undone. All data including enrollments, certificates, and documents will be lost.
        </p>
        <button className="btn btn-sm border border-red-300 text-red-500 hover:bg-red-50 transition-colors">
          Request Account Deletion
        </button>
      </motion.div>
    </div>
  );
}
