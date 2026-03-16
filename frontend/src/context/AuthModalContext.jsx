import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const AuthModalContext = createContext(null);

function InputRow({ label, icon: Icon, type = 'text', value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"><Icon size={14} /></div>
        <input
          type={isPass && show ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field pl-10 ${error ? 'border-neon-red/50' : ''}`}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-cyan transition-colors">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && <p className="flex items-center gap-1 mt-1 font-mono text-[10px] text-neon-red"><AlertCircle size={10}/>{error}</p>}
    </div>
  );
}

function AuthModal({ onClose, onSuccess }) {
  const { login, register } = useAuth();
  const [tab, setTab]       = useState('login');
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState('');

  const [loginForm, setLoginForm]     = useState({ email: '', password: '' });
  const [registerForm, setRegForm]    = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errors, setErrors]           = useState({});

  const validateLogin = () => {
    const e = {};
    if (!loginForm.email)    e.email    = 'Required';
    if (!loginForm.password) e.password = 'Required';
    return e;
  };

  const validateRegister = () => {
    const e = {};
    if (!registerForm.firstName) e.firstName = 'Required';
    if (!registerForm.lastName)  e.lastName  = 'Required';
    if (!registerForm.email || !/.+@.+\..+/.test(registerForm.email)) e.email = 'Valid email required';
    if (registerForm.password.length < 8) e.password = 'Min 8 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = tab === 'login' ? validateLogin() : validateRegister();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerErr('');
    try {
      if (tab === 'login') {
        await login(loginForm.email, loginForm.password);
      } else {
        await register(registerForm);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'rgba(3,5,8,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass clip-corner overflow-hidden"
        style={{ boxShadow: '0 0 80px rgba(0,245,212,0.12), 0 24px 80px rgba(0,0,0,0.7)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-0">
          <div>
            <div className="font-display font-bold text-lg text-cyan tracking-[0.15em]"
                 style={{ textShadow: '0 0 16px rgba(0,245,212,0.5)' }}>
              TERMO<span className="text-ink-primary">GUARD</span>
            </div>
            <div className="font-mono text-[10px] text-ink-muted tracking-widest mt-0.5">Secure Access Portal</div>
          </div>
          <button onClick={onClose}
                  className="w-8 h-8 border border-[rgba(0,245,212,0.15)] flex items-center justify-center text-ink-muted hover:text-cyan hover:border-cyan/40 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mt-6 border-b border-[rgba(0,245,212,0.1)]">
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErrors({}); setServerErr(''); }}
                    className={`flex-1 py-3.5 font-mono text-[10px] tracking-widest uppercase transition-all duration-200 border-b-2
                               ${tab === t ? 'text-cyan border-cyan bg-cyan/5' : 'text-ink-muted border-transparent hover:text-ink-secondary'}`}>
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              initial={{ opacity: 0, x: tab === 'login' ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === 'login' ? 16 : -16 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <h2 className="font-display font-bold text-base text-ink-primary mb-5">
                {tab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>

              {serverErr && (
                <div className="flex items-center gap-2 p-3 border border-neon-red/30 bg-neon-red/5">
                  <AlertCircle size={13} className="text-neon-red flex-shrink-0" />
                  <p className="font-mono text-[10px] text-neon-red">{serverErr}</p>
                </div>
              )}

              {tab === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <InputRow label="First Name" icon={User} placeholder="John"
                            value={registerForm.firstName} onChange={e => setRegForm(p => ({ ...p, firstName: e.target.value }))}
                            error={errors.firstName} />
                  <InputRow label="Last Name" icon={User} placeholder="Doe"
                            value={registerForm.lastName} onChange={e => setRegForm(p => ({ ...p, lastName: e.target.value }))}
                            error={errors.lastName} />
                </div>
              )}

              <InputRow label="Email" icon={Mail} type="email" placeholder="you@example.com"
                        value={tab === 'login' ? loginForm.email : registerForm.email}
                        onChange={e => tab === 'login'
                          ? setLoginForm(p => ({ ...p, email: e.target.value }))
                          : setRegForm(p => ({ ...p, email: e.target.value }))}
                        error={errors.email} />

              <InputRow label="Password" icon={Lock} type="password" placeholder="••••••••"
                        value={tab === 'login' ? loginForm.password : registerForm.password}
                        onChange={e => tab === 'login'
                          ? setLoginForm(p => ({ ...p, password: e.target.value }))
                          : setRegForm(p => ({ ...p, password: e.target.value }))}
                        error={errors.password} />

              <button type="submit" disabled={loading}
                      className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
                {loading
                  ? <div className="w-4 h-4 border-2 border-void/50 border-t-void rounded-full animate-spin" />
                  : <>{tab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={15} /></>}
              </button>

              <p className="text-center font-mono text-[10px] text-ink-muted pt-1">
                {tab === 'login' ? "No account? " : "Have an account? "}
                <button type="button" onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setErrors({}); }}
                        className="text-cyan hover:underline">
                  {tab === 'login' ? 'Register' : 'Sign In'}
                </button>
              </p>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AuthModalProvider({ children }) {
  const [open, setOpen]       = useState(false);
  const [onSuccess, setOnSuccess] = useState(null);

  const openModal = useCallback((successCallback) => {
    setOnSuccess(() => successCallback || null);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <AuthModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <AnimatePresence>
        {open && <AuthModal onClose={closeModal} onSuccess={onSuccess} />}
      </AnimatePresence>
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used inside AuthModalProvider');
  return ctx;
};
