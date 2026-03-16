import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Cpu, Zap, Activity, Leaf, Shield, ChevronDown,
  Thermometer, Waves, BarChart2, Lock, Info
} from 'lucide-react';

// ── Animated counter ──────────────────────────────────────────────────────
function AnimatedStat({ value, suffix = '', label, color = 'text-cyan' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const target = parseFloat(value);
    const isDecimal = String(value).includes('.');
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 1800 / steps);
    return () => clearInterval(timer);
  }, [inView, value]);
  return (
    <div ref={ref} className="text-center">
      <div className={`metric-value text-5xl lg:text-6xl ${color}`}>{count}{suffix}</div>
      <p className="font-mono text-xs text-ink-muted mt-2 tracking-widest uppercase">{label}</p>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, metric, metricLabel, delay = 0, accentColor = 'cyan' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const colors = {
    cyan:  { text: 'text-cyan',       border: 'border-cyan/20',       bg: 'bg-cyan/10',       glow: 'rgba(0,245,212,0.15)' },
    green: { text: 'text-neon-green', border: 'border-green-400/20',  bg: 'bg-green-400/10',  glow: 'rgba(57,255,20,0.1)'  },
    amber: { text: 'text-neon-amber', border: 'border-yellow-400/20', bg: 'bg-yellow-400/10', glow: 'rgba(255,183,0,0.1)'  },
  };
  const c = colors[accentColor] || colors.cyan;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-hover p-8 clip-corner relative group"
    >
      <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${c.border}`} />
      <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${c.border}`} />
      <div className={`w-12 h-12 ${c.bg} ${c.border} border flex items-center justify-center mb-6`}
           style={{ boxShadow: `0 0 20px ${c.glow}` }}>
        <Icon size={22} className={c.text} />
      </div>
      {metric && (
        <div className={`font-display font-black text-3xl ${c.text} mb-1`}
             style={{ textShadow: `0 0 20px ${c.glow}` }}>{metric}</div>
      )}
      {metricLabel && (
        <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-4">{metricLabel}</p>
      )}
      <h3 className="font-display font-bold text-lg text-ink-primary mb-3">{title}</h3>
      <p className="font-body text-sm text-ink-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ── Step card with hover-reveal detail ────────────────────────────────────
function StepCard({ icon: Icon, step, title, desc, detail, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex gap-6 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ borderColor: hovered ? 'rgba(0,245,212,0.5)' : 'rgba(0,245,212,0.2)' }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0 w-10 h-10 border flex items-center justify-center"
      >
        <Icon size={18} className={`transition-colors duration-200 ${hovered ? 'text-cyan' : 'text-cyan/60'}`} />
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10px] text-ink-muted tracking-widest mb-1">STEP {step}</div>
        <h3 className="font-display font-semibold text-sm text-ink-primary mb-2">{title}</h3>
        <p className="text-ink-secondary text-sm leading-relaxed">{desc}</p>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-l-2 border-cyan/30 pl-4 py-2 bg-cyan/5">
                <div className="flex items-start gap-2">
                  <Info size={11} className="text-cyan/60 flex-shrink-0 mt-0.5" />
                  <p className="font-mono text-[11px] text-cyan/70 leading-relaxed">{detail}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Live Data Stream — fluid ticker ───────────────────────────────────────
function LiveDataStream() {
  // Keep a rolling buffer of 12 readings; render top 8 visually
  const VISIBLE = 8;
  const [rows, setRows] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      time: new Date(Date.now() - (11 - i) * 1000),
      temp: +(20.5 + Math.sin(i * 0.8) * 2.5).toFixed(1),
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRows(prev => {
        const last = prev[prev.length - 1];
        const drift = (Math.random() - 0.48) * 0.5; // slight upward bias
        const newTemp = +(Math.min(25.0, Math.max(18.0, last.temp + drift)).toFixed(1));
        const newRow = { id: Date.now(), time: new Date(), temp: newTemp };
        return [...prev.slice(1), newRow];
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (d) =>
    d.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const visible = rows.slice(-VISIBLE);

  return (
    <div className="glass clip-corner relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-25 pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-[rgba(0,245,212,0.1)]">
        <span className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">Live Feed</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"
               style={{ boxShadow: '0 0 6px rgba(57,255,20,0.8)' }} />
          <span className="font-mono text-[10px] text-neon-green tracking-widest">ACTIVE · 1s poll</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="relative z-10 flex items-center gap-0 px-6 py-2 border-b border-[rgba(0,245,212,0.06)]">
        <span className="font-mono text-[9px] text-ink-muted tracking-widest uppercase w-24 flex-shrink-0">Timestamp</span>
        <div className="flex-1" />
        <span className="font-mono text-[9px] text-ink-muted tracking-widest uppercase w-16 text-right flex-shrink-0">Temp</span>
        <span className="font-mono text-[9px] text-ink-muted tracking-widest uppercase w-6 text-right flex-shrink-0 ml-2">ST</span>
      </div>

      {/* Rows */}
      <div className="relative z-10 overflow-hidden" style={{ height: `${VISIBLE * 44}px` }}>
        <AnimatePresence initial={false}>
          {visible.map((row, i) => {
            const isLatest = i === visible.length - 1;
            const opacity = 0.35 + (i / (VISIBLE - 1)) * 0.65;
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: -44 }}
                animate={{ opacity, y: 0 }}
                exit={{ opacity: 0, y: 44 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 flex items-center gap-0 px-6"
                style={{ height: 44, top: `${i * 44}px` }}
              >
                {/* Timestamp */}
                <span className="font-mono text-[11px] text-ink-muted w-24 flex-shrink-0 leading-none">
                  {fmt(row.time)}
                </span>

                {/* Separator line */}
                <div className="flex-1 mx-3 h-px"
                     style={{ background: `linear-gradient(to right, rgba(0,245,212,${isLatest ? 0.3 : 0.1}), transparent)` }} />

                {/* Temperature */}
                <span className={`font-mono text-sm font-bold w-16 text-right flex-shrink-0 leading-none tabular-nums
                                  ${isLatest ? 'text-cyan' : 'text-ink-secondary'}`}
                      style={isLatest ? { textShadow: '0 0 10px rgba(0,245,212,0.6)' } : {}}>
                  {row.temp}°C
                </span>

                {/* Status dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-3
                                 ${isLatest ? 'bg-neon-green' : 'bg-ink-muted/25'}`}
                     style={isLatest ? { boxShadow: '0 0 6px rgba(57,255,20,0.8)', animation: 'pulse 2s ease-in-out infinite' } : {}} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Fade out bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-20"
           style={{ background: 'linear-gradient(to top, rgba(13,20,32,0.9) 0%, transparent 100%)' }} />
    </div>
  );
}

// ── Device placeholder ────────────────────────────────────────────────────
function DevicePlaceholder() {
  const [temp, setTemp] = useState(21.4);
  useEffect(() => {
    const timer = setInterval(() => {
      setTemp(prev => +(Math.min(25, Math.max(18, prev + (Math.random() - 0.5) * 0.4)).toFixed(1)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute w-80 h-80 rounded-full border border-cyan/5 animate-pulse-slow" />
      <div className="absolute w-64 h-64 rounded-full border border-cyan/10 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute w-48 h-48 rounded-full border border-cyan/15" />
      <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-44 h-44">
        <div className="absolute inset-0 bg-gradient-to-br from-panel via-deep to-void clip-corner border border-cyan/20"
             style={{ boxShadow: '0 0 60px rgba(0,245,212,0.15), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
          <div className="absolute inset-4 bg-deep/80 border border-cyan/10 flex flex-col items-center justify-center gap-2">
            <div className="font-mono text-[10px] text-ink-muted tracking-widest">TEMP</div>
            <motion.div key={temp} initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}
                        className="font-display font-black text-2xl text-cyan"
                        style={{ textShadow: '0 0 20px rgba(0,245,212,0.8)' }}>
              {temp}°
            </motion.div>
            <div className="font-mono text-[8px] text-ink-muted">CELSIUS</div>
            <div className="absolute bottom-3 left-3 right-3 h-0.5 bg-deep">
              <motion.div className="h-full bg-cyan" animate={{ scaleX: [0.2, 1, 0.4, 0.8, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: 'left' }} />
            </div>
          </div>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-green animate-pulse"
               style={{ boxShadow: '0 0 8px rgba(57,255,20,0.8)' }} />
        </div>
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan/40" />)}
        </div>
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan/40" />)}
        </div>
      </motion.div>
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        <motion.div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent"
                    animate={{ top: ['0%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
      </div>
    </div>
  );
}

// ── Footer link modal ─────────────────────────────────────────────────────
function PolicyModal({ title, onClose, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[150] flex items-center justify-center px-4"
                style={{ background: 'rgba(3,5,8,0.85)', backdropFilter: 'blur(8px)' }}
                onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }} transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }}
                  className="glass clip-corner w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-base text-ink-primary tracking-wider">{title}</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-cyan transition-colors text-lg leading-none">✕</button>
        </div>
        <div className="text-ink-secondary text-sm leading-relaxed space-y-3">{children}</div>
        <button onClick={onClose} className="btn-primary mt-6 text-xs py-3 px-8">Close</button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate     = useNavigate();
  const statsRef     = useRef(null);
  const [modal, setModal] = useState(null); // 'privacy' | 'terms' | 'support'

  // Smooth scroll — uses scrollIntoView with behavior:'smooth'
  const scrollToStats = useCallback(() => {
    statsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const features = [
    { icon: Cpu,      title: 'Hysteresis Algorithm',  description: 'Our proprietary dual-threshold algorithm eliminates sensor jitter, delivering rock-solid readings that represent real thermal conditions — not electrical noise.',       metric: '0.1°',  metricLabel: 'Temperature Accuracy', accentColor: 'cyan',  delay: 0.1 },
    { icon: Zap,      title: 'Lightning Polling Rate', description: 'Every single second, TermoGuard samples your environment. Sub-second anomalies are captured before they cascade into expensive equipment failures.',                    metric: '1s',    metricLabel: 'Polling Interval',     accentColor: 'amber', delay: 0.2 },
    { icon: Activity, title: 'Real-Time Streaming',    description: 'Data flows continuously to your dashboard — no batch accumulation, no memory bloat, no data loss. Always live. Always accurate.',                                       metric: '∞',     metricLabel: 'Zero Buffer Overflow', accentColor: 'cyan',  delay: 0.3 },
    { icon: Leaf,     title: 'Eco-Efficient Design',   description: 'Engineered to run continuously for years on minimal power. TermoGuard prevents costly appliance failures that waste both energy and resources at scale.',               metric: '99.9%', metricLabel: 'Uptime Reliability',   accentColor: 'green', delay: 0.4 },
  ];

  const steps = [
    { icon: Thermometer, step: '01', title: 'Continuous Sampling',   desc: 'The onboard sensor polls ambient temperature every second using a calibrated hysteresis algorithm to filter noise.',              detail: 'Dual thresholds prevent rapid toggling near a set point. Readings only update when a real change occurs, not due to electrical micro-fluctuations.' },
    { icon: Waves,       step: '02', title: 'Real-Time Transmission', desc: 'Data is streamed instantly to your connected platform — no buffering, no latency, no memory accumulation.',                     detail: 'Each data point is pushed immediately via a lightweight event-driven protocol. Zero historical data is held in RAM — every byte is forwarded then discarded.' },
    { icon: BarChart2,   step: '03', title: 'Intelligent Alerting',   desc: 'Custom thresholds trigger instant alerts before temperature anomalies cause equipment failure or safety hazards.',              detail: 'Define upper/lower safe-zone boundaries. The moment a reading crosses either threshold, TermoGuard fires an alert via SMS, email, or webhook within 1.2 seconds.' },
    { icon: Lock,        step: '04', title: 'Secure & Certified',     desc: 'End-to-end encrypted data transmission with CE, RoHS, and industrial-grade certifications for every deployment.',             detail: 'All data is encrypted in transit using AES-256. Devices ship with CE, RoHS, and FCC certifications. Enterprise deployments support on-premise hosting.' },
  ];

  return (
    <div className="bg-void">

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[72px]">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid mask-radial opacity-60" />
        <motion.div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.05) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                          className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-cyan" />
                <span className="section-label">Precision Thermal Intelligence</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                         className="font-display font-black text-5xl lg:text-7xl text-ink-primary leading-[1.05] mb-6">
                CONTROL<br /><span className="text-glow-cyan text-cyan">EVERY</span><br />DEGREE.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="text-ink-secondary text-lg leading-relaxed max-w-lg mb-10">
                TermoGuard is the seamless connection between complex electronics and easy human understanding.
                <span className="text-ink-primary"> 0.1° precision. 1-second response. </span>
                Ultimate peace of mind — preventing costly repairs before they happen.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                          className="flex flex-wrap gap-4 mb-12">
                <button onClick={() => navigate('/store')} className="btn-primary">Shop Now</button>
                <button onClick={() => navigate('/enterprise')} className="btn-ghost">Enterprise</button>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                          className="flex flex-wrap gap-4">
                {['CE Certified', 'RoHS Compliant', 'ISO 9001', '5-Year Warranty'].map(b => (
                  <span key={b} className="tag"><Shield size={10} />{b}</span>
                ))}
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex justify-center">
              <DevicePlaceholder />
            </motion.div>
          </div>
        </div>

        {/* Discover button — smooth scroll, no layout jump */}
        <motion.button
          type="button"
          onClick={scrollToStats}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group bg-transparent border-none cursor-pointer"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="font-mono text-[10px] text-ink-muted tracking-[0.2em] uppercase group-hover:text-cyan transition-colors duration-200">
            Discover
          </span>
          <ChevronDown size={16} className="text-cyan/50 group-hover:text-cyan transition-colors duration-200" />
        </motion.button>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────── */}
      {/* This ref is the scroll target for the Discover button */}
      <section ref={statsRef} className="border-y border-[rgba(0,245,212,0.1)] bg-deep/40 scroll-mt-[72px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <AnimatedStat value="0.1" suffix="°C" label="Accuracy Threshold" />
            <AnimatedStat value="1"   suffix="s"  label="Polling Rate" />
            <AnimatedStat value="99.9" suffix="%" label="Uptime" color="text-neon-green" />
            <AnimatedStat value="50"  suffix="k+" label="Units Deployed" />
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-cyan" />
            <span className="section-label">Core Technology</span>
            <div className="w-8 h-px bg-cyan" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                     transition={{ delay: 0.1 }} className="section-title">
            Engineered for{' '}<span className="text-cyan text-glow-cyan">Exactness</span>
          </motion.h2>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="py-32 bg-deep/30 border-y border-[rgba(0,245,212,0.06)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-cyan" />
                <span className="section-label">How It Works</span>
              </div>
              <h2 className="section-title mb-3">
                Sense. Stream. <span className="text-cyan">Protect.</span>
              </h2>
              <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-10">
                Hover each step to learn more
              </p>
              <div className="space-y-8">
                {steps.map((s, i) => <StepCard key={s.step} {...s} delay={i * 0.1} />)}
              </div>
            </div>
            <div className="relative">
              <LiveDataStream />
              <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-ink-muted tracking-widest uppercase whitespace-nowrap">
                Live Stream Preview — Updates Every Second
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-cyan opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                     className="font-display font-black text-4xl lg:text-5xl text-ink-primary mb-6">
            Never Miss a Degree.<br /><span className="text-cyan text-glow-cyan">Ever Again.</span>
          </motion.h2>
          <p className="text-ink-secondary text-lg mb-10 max-w-xl mx-auto">
            Join 50,000+ engineers, homeowners, and facility managers who trust TermoGuard to protect what matters most.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/store')} className="btn-primary text-sm py-4 px-10">Shop TermoGuard</button>
            <button onClick={() => navigate('/enterprise')} className="btn-ghost text-sm py-4 px-10">Enterprise Inquiry</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(0,245,212,0.08)] py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-display font-bold text-sm tracking-[0.15em] text-cyan">
            TERMO<span className="text-ink-muted">GUARD</span>
          </span>
          <p className="font-mono text-xs text-ink-muted tracking-widest">
            © {new Date().getFullYear()} TermoGuard Technologies EOOD. Registered in Bulgaria.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy', key: 'privacy' },
              { label: 'Terms of Service', key: 'terms' },
              { label: 'Support', key: 'support' },
            ].map(({ label, key }) => (
              <button key={key} onClick={() => setModal(key)}
                      className="font-mono text-xs text-ink-muted hover:text-cyan transition-colors tracking-widest uppercase bg-transparent border-none cursor-pointer">
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Policy Modals ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {modal === 'privacy' && (
          <PolicyModal title="Privacy Policy" onClose={() => setModal(null)}>
            <p>TermoGuard Technologies EOOD ("we", "our") is committed to protecting your personal data in accordance with GDPR and Bulgarian data protection law.</p>
            <p>We collect only the data necessary to provide our services: your name, email address, and usage data. We never sell your data to third parties.</p>
            <p>For questions contact: <span className="text-cyan">privacy@termoguard.gmail.com</span></p>
          </PolicyModal>
        )}
        {modal === 'terms' && (
          <PolicyModal title="Terms of Service" onClose={() => setModal(null)}>
            <p>By using TermoGuard products and services you agree to these terms. Our devices are sold as-is for monitoring purposes only.</p>
            <p>TermoGuard is not liable for damages arising from sensor failure, connectivity issues, or misuse of data. A 5-year hardware warranty applies to manufacturing defects.</p>
            <p>Governing law: Republic of Bulgaria. Disputes resolved in Sofia courts.</p>
          </PolicyModal>
        )}
        {modal === 'support' && (
          <PolicyModal title="Support" onClose={() => setModal(null)}>
            <p>Our support team is based in Sofia, Bulgaria and available Monday–Friday, 09:00–18:00 EET.</p>
            <p>Email: <span className="text-cyan">support@termoguard.gmail.com</span></p>
            <p>Phone: <span className="text-cyan">+359 88 491 2200</span></p>
            <p>Enterprise customers receive 24/7 dedicated support via their account manager.</p>
          </PolicyModal>
        )}
      </AnimatePresence>
    </div>
  );
}
