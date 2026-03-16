import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Save, Package, Calendar,
  ShoppingBag, Award, Eye, EyeOff, Check,
  AlertCircle, ChevronRight, Wifi, WifiOff
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import toast from 'react-hot-toast';

// ── Mock order history ────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 'TG-A8F2C1', date: '2026-02-14', product: 'TermoGuard Core',   qty: 1, total: 49.99,  status: 'Delivered' },
  { id: 'TG-B3D7E9', date: '2026-01-28', product: 'TermoGuard Pro',    qty: 2, total: 239.98, status: 'Delivered' },
  { id: 'TG-C5A1F4', date: '2025-12-03', product: 'TermoGuard Mesh',   qty: 1, total: 199.99, status: 'Delivered' },
  { id: 'TG-D9B2G6', date: '2025-10-17', product: 'TermoGuard Core',   qty: 3, total: 149.97, status: 'Delivered' },
];

const STATUS_COLORS = {
  Delivered:  'text-neon-green  bg-neon-green/10  border-neon-green/20',
  Processing: 'text-neon-amber  bg-neon-amber/10  border-neon-amber/20',
  Shipped:    'text-cyan        bg-cyan/10        border-cyan/20',
};

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent = 'cyan' }) {
  const colors = {
    cyan:  'text-cyan  border-cyan/20  bg-cyan/5',
    green: 'text-neon-green border-neon-green/20 bg-neon-green/5',
    amber: 'text-neon-amber border-neon-amber/20 bg-neon-amber/5',
  };
  return (
    <div className={`glass p-5 border ${colors[accent]}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 ${colors[accent]}`}>
          <Icon size={15} className={accent === 'cyan' ? 'text-cyan' : accent === 'green' ? 'text-neon-green' : 'text-neon-amber'} />
        </div>
        <span className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">{label}</span>
      </div>
      <div className={`font-display font-black text-2xl ${accent === 'cyan' ? 'text-cyan' : accent === 'green' ? 'text-neon-green' : 'text-neon-amber'}`}
           style={{ textShadow: accent === 'cyan' ? '0 0 16px rgba(0,245,212,0.4)' : 'none' }}>
        {value}
      </div>
    </div>
  );
}

// ── Password field ─────────────────────────────────────────────────────────
function PasswordField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"><Lock size={14} /></div>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field pl-10 ${error ? 'border-neon-red/50' : ''}`}
        />
        <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-cyan transition-colors">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <p className="flex items-center gap-1 mt-1 font-mono text-[10px] text-neon-red"><AlertCircle size={10}/>{error}</p>}
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass clip-corner overflow-hidden"
    >
      <div className="flex items-center gap-3 px-8 py-5 border-b border-[rgba(0,245,212,0.08)]">
        <div className="w-7 h-7 border border-cyan/20 flex items-center justify-center bg-cyan/5">
          <Icon size={14} className="text-cyan" />
        </div>
        <h2 className="font-display font-bold text-sm text-ink-primary tracking-wider">{title}</h2>
      </div>
      <div className="px-8 py-6">{children}</div>
    </motion.div>
  );
}

// ── Main Account Page ──────────────────────────────────────────────────────
export default function AccountPage() {
  const { user, demoMode, logout } = useAuth();

  // Profile form state
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form state
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passErrors, setPassErrors] = useState({});
  const [passSaving, setPassSaving] = useState(false);

  // Order history tab
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'details'

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalSpent    = MOCK_ORDERS.reduce((s, o) => s + o.total, 0).toFixed(2);
  const memberSince   = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : 'Mar 2026';
  const accountTier   = MOCK_ORDERS.length >= 4 ? 'Gold' : MOCK_ORDERS.length >= 2 ? 'Silver' : 'Bronze';
  const tierColor     = accountTier === 'Gold' ? 'amber' : accountTier === 'Silver' ? 'cyan' : 'green';

  // ── Save profile ─────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profile.firstName.trim()) errs.firstName = 'Required';
    if (!profile.lastName.trim())  errs.lastName  = 'Required';
    if (!profile.email || !/.+@.+\..+/.test(profile.email)) errs.email = 'Valid email required';
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }
    setProfileSaving(true);
    try {
      if (!demoMode) {
        await api.put('/users/profile', profile);
      }
      await new Promise(r => setTimeout(r, 600)); // UX delay for demo
      toast.success('Profile updated successfully');
      setProfileErrors({});
    } catch {
      toast.error('Could not save profile. Try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Save password ────────────────────────────────────────────────────────
  const handleSavePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwords.current)              errs.current = 'Required';
    if (passwords.next.length < 8)       errs.next    = 'Min 8 characters';
    if (passwords.next !== passwords.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setPassErrors(errs); return; }
    setPassSaving(true);
    try {
      if (!demoMode) {
        await api.put('/users/password', { currentPassword: passwords.current, newPassword: passwords.next });
      }
      await new Promise(r => setTimeout(r, 600));
      toast.success('Password updated successfully');
      setPasswords({ current: '', next: '', confirm: '' });
      setPassErrors({});
    } catch {
      toast.error('Current password is incorrect.');
    } finally {
      setPassSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-void pt-[72px]">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="relative border-b border-[rgba(0,245,212,0.08)] py-16 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid mask-radial opacity-25" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-cyan" />
            <span className="section-label">My Account</span>
          </motion.div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {/* Avatar */}
              <div className="flex items-center gap-5 mb-4">
                <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/25 flex items-center justify-center flex-shrink-0"
                     style={{ boxShadow: '0 0 24px rgba(0,245,212,0.15)' }}>
                  <span className="font-display font-black text-xl text-cyan">
                    {(user?.firstName?.[0] || 'U')}{(user?.lastName?.[0] || '')}
                  </span>
                </div>
                <div>
                  <h1 className="font-display font-black text-3xl text-ink-primary">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="font-mono text-xs text-ink-muted mt-1">{user?.email}</p>
                </div>
              </div>

              {/* Mode badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 border font-mono text-[10px] tracking-widest uppercase
                               ${demoMode
                                 ? 'border-neon-amber/30 bg-neon-amber/5 text-neon-amber'
                                 : 'border-neon-green/30 bg-neon-green/5 text-neon-green'}`}>
                {demoMode ? <WifiOff size={11} /> : <Wifi size={11} />}
                {demoMode ? 'Demo Mode — data not persisted' : 'Live — connected to database'}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-8">

        {/* ── Summary Stats ─────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Calendar}    label="Member Since"   value={memberSince}                          accent="cyan"  />
          <StatCard icon={Package}     label="Total Orders"   value={MOCK_ORDERS.length}                    accent="cyan"  />
          <StatCard icon={ShoppingBag} label="Total Spent"    value={`$${totalSpent}`}                     accent="amber" />
          <StatCard icon={Award}       label="Account Tier"   value={accountTier}                          accent={tierColor} />
        </motion.div>

        {/* ── Two-column layout ─────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* Left — Edit forms */}
          <div className="space-y-6">

            {/* Profile details */}
            <Section title="Profile Details" icon={User} delay={0.2}>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-2">First Name</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"><User size={14} /></div>
                      <input type="text" value={profile.firstName}
                             onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                             placeholder="John"
                             className={`input-field pl-10 ${profileErrors.firstName ? 'border-neon-red/50' : ''}`} />
                    </div>
                    {profileErrors.firstName && <p className="flex items-center gap-1 mt-1 font-mono text-[10px] text-neon-red"><AlertCircle size={10}/>{profileErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-2">Last Name</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"><User size={14} /></div>
                      <input type="text" value={profile.lastName}
                             onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                             placeholder="Doe"
                             className={`input-field pl-10 ${profileErrors.lastName ? 'border-neon-red/50' : ''}`} />
                    </div>
                    {profileErrors.lastName && <p className="flex items-center gap-1 mt-1 font-mono text-[10px] text-neon-red"><AlertCircle size={10}/>{profileErrors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"><Mail size={14} /></div>
                    <input type="email" value={profile.email}
                           onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                           placeholder="you@example.com"
                           className={`input-field pl-10 ${profileErrors.email ? 'border-neon-red/50' : ''}`} />
                  </div>
                  {profileErrors.email && <p className="flex items-center gap-1 mt-1 font-mono text-[10px] text-neon-red"><AlertCircle size={10}/>{profileErrors.email}</p>}
                </div>
                <button type="submit" disabled={profileSaving}
                        className="btn-primary flex items-center gap-2 text-xs py-3 px-8 disabled:opacity-50">
                  {profileSaving
                    ? <div className="w-3.5 h-3.5 border-2 border-void/50 border-t-void rounded-full animate-spin" />
                    : <Save size={14} />}
                  Save Profile
                </button>
              </form>
            </Section>

            {/* Change password */}
            <Section title="Change Password" icon={Lock} delay={0.3}>
              <form onSubmit={handleSavePassword} className="space-y-4">
                <PasswordField label="Current Password" value={passwords.current}
                               onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                               placeholder="Your current password" error={passErrors.current} />
                <PasswordField label="New Password" value={passwords.next}
                               onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
                               placeholder="Min. 8 characters" error={passErrors.next} />
                <PasswordField label="Confirm New Password" value={passwords.confirm}
                               onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                               placeholder="Repeat new password" error={passErrors.confirm} />
                <button type="submit" disabled={passSaving}
                        className="btn-ghost flex items-center gap-2 text-xs py-3 px-8 disabled:opacity-50">
                  {passSaving
                    ? <div className="w-3.5 h-3.5 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
                    : <Lock size={14} />}
                  Update Password
                </button>
              </form>
            </Section>
          </div>

          {/* Right — Order history */}
          <Section title="Order History" icon={Package} delay={0.25}>
            <div className="space-y-3">
              {MOCK_ORDERS.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                  className="border border-[rgba(0,245,212,0.08)] bg-deep/40 p-4 hover:border-cyan/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-display font-semibold text-xs text-ink-primary">{order.product}</p>
                      <p className="font-mono text-[10px] text-ink-muted mt-0.5">#{order.id}</p>
                    </div>
                    <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border flex-shrink-0 ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-ink-muted">
                        {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="font-mono text-[10px] text-ink-muted">Qty: {order.qty}</span>
                    </div>
                    <span className="font-display font-bold text-sm text-cyan">${order.total.toFixed(2)}</span>
                  </div>
                </motion.div>
              ))}

              {/* Total */}
              <div className="border-t border-[rgba(0,245,212,0.1)] pt-4 flex justify-between items-center mt-2">
                <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">Total Spent</span>
                <span className="font-display font-black text-lg text-cyan">${totalSpent}</span>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
