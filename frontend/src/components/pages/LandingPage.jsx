import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Cpu, Zap, Activity, Leaf, Shield, ChevronDown,
  Thermometer, Waves, BarChart2, Lock, Info
} from 'lucide-react';

// ── Animated counter ───────────────────────────────────────────────────────
function AnimatedStat({ value, suffix = '', label, color = 'text-cyan' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const target = parseFloat(value);
    const isDecimal = String(value).includes('.');
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);
  return (
    <div ref={ref} className="text-center">
      <div className={`metric-value text-5xl lg:text-6xl ${color}`}>{count}{suffix}</div>
      <p className="font-mono text-xs text-ink-muted mt-2 tracking-widest uppercase">{label}</p>
    </div>
  );
}

// ── Feature card ───────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, metric, metricLabel, delay = 0, accentColor = 'cyan' }) {
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const colors = {
    cyan:  { text: 'text-cyan',       border: 'border-cyan/20',        bg: 'bg-cyan/10',        glow: 'rgba(0,245,212,0.15)'  },
    green: { text: 'text-neon-green', border: 'border-green-400/20',   bg: 'bg-green-400/10',   glow: 'rgba(57,255,20,0.1)'   },
    amber: { text: 'text-neon-amber', border: 'border-yellow-400/20',  bg: 'bg-yellow-400/10',  glow: 'rgba(255,183,0,0.1)'   },
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

// ── Step card with hover expand ────────────────────────────────────────────
function StepCard({ icon: Icon, step, title, desc, detail, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex gap-6 group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ borderColor: hovered ? 'rgba(0,245,212,0.5)' : 'rgba(0,245,212,0.2)' }}
        className="flex-shrink-0 w-10 h-10 border flex items-center justify-center transition-colors"
      >
        <Icon size={18} className={hovered ? 'text-cyan' : 'text-cyan/60'} style={{ transition: 'color 0.2s' }} />
      </motion.div>
      <div className="flex-1">
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
                  <Info size={12} className="text-cyan/60 flex-shrink-0 mt-0.5" />
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

// ── Live data stream ───────────────────────────────────────────────────────
function LiveDataStream() {
  const [rows, setRows] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      time: new Date(Date.now() - (7 - i) * 1000),
      temp: +(20 + Math.sin(i * 0.8) * 3).toFixed(1),
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRows(prev => {
        const last = prev[prev.length - 1];
        // Slightly randomize: drift ±0.3 from last value
        const drift = (Math.random() - 0.5) * 0.6;
        const newTemp = Math.min(25, Math.max(18, +(last.temp + drift).toFixed(1)));
        const newRow = { id: Date.now(), time: new Date(), temp: newTemp };
        return [...prev.slice(1), newRow];
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (d) =>
    d.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="glass clip-corner p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="relative z-10 space-y-4">
        {rows.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: i === rows.length - 1 ? 1 : 0.4 + i * 0.08 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <span className="font-mono text-[10px] text-ink-muted w-24 flex-shrink-0">{fmt(row.time)}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan/30 to-transparent" />
            <span className={`font-mono text-sm font-bold ${i === rows.length - 1 ? 'text-cyan' : 'text-ink-secondary'}`}>
              {row.temp}°C
            </span>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === rows.length - 1 ? 'bg-neon-green animate-pulse' : 'bg-ink-muted/30'}`}
                 style={i === rows.length - 1 ? { boxShadow: '0 0 6px rgba(57,255,20,0.8)' } : {}} />
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-panel/80 to-transparent pointer-events-none" />
    </div>
  );
}

// ── Device placeholder ─────────────────────────────────────────────────────
function DevicePlaceholder() {
  const [temp, setTemp] = useState(21.4);
  useEffect(() => {
    const timer = setInterval(() => {
      setTemp(prev => +(Math.min(25, Math.max(18, prev + (Math.random() - 0.5) * 0.4))).toFixed(1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute w-80 h-80 rounded-full border border-cyan/5 animate-pulse-slow" />
      <div className="absolute w-64 h-64 rounded-full border border-cyan/10 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute w-48 h-48 rounded-full border border-cyan/15" style={{ animationDelay: '1s' }} />
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-44 h-44"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-panel via-deep to-void clip-corner border border-cyan/20"
             style={{ boxShadow: '0 0 60px rgba(0,245,212,0.15), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
          <div className="absolute inset-4 bg-deep/80 border border-cyan/10 flex flex-col items-center justify-center gap-2">
            <div className="font-mono text-[10px] text-ink-muted tracking-widest">TEMP</div>
            <motion.div
              key={temp}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="font-display font-black text-2xl text-cyan"
              style={{ textShadow: '0 0 20px rgba(0,245,212,0.8)' }}
            >
              {temp}°
            </motion.div>
            <div className="font-mono text-[8px] text-ink-muted">CELSIUS</div>
            <div className="absolute bottom-3 left-3 right-3 h-0.5 bg-deep">
              <motion.div
                className="h-full bg-cyan"
                animate={{ scaleX: [0.2, 1, 0.4, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-green animate-pulse"
               style={{ boxShadow: '0 0 8px rgba(57,255,20,0.8)' }} />
        </div>
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
          {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan/40" />)}
        </div>
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
          {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan/40" />)}
        </div>
      </motion.div>
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

// ── Main Landing Page ──────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate     = useNavigate();
  const featuresRef  = useRef(null);

  const scrollToFeatures = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const steps = [
    {
      icon: Thermometer, step: '01', title: 'Continuous Sampling',
      desc: 'The onboard sensor polls ambient temperature every second using a calibrated hysteresis algorithm to filter noise.',
      detail: 'The hysteresis algorithm uses two thresholds — high and low — to prevent rapid toggling near a set point. This means readings only update when a real change occurs, not due to electrical micro-fluctuations.',
    },
    {
      icon: Waves, step: '02', title: 'Real-Time Transmission',
      desc: 'Data is streamed instantly to your connected platform — no buffering, no latency, no memory accumulation.',
      detail: 'Using a lightweight event-driven protocol, each data point is pushed immediately. The device holds zero historical data in RAM — every byte is forwarded then discarded, keeping memory usage flat at all times.',
    },
    {
      icon: BarChart2, step: '03', title: 'Intelligent Alerting',
      desc: 'Custom thresholds trigger instant alerts before temperature anomalies cause equipment failure or safety hazards.',
      detail: 'You define upper and lower safe-zone boundaries. The moment a reading crosses either threshold, TermoGuard fires an alert via SMS, email, or webhook — typically within 1.2 seconds of detection.',
    },
    {
      icon: Lock, step: '04', title: 'Secure & Certified',
      desc: 'End-to-end encrypted data transmission with CE, RoHS, and industrial-grade certifications for every deployment.',
      detail: 'All data is encrypted in transit using AES-256. The device ships with CE, RoHS, and FCC certifications. Enterprise deployments support on-premise hosting for full data sovereignty.',
    },
  ];

  const features = [
    { icon: Cpu,      title: 'Hysteresis Algorithm',  description: 'Our proprietary dual-threshold hysteresis algorithm eliminates sensor jitter, delivering rock-solid readings that accurately represent real-world thermal conditions — not electrical noise.',  metric: '0.1°', metricLabel: 'Temperature Accuracy', accentColor: 'cyan',  delay: 0.1 },
    { icon: Zap,      title: 'Lightning Polling Rate', description: 'Every single second, TermoGuard samples your environment. Sub-second anomalies are captured before they cascade into expensive equipment failures or unsafe conditions.',                        metric: '1s',   metricLabel: 'Polling Interval',    accentColor: 'amber', delay: 0.2 },
    { icon: Activity, title: 'Real-Time Streaming',    description: 'Data flows continuously to your dashboard via an efficient stream protocol — no batch accumulation, no memory bloat, no data loss. Always live. Always accurate.',                                 metric: '∞',    metricLabel: 'Zero Buffer Overflow', accentColor: 'cyan',  delay: 0.3 },
    { icon: Leaf,     title: 'Eco-Efficient Design',   description: 'Engineered to run continuously for years on minimal power. TermoGuard prevents the costly appliance failures that waste both energy and resources at scale.',                                      metric: '99.9%', metricLabel: 'Uptime Reliability', accentColor: 'green', delay: 0.4 },
  ];

  return (
    <div className="bg-void">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[72px]">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid mask-radial opacity-60" />
        <motion.div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.05) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                          className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-cyan" />
                <span className="section-label">Precision Thermal Intelligence</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                         className="font-display font-black text-5xl lg:text-7xl text-ink-primary leading-[1.05] mb-6">
                CONTROL<br /><span className="text-glow-cyan text-cyan">EVERY</span><br />DEGREE.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
                        className="text-ink-secondary text-lg leading-relaxed max-w-lg mb-10">
                TermoGuard is the seamless connection between complex electronics and easy human understanding.
                <span className="text-ink-primary"> 0.1° precision. 1-second response. </span>
                Ultimate peace of mind — preventing costly repairs before they happen.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
                          className="flex flex-wrap gap-4 mb-12">
                <button onClick={() => navigate('/store')} className="btn-primary">Shop Now</button>
                <button onClick={() => navigate('/enterprise')} className="btn-ghost">Enterprise</button>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-4">
                {['CE Certified', 'RoHS Compliant', 'ISO 9001', '5-Year Warranty'].map(badge => (
                  <span key={badge} className="tag"><Shield size={10} />{badge}</span>
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

        {/* ── Discover scroll button ── */}
        <motion.button
          onClick={scrollToFeatures}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group cursor-pointer bg-transparent border-none"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="font-mono text-[10px] text-ink-muted tracking-widest uppercase group-hover:text-cyan transition-colors">
            Discover
          </span>
          <ChevronDown size={16} className="text-cyan/50 group-hover:text-cyan transition-colors" />
        </motion.button>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section ref={featuresRef} className="border-y border-[rgba(0,245,212,0.1)] bg-deep/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <AnimatedStat value="0.1" suffix="°C" label="Accuracy Threshold" />
            <AnimatedStat value="1"   suffix="s"  label="Polling Rate" />
            <AnimatedStat value="99.9" suffix="%" label="Uptime" color="text-neon-green" />
            <AnimatedStat value="50"   suffix="k+" label="Units Deployed" />
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
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

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-32 bg-deep/30 border-y border-[rgba(0,245,212,0.06)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-cyan" />
                <span className="section-label">How It Works</span>
              </div>
              <h2 className="section-title mb-4">
                Sense. Stream. <span className="text-cyan">Protect.</span>
              </h2>
              <p className="text-ink-muted font-mono text-xs tracking-widest uppercase mb-10">
                Hover each step to learn more
              </p>
              <div className="space-y-8">
                {steps.map((s, i) => (
                  <StepCard key={s.step} {...s} delay={i * 0.1} />
                ))}
              </div>
            </div>
            <div className="relative">
              <LiveDataStream />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] text-ink-muted tracking-widest uppercase">
                Live Data Stream — Updates Every Second
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
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

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(0,245,212,0.08)] py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-display font-bold text-sm tracking-[0.15em] text-cyan">
            TERMO<span className="text-ink-muted">GUARD</span>
          </span>
          <p className="font-mono text-xs text-ink-muted tracking-widest">
            © {new Date().getFullYear()} TermoGuard Technologies. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support'].map(l => (
              <span key={l} className="font-mono text-xs text-ink-muted hover:text-cyan transition-colors cursor-pointer tracking-widest uppercase">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
