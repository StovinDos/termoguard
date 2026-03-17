import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, WifiOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function InputGroup({ label, icon: Icon, type = 'text', value, onChange, placeholder, error, suffix }) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
          <Icon size={15} />
        </div>
        <input
          type={isPassword && showPass ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field pl-10 ${error ? 'border-neon-red/50 focus:border-neon-red/80' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-cyan transition-colors"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 font-mono text-[10px] text-neon-red">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

// ── Login Form ─────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setServerError('');
    try {
      await login(form.email, form.password);
      onSuccess();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {serverError && (
        <div className="flex items-center gap-2 p-3 border border-neon-red/30 bg-neon-red/5">
          <AlertCircle size={14} className="text-neon-red flex-shrink-0" />
          <p className="font-mono text-xs text-neon-red">{serverError}</p>
        </div>
      )}
      <InputGroup
        label="Email Address" icon={Mail} type="email"
        value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        placeholder="you@example.com" error={errors.email}
      />
      <InputGroup
        label="Password" icon={Lock} type="password"
        value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
        placeholder="••••••••" error={errors.password}
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-void/50 border-t-void rounded-full animate-spin" />
        ) : (
          <>Sign In <ArrowRight size={16} /></>
        )}
      </button>
    </form>
  );
}

// ── Register Form ──────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const [form, setForm]   = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.firstName)  e.firstName = 'Required';
    if (!form.lastName)   e.lastName  = 'Required';
    if (!form.email)      e.email     = 'Email is required';
    if (!/.+@.+\..+/.test(form.email)) e.email = 'Invalid email';
    if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setServerError('');
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      onSuccess();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm(p => ({ ...p, [field]: e.target.value })),
    error: errors[field],
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="flex items-center gap-2 p-3 border border-neon-red/30 bg-neon-red/5">
          <AlertCircle size={14} className="text-neon-red flex-shrink-0" />
          <p className="font-mono text-xs text-neon-red">{serverError}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <InputGroup label="First Name" icon={User} placeholder="John" {...f('firstName')} />
        <InputGroup label="Last Name"  icon={User} placeholder="Doe"  {...f('lastName')} />
      </div>
      <InputGroup label="Email Address" icon={Mail} type="email" placeholder="you@example.com" {...f('email')} />
      <InputGroup label="Password" icon={Lock} type="password" placeholder="Min. 8 characters" {...f('password')} />
      <InputGroup label="Confirm Password" icon={Lock} type="password" placeholder="Repeat password" {...f('confirm')} />
      <p className="font-mono text-[10px] text-ink-muted leading-relaxed">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </p>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-void/50 border-t-void rounded-full animate-spin" />
        ) : (
          <>Create Account <ArrowRight size={16} /></>
        )}
      </button>
    </form>
  );
}

// ── Auth Page ──────────────────────────────────────────────────────────────
export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/store';
  const [tab, setTab] = useState('login');

  const handleSuccess = () => navigate(redirect);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-void py-20 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid mask-radial opacity-40" />
      <motion.div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.04) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <button onClick={() => navigate('/')} className="font-display font-bold text-2xl tracking-[0.15em] text-cyan"
                  style={{ textShadow: '0 0 20px rgba(0,245,212,0.5)' }}>
            TERMO<span className="text-ink-primary">GUARD</span>
          </button>
          <p className="font-mono text-xs text-ink-muted tracking-widest mt-2 uppercase">Secure Access Portal</p>
        </motion.div>

        {/* Redirect notice */}
        {searchParams.get('redirect') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-2 p-3 border border-cyan/20 bg-cyan/5"
          >
            <AlertCircle size={14} className="text-cyan flex-shrink-0" />
            <p className="font-mono text-[10px] text-cyan/80 tracking-wide">
              Authentication required to access the store
            </p>
          </motion.div>
        )}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass clip-corner overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-[rgba(0,245,212,0.1)]">
            {['login', 'register'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 font-mono text-xs tracking-widest uppercase transition-all duration-200
                           ${tab === t
                             ? 'text-cyan border-b-2 border-cyan bg-cyan/5'
                             : 'text-ink-muted hover:text-ink-secondary border-b-2 border-transparent'}`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form area */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === 'login' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === 'login' ? 20 : -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-display font-bold text-xl text-ink-primary mb-6">
                  {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                {tab === 'login'
                  ? <LoginForm onSuccess={handleSuccess} />
                  : <RegisterForm onSuccess={handleSuccess} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Switch tab link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 font-mono text-xs text-ink-muted"
        >
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            className="text-cyan hover:underline"
          >
            {tab === 'login' ? 'Register' : 'Sign In'}
          </button>
        </motion.p>
      </div>
    </div>
  );
}
