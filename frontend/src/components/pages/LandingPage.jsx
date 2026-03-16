import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Cpu, Zap, Activity, Leaf, Shield, ChevronDown,
  Thermometer, Waves, BarChart2, Lock
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
      <div className={`metric-value text-5xl lg:text-6xl ${color}`}>
        {count}{suffix}
      </div>
      <p className="font-mono text-xs text-ink-muted mt-2 tracking-widest uppercase">{label}</p>
    </div>
  );
}

// ── Feature card ───────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, metric, metricLabel, delay = 0, accentColor = 'cyan' }) {
  const ref  = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const colors = {
    cyan:  { text: 'text-cyan',       border: 'border-cyan/20',   bg: 'bg-cyan/10',   glow: 'rgba(0,245,212,0.15)'  },
    green: { text: 'text-neon-green', border: 'border-green-400/20', bg: 'bg-green-400/10', glow: 'rgba(57,255,20,0.1)' },
    amber: { text: 'text-neon-amber', border: 'border-yellow-400/20', bg: 'bg-yellow-400/10', glow: 'rgba(255,183,0,0.1)' },
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
      {/* Corner accent */}
      <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${c.border}`} />
      <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${c.border}`} />

      {/* Icon */}
      <div className={`w-12 h-12 ${c.bg} ${c.border} border flex items-center justify-center mb-6`}
           style={{ boxShadow: `0 0 20px ${c.glow}` }}>
        <Icon size={22} className={c.text} />
      </div>

      {/* Metric */}
      {metric && (
        <div className={`font-display font-black text-3xl ${c.text} mb-1`}
             style={{ textShadow: `0 0 20px ${c.glow}` }}>
          {metric}
        </div>
      )}
      {metricLabel && (
        <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-4">{metricLabel}</p>
      )}

      <h3 className="font-display font-bold text-lg text-ink-primary mb-3">{title}</h3>
      <p className="font-body text-sm text-ink-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ── 3D Device Placeholder ──────────────────────────────────────────────────
function DevicePlaceholder() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div className="absolute w-80 h-80 rounded-full border border-cyan/5 animate-pulse-slow" />
      <div className="absolute w-64 h-64 rounded-full border border-cyan/10 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute w-48 h-48 rounded-full border border-cyan/15" style={{ animationDelay: '1s' }} />

      {/* Device body */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-44 h-44"
      >
        {/* Device shell */}
        <div className="absolute inset-0 bg-gradient-to-br from-panel via-deep to-void clip-corner border border-cyan/20"
             style={{ boxShadow: '0 0 60px rgba(0,245,212,0.15), inset 0 1px 0 rgba(255,255,255,0.06)' }}>

          {/* Screen area */}
          <div className="absolute inset-4 bg-deep/80 border border-cyan/10 flex flex-col items-center justify-center gap-2">
            <div className="font-mono text-[10px] text-ink-muted tracking-widest">TEMP</div>
            <div className="font-display font-black text-2xl text-cyan" style={{ textShadow: '0 0 20px rgba(0,245,212,0.8)' }}>
              21.4°
            </div>
            <div className="font-mono text-[8px] text-ink-muted">CELSIUS</div>

            {/* Pulse bar */}
            <div className="absolute bottom-3 left-3 right-3 h-0.5 bg-deep">
              <motion.div
                className="h-full bg-cyan"
                animate={{ scaleX: [0.2, 1, 0.4, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>

          {/* Top status LED */}
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-green animate-pulse"
               style={{ boxShadow: '0 0 8px rgba(57,255,20,0.8)' }} />
        </div>

        {/* Side sensor dots */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-8 flex flex-col gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan/40" />
          ))}
        </div>
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-8 flex flex-col gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan/40" />
          ))}
        </div>
      </motion.div>

      {/* Scan line */}
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
  const navigate = useNavigate();

  // ── Live temperature stream ───────────────────────────────────────────────
  const [liveTemp, setLiveTemp] = useState(() => parseFloat((Math.random() * 10 + 18).toFixed(1)));
  const [tempPulse, setTempPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTemp(prev => {
        const delta = (Math.random() - 0.5);
        const clamped = Math.max(-0.5, Math.min(0.5, delta));
        return parseFloat(Math.max(18, Math.min(28, prev + clamped)).toFixed(1));
      });
      setTempPulse(true);
      setTimeout(() => setTempPulse(false), 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Steps data ────────────────────────────────────────────────────────────
  const steps = [
    {
      icon: Thermometer,
      step: '01',
      title: 'Continuous Sampling',
      desc: 'The onboard sensor polls ambient temperature every second using a calibrated hysteresis algorithm to filter noise.',
      extra: 'Uses a dual-threshold hysteresis window to reject transient spikes, ensuring each reported reading reflects a genuine thermal state rather than momentary electrical artefacts.',
    },
    {
      icon: Waves,
      step: '02',
      title: 'Real-Time Transmission',
      desc: 'Data is streamed instantly to your connected platform — no buffering, no latency, no memory accumulation.',
      extra: 'Leverages a lightweight binary frame format over TLS 1.3. Each packet is acknowledged within 50 ms, and missed frames are automatically retransmitted without disrupting the live stream.',
    },
    {
      icon: BarChart2,
      step: '03',
      title: 'Intelligent Alerting',
      desc: 'Custom thresholds trigger instant alerts before temperature anomalies cause equipment failure or safety hazards.',
      extra: 'Supports multi-channel delivery: push notifications, SMS, and email. Alert rules can be combined with AND/OR logic and per-zone cooldown periods to suppress duplicate notifications.',
    },
    {
      icon: Lock,
      step: '04',
      title: 'Secure & Certified',
      desc: 'End-to-end encrypted data transmission with CE, RoHS, and industrial-grade certifications for every deployment.',
      extra: 'All sensor data is signed with device-specific ECDSA keys provisioned at the factory. Certificates are rotated automatically and revokable remotely, keeping your fleet secure without manual intervention.',
    },
  ];

  const features = [
    {
      icon: Cpu,
      title: 'Hysteresis Algorithm',
      description: 'Our proprietary dual-threshold hysteresis algorithm eliminates sensor jitter, delivering rock-solid readings that accurately represent real-world thermal conditions — not electrical noise.',
      metric: '0.1°',
      metricLabel: 'Temperature Accuracy',
      accentColor: 'cyan',
      delay: 0.1,
    },
    {
      icon: Zap,
      title: 'Lightning Polling Rate',
      description: 'Every single second, TermoGuard samples your environment. Sub-second anomalies are captured before they cascade into expensive equipment failures or unsafe conditions.',
      metric: '1s',
      metricLabel: 'Polling Interval',
      accentColor: 'amber',
      delay: 0.2,
    },
    {
      icon: Activity,
      title: 'Real-Time Streaming',
      description: 'Data flows continuously to your dashboard via an efficient stream protocol — no batch accumulation, no memory bloat, no data loss. Always live. Always accurate.',
      metric: '∞',
      metricLabel: 'Zero Buffer Overflow',
      accentColor: 'cyan',
      delay: 0.3,
    },
    {
      icon: Leaf,
      title: 'Eco-Efficient Design',
      description: 'Engineered to run continuously for years on minimal power. TermoGuard prevents the costly appliance failures that waste both energy and resources at scale.',
      metric: '99.9%',
      metricLabel: 'Uptime Reliability',
      accentColor: 'green',
      delay: 0.4,
    },
  ];

  return (
    <div className="bg-void">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[72px]">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid mask-radial opacity-60" />

        {/* Animated gradient orb */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.05) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-8 h-px bg-cyan" />
                <span className="section-label">Precision Thermal Intelligence</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-5xl lg:text-7xl text-ink-primary leading-[1.05] mb-6"
              >
                CONTROL
                <br />
                <span className="text-glow-cyan text-cyan">EVERY</span>
                <br />
                DEGREE.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="text-ink-secondary text-lg leading-relaxed max-w-lg mb-10"
              >
                TermoGuard is the seamless connection between complex electronics and easy human understanding. 
                <span className="text-ink-primary"> 0.1° precision. 1-second response. </span>
                Ultimate peace of mind — preventing costly repairs before they happen.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <button onClick={() => navigate('/store')} className="btn-primary">
                  Shop Now
                </button>
                <button onClick={() => navigate('/enterprise')} className="btn-ghost">
                  Enterprise
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                {['CE Certified', 'RoHS Compliant', 'ISO 9001', '5-Year Warranty'].map(badge => (
                  <span key={badge} className="tag">
                    <Shield size={10} />
                    {badge}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — Device */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center"
            >
              <DevicePlaceholder />
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll down to features"
        >
          <span className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">Discover</span>
          <ChevronDown size={16} className="text-cyan/50" />
        </motion.button>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section id="features" className="border-y border-[rgba(0,245,212,0.1)] bg-deep/40">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-cyan" />
            <span className="section-label">Core Technology</span>
            <div className="w-8 h-px bg-cyan" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Engineered for{' '}
            <span className="text-cyan text-glow-cyan">Exactness</span>
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
              <h2 className="section-title mb-8">
                Sense. Stream. <span className="text-cyan">Protect.</span>
              </h2>
              <div className="space-y-8">
                {steps.map(({ icon: Icon, step, title, desc, extra }) => (
                  <div key={step} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-10 h-10 border border-cyan/20 flex items-center justify-center
                                    group-hover:border-cyan/50 transition-colors">
                      <Icon size={18} className="text-cyan/60 group-hover:text-cyan transition-colors" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-ink-muted tracking-widest mb-1">STEP {step}</div>
                      <h3 className="font-display font-semibold text-sm text-ink-primary mb-2">{title}</h3>
                      <p className="text-ink-secondary text-sm leading-relaxed">{desc}</p>
                      {/* Extra info revealed on hover */}
                      <div className="overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-500 ease-in-out">
                        <p className="text-cyan/70 text-xs leading-relaxed mt-2 pt-2 border-t border-cyan/10">
                          {extra}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual diagram placeholder */}
            <div className="relative">
              {/* Live data reading */}
              <div className="glass clip-corner px-6 py-4 mb-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-1">Live Sensor Reading</p>
                  <div className="flex items-baseline gap-2">
                    <span
                      id="temp-display"
                      className={`font-display font-black text-3xl text-cyan transition-all duration-300 ${tempPulse ? 'scale-110 text-glow-cyan' : ''}`}
                      style={{ textShadow: '0 0 20px rgba(0,245,212,0.6)', display: 'inline-block' }}
                    >
                      {liveTemp}
                    </span>
                    <span className="font-mono text-xs text-ink-muted">°C</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"
                       style={{ boxShadow: '0 0 6px rgba(57,255,20,0.8)' }} />
                  <span className="font-mono text-[10px] text-neon-green tracking-widest">LIVE</span>
                </div>
              </div>

              <div className="glass clip-corner p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
                <div className="relative z-10 space-y-4">
                  {/* Simulated data stream */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.6] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    >
                      <span className="font-mono text-[10px] text-ink-muted w-20">
                        {String(new Date().toLocaleTimeString())}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-cyan/30 to-transparent" />
                      <span className="font-mono text-sm text-cyan font-bold">
                        {(20 + Math.sin(i * 0.8) * 3).toFixed(1)}°C
                      </span>
                      <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"
                           style={{ boxShadow: '0 0 6px rgba(57,255,20,0.8)' }} />
                    </motion.div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-panel/80 to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] text-ink-muted tracking-widest uppercase">
                Live Data Stream Preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-cyan opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-4xl lg:text-5xl text-ink-primary mb-6"
          >
            Never Miss a Degree.<br />
            <span className="text-cyan text-glow-cyan">Ever Again.</span>
          </motion.h2>
          <p className="text-ink-secondary text-lg mb-10 max-w-xl mx-auto">
            Join 50,000+ engineers, homeowners, and facility managers who trust TermoGuard to protect what matters most.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/store')} className="btn-primary text-sm py-4 px-10">
              Shop TermoGuard
            </button>
            <button onClick={() => navigate('/enterprise')} className="btn-ghost text-sm py-4 px-10">
              Enterprise Inquiry
            </button>
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
              <span key={l} className="font-mono text-xs text-ink-muted hover:text-cyan transition-colors cursor-pointer tracking-widest uppercase">
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
