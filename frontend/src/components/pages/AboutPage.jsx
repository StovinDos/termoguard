import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Users, Target, Lightbulb, ArrowRight, Shield } from 'lucide-react';

const TEAM = [
  { initials: 'AV', name: 'Alexander Vasilev',  role: 'CEO & Co-Founder',          bio: 'Former embedded systems engineer with 12 years in industrial IoT.' },
  { initials: 'MP', name: 'Maria Petrova',       role: 'CTO',                        bio: 'PhD in sensor engineering, pioneered the hysteresis algorithm at TU Sofia.' },
  { initials: 'GD', name: 'Georgi Dimitrov',     role: 'Head of Hardware',           bio: 'Led thermal sensor R&D at Bosch before founding TermoGuard.' },
  { initials: 'EI', name: 'Elena Ivanova',       role: 'Head of Enterprise Sales',   bio: '10+ years deploying industrial monitoring solutions across Europe.' },
];

const VALUES = [
  { icon: Target,    title: 'Precision First',       desc: 'We never compromise on accuracy. Every product ships calibrated to ±0.1°C — that is our promise, not a marketing claim.' },
  { icon: Lightbulb, title: 'Simplicity by Design',  desc: 'Complex sensor technology should feel effortless. We obsess over UX so our customers never have to think about the hardware.' },
  { icon: Shield,    title: 'Built to Last',          desc: 'Our devices are engineered for decades of continuous operation. Quality over quantity, always.' },
  { icon: Users,     title: 'People Over Profit',     desc: 'We are a small team from Sofia building tools we believe in. Every decision starts with what is right for our customers.' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-void pt-[72px]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid mask-radial opacity-40" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.05) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-cyan" />
            <span className="section-label">About TermoGuard</span>
            <div className="w-8 h-px bg-cyan" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                     className="font-display font-black text-5xl lg:text-6xl text-ink-primary leading-tight mb-8">
            Born in Sofia.<br />
            <span className="text-cyan text-glow-cyan">Built for the World.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="text-ink-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            TermoGuard was founded in 2019 by a team of engineers frustrated with expensive,
            overcomplicated industrial sensors. We set out to build something different — a precision
            thermal sensor that anyone could deploy, understand, and trust. Today we protect over
            50,000 installations across 32 countries.
          </motion.p>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 border-t border-[rgba(0,245,212,0.08)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label block mb-4">Our Values</span>
            <h2 className="section-title">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-hover p-6 clip-corner"
              >
                <div className="w-10 h-10 border border-cyan/20 bg-cyan/5 flex items-center justify-center mb-5">
                  <v.icon size={18} className="text-cyan" />
                </div>
                <h3 className="font-display font-bold text-sm text-ink-primary mb-3 tracking-wide">{v.title}</h3>
                <p className="text-ink-secondary text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 border-t border-[rgba(0,245,212,0.08)] bg-deep/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label block mb-4">The Team</span>
            <h2 className="section-title">The People Behind the Sensor</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-hover p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center mx-auto mb-4"
                     style={{ boxShadow: '0 0 20px rgba(0,245,212,0.1)' }}>
                  <span className="font-display font-bold text-lg text-cyan">{member.initials}</span>
                </div>
                <h3 className="font-display font-bold text-sm text-ink-primary mb-1">{member.name}</h3>
                <p className="font-mono text-[10px] text-cyan/70 tracking-widest uppercase mb-3">{member.role}</p>
                <p className="text-ink-secondary text-xs leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HQ & CONTACT ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 border-t border-[rgba(0,245,212,0.08)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-label block mb-4">Find Us</span>
            <h2 className="section-title mb-8">
              Headquartered in <span className="text-cyan text-glow-cyan">Sofia</span>
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: MapPin,
                  label: 'Global Headquarters',
                  value: 'бул. Витоша 89, ет. 4\n1000 София, България',
                },
                {
                  icon: Phone,
                  label: 'Main Office',
                  value: '+359 2 491 2200',
                },
                {
                  icon: Phone,
                  label: 'Enterprise Sales',
                  value: '+359 2 491 2201',
                },
                {
                  icon: Mail,
                  label: 'General Enquiries',
                  value: 'hello@termoguard.io',
                },
                {
                  icon: Mail,
                  label: 'Enterprise',
                  value: 'enterprise@termoguard.io',
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-cyan/60" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">{label}</p>
                    <p className="font-body text-sm text-ink-secondary whitespace-pre-line mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="glass clip-corner p-8 h-72 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 border border-cyan/20 bg-cyan/5 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ boxShadow: '0 0 30px rgba(0,245,212,0.15)' }}>
                <MapPin size={28} className="text-cyan" />
              </div>
              <p className="font-display font-bold text-sm text-ink-primary mb-1">Sofia, Bulgaria</p>
              <p className="font-mono text-[10px] text-ink-muted tracking-widest">42.6977° N, 23.3219° E</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE CTA ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 border-t border-[rgba(0,245,212,0.08)] bg-deep/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-cyan opacity-20" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-cyan" />
            <span className="section-label">Deploy at Scale</span>
            <div className="w-8 h-px bg-cyan" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     className="font-display font-black text-4xl lg:text-5xl text-ink-primary mb-6">
            Need TermoGuard<br />
            <span className="text-cyan text-glow-cyan">at Enterprise Scale?</span>
          </motion.h2>
          <p className="text-ink-secondary text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Whether you need 50 sensors or 50,000, our enterprise team will design a
            custom deployment plan, SLA, and pricing structure tailored to your facility.
          </p>
          <motion.button
            onClick={() => navigate('/enterprise')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary inline-flex items-center gap-3 text-sm py-4 px-12"
          >
            Contact Enterprise Team
            <ArrowRight size={16} />
          </motion.button>
          <p className="font-mono text-[10px] text-ink-muted mt-6 tracking-widest">
            Response guaranteed within 1 business day · Based in Sofia, Bulgaria
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(0,245,212,0.08)] py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-display font-bold text-sm tracking-[0.15em] text-cyan">
            TERMO<span className="text-ink-muted">GUARD</span>
          </span>
          <p className="font-mono text-xs text-ink-muted tracking-widest">
            © {new Date().getFullYear()} TermoGuard Technologies EOOD. Registered in Bulgaria.
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
