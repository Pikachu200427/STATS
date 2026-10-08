import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, AlertCircle, Info, CheckCircle, Trash2, X } from 'lucide-react';

type NotifType = 'SUCCESS' | 'INFO' | 'WARNING';

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFS: Notification[] = [
  { id: 1, type: 'SUCCESS', title: 'Application Approved!', message: 'Your Web Development Internship application has been approved. Check your offer letter.', time: '2 hours ago', read: false },
  { id: 2, type: 'INFO', title: 'Offer Letter Ready', message: 'Your CSE internship offer letter is now available for download in the Offer Letters section.', time: '1 day ago', read: false },
  { id: 3, type: 'INFO', title: 'New Resource Uploaded', message: 'New study material has been uploaded for Web Development Internship batch.', time: '3 days ago', read: true },
  { id: 4, type: 'WARNING', title: 'Complete Your Profile', message: 'Please complete your profile with college and branch details for accurate document generation.', time: '5 days ago', read: true },
  { id: 5, type: 'SUCCESS', title: 'Account Verified', message: 'Your STATS INNOTECH account has been successfully verified.', time: '1 week ago', read: true },
];

const TYPE_STYLES: Record<NotifType, { icon: typeof CheckCircle; bg: string; border: string; iconColor: string }> = {
  SUCCESS: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-100', iconColor: 'text-green-500' },
  INFO: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-100', iconColor: 'text-blue-500' },
  WARNING: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-amber-100', iconColor: 'text-amber-500' },
};

export default function PortalNotifications() {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const unreadCount = notifs.filter((n) => !n.read).length;
  const visible = filter === 'UNREAD' ? notifs.filter((n) => !n.read) : notifs;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifs((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: number) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="heading-sm text-brand-dark flex items-center gap-2">
            <Bell size={22} className="text-brand-blue" /> Notifications
            {unreadCount > 0 && (
              <span className="ml-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-brand-slate mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost btn-sm flex items-center gap-1.5 text-brand-blue">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['ALL', 'UNREAD'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-brand-blue text-white' : 'bg-gray-100 text-brand-slate hover:bg-gray-200'
              }`}
          >
            {f === 'ALL' ? `All (${notifs.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {visible.length > 0 ? (
          visible.map((notif) => {
            const { icon: Icon, bg, border, iconColor } = TYPE_STYLES[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`card p-4 border ${border} ${!notif.read ? bg : ''} ${notif.read ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${notif.read ? 'bg-gray-100' : bg}`}>
                    <Icon size={18} className={iconColor} />
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => markRead(notif.id)} style={{ cursor: 'pointer' }}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${notif.read ? 'text-brand-slate' : 'text-brand-dark'}`}>
                        {notif.title}
                        {!notif.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-brand-blue" />}
                      </p>
                      <span className="text-xs text-gray-400 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-brand-slate/70 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                  <button
                    onClick={() => dismiss(notif.id)}
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors"
                  >
                    <X size={13} className="text-gray-400" />
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-brand-dark mb-2">No notifications</h3>
            <p className="text-sm text-brand-slate/70">
              {filter === 'UNREAD' ? 'All caught up! No unread notifications.' : 'You have no notifications yet.'}
            </p>
          </div>
        )}
      </div>

      {visible.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setNotifs([])}
            className="btn-ghost btn-sm text-red-500 flex items-center gap-1.5 hover:bg-red-50"
          >
            <Trash2 size={14} /> Clear All Notifications
          </button>
        </div>
      )}
    </div>
  );
}
