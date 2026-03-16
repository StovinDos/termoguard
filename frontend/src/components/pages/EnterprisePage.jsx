import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Factory, Users, Package, Mail, Phone,
  Globe, ChevronRight, Shield, Zap, BarChart2, Check,
  AlertCircle, Send
} from 'lucide-react';
import toast from 'react-hot-toast';

const INDUSTRIES = [
  'Manufacturing', 'Food & Beverage', 'Pharmaceuticals', 'Data Centers',
  'Cold Chain Logistics', 'Oil & Gas', 'Automotive', 'Aerospace',
  'Healthcare', 'Agriculture', 'Chemical Processing', 'Other',
];

const FACILITY_SIZES = [
  'Small (<500 m²)', 'Medium (500–5,000 m²)', 'Large (5,000–50,000 m²)', 'Enterprise (>50,000 m²)',
];

const VOLUMES = [
  '10–50 units', '51–200 units', '201–1,000 units', '1,001–10,000 units', '10,000+ units',
];

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-2">
        {label}{required && <span className="text-cyan ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="input-field appearance-none cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237a9abf' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── Enterprise stats bar ───────────────────────────────────────────────────
const ENTERPRISE_STATS = [
  { value: '500+',  label: 'Enterprise Clients' },
  { value: '2M+',   label: 'Sensors Deployed' },
  { value: '99.97%', label: 'SLA Uptime' },
  { value: '24/7',  label: 'Dedicated Support' },
];

// ── Trust logos placeholder ────────────────────────────────────────────────
const CLIENTS = ['SIEMENS', 'BOSCH', 'ABB', 'HONEYWELL', 'SCHNEIDER', 'EMERSON'];

export default function EnterprisePage() {
  const location = useLocation();
  const [form, setForm] = useState({
    companyName: '', contactName: '', email: '', phone: '',
    industry: '', facilitySize: '', estimatedVolume: '',
    deploymentTimeline: '', message: '',
  });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    }
  }, [location.hash]);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.companyName)      errs.companyName      = 'Required';
    if (!form.contactName)      errs.contactName      = 'Required';
    if (!form.email || !/.+@.+\..+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.industry)         errs.industry         = 'Required';
    if (!form.facilitySize)     errs.facilitySize     = 'Required';
    if (!form.estimatedVolume)  errs.estimatedVolume  = 'Required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    // Brief delay gives the loading spinner a moment to render before showing success
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      toast.success('Inquiry submitted. Our team will contact you within 24 hours.');
    }, 600);
  };

  // ── Success state ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center pt-[72px] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass clip-corner p-12 max-w-lg w-full text-center"
        >
          <div className="w-16 h-16 border border-cyan/30 bg-cyan/5 flex items-center justify-center mx-auto mb-6"
               style={{ boxShadow: '0 0 30px rgba(0,245,212,0.15)' }}>
            <Check size={28} className="text-cyan" />
          </div>
          <h2 className="font-display font-black text-2xl text-ink-primary mb-3">Inquiry Received</h2>
          <p className="text-ink-secondary text-sm leading-relaxed mb-6">
            Thank you, <span className="text-ink-primary">{form.contactName || 'valued client'}</span>. 
            A TermoGuard enterprise specialist will reach out to <span className="text-cyan">{form.email}</span> within 
            one business day.
          </p>
          <div className="border border-[rgba(0,245,212,0.1)] bg-panel/50 p-4 font-mono text-xs text-ink-muted mb-8 text-left space-y-1">
            <div className="flex justify-between"><span>Company</span><span className="text-ink-secondary">{form.companyName}</span></div>
            <div className="flex justify-between"><span>Industry</span><span className="text-ink-secondary">{form.industry}</span></div>
            <div className="flex justify-between"><span>Est. Volume</span><span className="text-ink-secondary">{form.estimatedVolume}</span></div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setSubmitted(false)} className="btn-ghost text-xs py-3 px-6">New Inquiry</button>
            <button onClick={() => window.location.href = '/'} className="btn-primary text-xs py-3 px-6">Back to Home</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-[72px] pb-24 overflow-hidden">
        {/* Industrial grid — denser, more monochrome */}
        <div className="absolute inset-0"
             style={{
               backgroundImage: `linear-gradient(rgba(122,154,191,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(122,154,191,0.05) 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(ellipse 100% 80% at 50% 0%, black, transparent)',
             }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/60 to-void" />

        {/* Corner brackets — industrial framing */}
        <div className="absolute top-[72px] left-6 w-12 h-12 border-t-2 border-l-2 border-ink-muted/20" />
        <div className="absolute top-[72px] right-6 w-12 h-12 border-t-2 border-r-2 border-ink-muted/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-ink-secondary/40" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-secondary">
              Enterprise & Industrial Division
            </span>
            <div className="w-8 h-px bg-ink-secondary/40" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-5xl lg:text-7xl text-ink-primary leading-[1.05] mb-6 max-w-4xl"
          >
            DEPLOY AT
            <br />
            <span className="text-ink-secondary">INDUSTRIAL</span>
            <br />
            <span className="text-cyan text-glow-cyan">SCALE.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-ink-secondary text-lg max-w-2xl leading-relaxed mb-10"
          >
            Tailored solutions for industry leaders. Connect with our specialist team to scale your operations.
          </motion.p>

          {/* Key enterprise badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { icon: Shield, label: 'SOC 2 Type II' },
              { icon: Zap,    label: 'SCADA / OPC-UA Ready' },
              { icon: Globe,  label: 'Global Deployment' },
              { icon: BarChart2, label: 'Custom SLA' },
            ].map(({ icon: Icon, label }) => (
              <div key={label}
                   className="flex items-center gap-2 border border-ink-muted/20 bg-deep/40 px-3 py-2">
                <Icon size={12} className="text-ink-secondary" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-ink-secondary">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="border-y border-ink-muted/10 bg-deep/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {ENTERPRISE_STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="font-display font-black text-3xl text-ink-primary mb-1">{value}</div>
                <div className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT LOGOS ─────────────────────────────────────────────────── */}
      <section className="py-12 px-6 lg:px-12 border-b border-ink-muted/10">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase text-center mb-8">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {CLIENTS.map(c => (
              <div key={c}
                   className="font-display font-bold text-sm tracking-[0.2em] text-ink-muted/40 hover:text-ink-muted/60 transition-colors">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ENTERPRISE ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-secondary block mb-3">
              Enterprise Advantages
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink-primary">
              Built for Mission-Critical Infrastructure
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Factory,
                title: 'Industrial Hardening',
                desc: 'IP67-rated enclosures, -40°C to +125°C operational range, EMI shielding, and ATEX certification for hazardous environments.',
                bullets: ['ATEX Zone 1 & 2', 'Vibration resistant', 'Corrosion-proof housing'],
              },
              {
                icon: BarChart2,
                title: 'Enterprise Dashboard',
                desc: 'Centralized control plane for managing thousands of sensors. Role-based access, audit logs, and automated compliance reporting.',
                bullets: ['SCADA integration', 'REST + MQTT APIs', 'Custom alerting rules'],
              },
              {
                icon: Shield,
                title: 'Security & Compliance',
                desc: 'SOC 2 Type II certified infrastructure with end-to-end AES-256 encryption, on-premise deployment option, and full data sovereignty.',
                bullets: ['ISO 27001', 'GDPR compliant', 'Air-gap deployment'],
              },
            ].map(({ icon: Icon, title, desc, bullets }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="border border-ink-muted/15 bg-deep/30 p-8 hover:border-ink-muted/30 transition-colors group"
              >
                <div className="w-10 h-10 border border-ink-muted/20 flex items-center justify-center mb-6
                                group-hover:border-ink-muted/40 transition-colors">
                  <Icon size={20} className="text-ink-secondary" />
                </div>
                <h3 className="font-display font-bold text-base text-ink-primary mb-3">{title}</h3>
                <p className="text-ink-secondary text-sm leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2">
                  {bullets.map(b => (
                    <li key={b} className="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
                      <ChevronRight size={11} className="text-ink-secondary/50" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ─────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6 lg:px-12 bg-deep/20 border-t border-ink-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_560px] gap-16 items-start">

            {/* Left — info panel */}
            <div className="lg:sticky lg:top-28">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-secondary block mb-4">
                Get in Touch
              </span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink-primary mb-6 leading-tight">
                Request an
                <br />
                Enterprise Quote
              </h2>
              <p className="text-ink-secondary text-sm leading-relaxed mb-10 max-w-md">
                Fill out the form and a TermoGuard solutions engineer will prepare a 
                tailored deployment proposal — including volume pricing, integration 
                roadmap, and SLA terms — within one business day.
              </p>

              {/* Contact channels */}
              <div className="space-y-5 mb-10">
                {[
                  { icon: Mail,  label: 'Enterprise Sales',  value: 'info.enterprise.vision@gmail.com' },
                  { icon: Phone, label: 'Direct Line',        value: '+359 88 123 4567' },
                  { icon: Globe, label: 'Global HQ',          value: 'Sofia, Bulgaria' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-9 h-9 border border-ink-muted/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-ink-secondary/60" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">{label}</p>
                      <p className="font-body text-sm text-ink-secondary">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Process timeline */}
              <div className="border border-ink-muted/10 p-6 bg-deep/40">
                <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-5">What Happens Next</p>
                <div className="space-y-4">
                  {[
                    { step: '01', label: 'Inquiry Review',      sub: 'Within 4 business hours' },
                    { step: '02', label: 'Solutions Call',       sub: '30-min discovery session' },
                    { step: '03', label: 'Custom Proposal',      sub: 'Tailored to your facility' },
                    { step: '04', label: 'Pilot Deployment',     sub: 'Free 30-day trial — up to 20 sensors' },
                  ].map(({ step, label, sub }) => (
                    <div key={step} className="flex gap-4 items-start">
                      <span className="font-display font-bold text-xs text-ink-muted/50 w-6 flex-shrink-0 mt-0.5">{step}</span>
                      <div>
                        <p className="font-body text-sm text-ink-secondary">{label}</p>
                        <p className="font-mono text-[10px] text-ink-muted">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              className="border border-ink-muted/15 bg-deep/40 p-8 space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-ink-muted/10 pb-6">
                <Building2 size={18} className="text-ink-secondary" />
                <h3 className="font-display font-bold text-base text-ink-primary tracking-wider">
                  Enterprise Inquiry Form
                </h3>
              </div>

              {/* Company details */}
              <div className="space-y-4">
                <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">Company Information</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Company Name" required>
                    <input
                      type="text" placeholder="Acme Industries Ltd."
                      value={form.companyName} onChange={set('companyName')}
                      className={`input-field ${errors.companyName ? 'border-neon-red/50' : ''}`}
                    />
                    {errors.companyName && <p className="font-mono text-[10px] text-neon-red mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.companyName}</p>}
                  </Field>

                  <Field label="Industry / Sector" required>
                    <Select
                      value={form.industry} onChange={set('industry')}
                      options={INDUSTRIES} placeholder="Select industry..."
                    />
                    {errors.industry && <p className="font-mono text-[10px] text-neon-red mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.industry}</p>}
                  </Field>
                </div>

                <Field label="Facility Size" required>
                  <Select
                    value={form.facilitySize} onChange={set('facilitySize')}
                    options={FACILITY_SIZES} placeholder="Select facility size..."
                  />
                  {errors.facilitySize && <p className="font-mono text-[10px] text-neon-red mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.facilitySize}</p>}
                </Field>

                <Field label="Estimated Volume Needed" required>
                  <Select
                    value={form.estimatedVolume} onChange={set('estimatedVolume')}
                    options={VOLUMES} placeholder="Select estimated volume..."
                  />
                  {errors.estimatedVolume && <p className="font-mono text-[10px] text-neon-red mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.estimatedVolume}</p>}
                </Field>
              </div>

              {/* Contact person */}
              <div className="space-y-4 pt-2 border-t border-ink-muted/10">
                <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">Contact Person</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name" required>
                    <input
                      type="text" placeholder="Jane Smith"
                      value={form.contactName} onChange={set('contactName')}
                      className={`input-field ${errors.contactName ? 'border-neon-red/50' : ''}`}
                    />
                    {errors.contactName && <p className="font-mono text-[10px] text-neon-red mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.contactName}</p>}
                  </Field>

                  <Field label="Work Email" required>
                    <input
                      type="email" placeholder="jane@company.com"
                      value={form.email} onChange={set('email')}
                      className={`input-field ${errors.email ? 'border-neon-red/50' : ''}`}
                    />
                    {errors.email && <p className="font-mono text-[10px] text-neon-red mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.email}</p>}
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Phone Number">
                    <input
                      type="tel" placeholder="+1 (555) 000-0000"
                      value={form.phone} onChange={set('phone')}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Deployment Timeline">
                    <Select
                      value={form.deploymentTimeline} onChange={set('deploymentTimeline')}
                      options={['Immediately', '1–3 months', '3–6 months', '6–12 months', 'Planning stage']}
                      placeholder="When do you need this?"
                    />
                  </Field>
                </div>
              </div>

              {/* Message */}
              <Field label="Additional Requirements">
                <textarea
                  rows={4}
                  placeholder="Describe your use case, existing infrastructure, special requirements, or any questions for our team..."
                  value={form.message} onChange={set('message')}
                  className="input-field resize-none"
                />
              </Field>

              {/* Consent */}
              <div className="flex items-start gap-3 p-4 border border-ink-muted/10 bg-deep/40">
                <div className="w-4 h-4 border border-ink-muted/30 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <div className="w-2 h-2 bg-ink-muted/40" />
                </div>
                <p className="font-mono text-[10px] text-ink-muted leading-relaxed">
                  By submitting this form, you agree that TermoGuard may contact you regarding your inquiry.
                  Your data is handled in accordance with our Privacy Policy and GDPR regulations.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 font-display font-semibold
                           text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50
                           border border-ink-primary/30 text-ink-primary hover:bg-ink-primary/5
                           hover:border-ink-primary/60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-ink-primary/30 border-t-ink-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    Submit Enterprise Inquiry
                  </>
                )}
              </button>

              <p className="text-center font-mono text-[10px] text-ink-muted">
                Response guaranteed within 1 business day
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-ink-muted/10 py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-sm tracking-[0.15em] text-cyan">
            TERMO<span className="text-ink-muted">GUARD</span>
            <span className="ml-3 text-[10px] text-ink-muted font-mono tracking-widest">ENTERPRISE</span>
          </span>
          <p className="font-mono text-xs text-ink-muted">© {new Date().getFullYear()} TermoGuard Technologies Inc.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security'].map(l => (
              <span key={l} className="font-mono text-xs text-ink-muted hover:text-ink-secondary transition-colors cursor-pointer tracking-widest uppercase">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
