import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Shield, Zap, Check, Filter, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency, CURRENCIES } from '@/context/CurrencyContext';
import { useAuthModal } from '@/context/AuthModalContext';

const PRODUCTS = [
  {
    id: 1, name: 'TermoGuard Core',   tagline: 'Smart Home Essentials', price: 49.99,  originalPrice: 69.99,
    badge: 'Best Seller', badgeColor: 'bg-cyan text-void',
    rating: 4.9,  reviews: 1247,
    description: 'Perfect for home use. Monitor up to 3 rooms with 0.1° precision and real-time mobile alerts.',
    features: ['0.1° Accuracy', '1-Second Polling', 'Wi-Fi Enabled', 'Mobile App'],
    color: 'cyan', accentHex: '#00f5d4',
  },
  {
    id: 2, name: 'TermoGuard Pro',    tagline: 'Professional Grade',    price: 119.99, originalPrice: 149.99,
    badge: 'Most Popular', badgeColor: 'bg-neon-amber text-void',
    rating: 4.95, reviews: 832,
    description: 'Advanced sensor array for workshops, server rooms, and small facilities. Supports 10 monitoring zones.',
    features: ['10 Zones', 'SMS + Email Alerts', 'API Access', 'Data Export'],
    color: 'amber', accentHex: '#ffb700',
  },
  {
    id: 3, name: 'TermoGuard Mesh',   tagline: 'Multi-Sensor Network',  price: 199.99, originalPrice: null,
    badge: 'New', badgeColor: 'bg-neon-green text-void',
    rating: 4.8,  reviews: 214,
    description: 'Deploy a network of 5 synchronized sensors. Ideal for warehouses, gyms, and multi-room monitoring.',
    features: ['5 Sensors', 'Mesh Networking', 'Dashboard', '3-Year Warranty'],
    color: 'green', accentHex: '#39ff14',
  },
  {
    id: 4, name: 'TermoGuard Shield', tagline: 'Industrial Protection', price: 299.99, originalPrice: null,
    badge: 'Industrial', badgeColor: 'bg-ink-secondary/20 text-ink-secondary border border-ink-secondary/30',
    rating: 5.0,  reviews: 89,
    description: 'Ruggedized for harsh environments. IP67 rated, -40° to +125°C range, with 4G LTE backup connectivity.',
    features: ['IP67 Rated', '-40° to 125°C', '4G LTE Backup', 'SCADA Integration'],
    color: 'secondary', accentHex: '#7a9abf',
  },
];

// Find the highest-priced product ID once
const MAX_PRICE_ID = PRODUCTS.reduce((max, p) => p.price > max.price ? p : max, PRODUCTS[0]).id;

// ── Currency Switcher ──────────────────────────────────────────────────────
function CurrencySwitcher() {
  const { currency, setCurrency, currencies } = useCurrency();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
              className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase border border-[rgba(0,245,212,0.2)] text-ink-secondary px-4 py-2.5 hover:border-cyan/50 hover:text-cyan transition-all duration-200">
        {currency} <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-50 glass border border-[rgba(0,245,212,0.2)] min-w-[200px]">
          {Object.entries(currencies).map(([code, { label }]) => (
            <button key={code} onClick={() => { setCurrency(code); setOpen(false); }}
                    className={`w-full text-left px-4 py-3 font-mono text-xs tracking-wide hover:bg-cyan/10 hover:text-cyan transition-colors
                               ${currency === code ? 'text-cyan bg-cyan/5' : 'text-ink-secondary'}`}>
              {label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ── Product card ───────────────────────────────────────────────────────────
function ProductCard({ product, index }) {
  const { addItem }       = useCart();
  const { isAuthenticated } = useAuth();
  const { format }        = useCurrency();
  const { openModal }     = useAuthModal();
  const [adding, setAdding] = useState(false);
  const isPremium = product.id === MAX_PRICE_ID;

  const textColor = {
    cyan: 'text-cyan', amber: 'text-neon-amber', green: 'text-neon-green', secondary: 'text-ink-secondary',
  }[product.color];

  const handleAdd = async () => {
    if (!isAuthenticated) {
      // Trigger login modal; after success, add item automatically
      openModal(() => addItem(product));
      return;
    }
    setAdding(true);
    await new Promise(r => setTimeout(r, 400));
    addItem(product);
    setAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="product-card flex flex-col h-full"
    >
      {/* Image area */}
      <div className="relative h-52 flex-shrink-0 flex items-center justify-center overflow-hidden"
           style={{ background: `radial-gradient(circle at 50% 50%, ${product.accentHex}08 0%, transparent 70%)` }}>
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
        <span className={`absolute top-4 left-4 text-[10px] font-display font-bold tracking-widest px-2.5 py-1 ${product.badgeColor}`}>
          {product.badge}
        </span>
        {/* Premium crown badge */}
        {isPremium && (
          <span className="absolute top-4 right-4 text-[9px] font-display font-bold tracking-widest px-2 py-1 bg-red-600 text-white">
            PREMIUM
          </span>
        )}
        <motion.div animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                    className="relative w-28 h-28">
          <div className="absolute inset-0 clip-corner border"
               style={{ background: 'linear-gradient(135deg,#0d1420 0%,#080c12 100%)', borderColor: `${product.accentHex}30`, boxShadow: `0 0 40px ${product.accentHex}15` }}>
            <div className="absolute inset-3 border flex items-center justify-center flex-col gap-1"
                 style={{ borderColor: `${product.accentHex}20` }}>
              <div className="font-mono text-[8px] text-ink-muted">TEMP</div>
              <div className={`font-display font-black text-xl ${textColor}`} style={{ textShadow: `0 0 12px ${product.accentHex}80` }}>21.4°</div>
              <div className="w-full h-0.5 bg-deep mt-1">
                <motion.div className="h-full" animate={{ scaleX: [0.3,0.9,0.5,0.7,0.4] }}
                            transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: 'left', background: product.accentHex }} />
              </div>
            </div>
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse"
                 style={{ background: product.accentHex, boxShadow: `0 0 6px ${product.accentHex}` }} />
          </div>
        </motion.div>
      </div>

      {/* Content — flex-col with flex-1 so all cards stretch equally */}
      <div className="p-6 flex flex-col flex-1">

        {/* Name & rating — fixed top */}
        <div className="mb-1">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-muted">{product.tagline}</p>
          <h3 className="font-display font-bold text-lg text-ink-primary">{product.name}</h3>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'text-neon-amber fill-neon-amber' : 'text-ink-muted'} />
            ))}
          </div>
          <span className="font-mono text-[10px] text-ink-muted">{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>

        {/* Description — flex-1 pushes footer down equally on all cards */}
        <p className="text-ink-secondary text-sm leading-relaxed mb-4 flex-1">{product.description}</p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-1.5 mb-5">
          {product.features.map(f => (
            <div key={f} className="flex items-center gap-1.5">
              <Check size={11} className={textColor} />
              <span className="font-mono text-[10px] text-ink-secondary tracking-wide">{f}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA — always at bottom due to mt-auto via flex-1 above */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className={`font-display font-black text-2xl ${textColor}`}>{format(product.price)}</div>
            {product.originalPrice && (
              <div className="font-mono text-xs text-ink-muted line-through">{format(product.originalPrice)}</div>
            )}
          </div>

          {/* Button — RED for most expensive, accent color for others */}
          {isPremium ? (
            <button
              onClick={handleAdd}
              disabled={adding}
              className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-5 py-3
                         bg-red-600 text-white border border-red-500 hover:bg-red-500
                         transition-all duration-300 disabled:opacity-50"
              style={{ clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}
            >
              {adding ? <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" /> : <ShoppingCart size={14} />}
              {!isAuthenticated ? 'Login to Buy' : 'Add to Cart'}
            </button>
          ) : (
            <button
              onClick={handleAdd}
              disabled={adding}
              className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-5 py-3
                         transition-all duration-300 disabled:opacity-50"
              style={{ border: `1px solid ${product.accentHex}40`, color: product.accentHex, clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}
              onMouseEnter={e => e.currentTarget.style.background = `${product.accentHex}12`}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {adding ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <ShoppingCart size={14} />}
              {!isAuthenticated ? 'Login to Buy' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Store Page ─────────────────────────────────────────────────────────────
export default function StorePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { setIsOpen } = useCart();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.color === filter);

  return (
    <div className="min-h-screen bg-void pt-[72px]">

      {/* Header */}
      <div className="relative border-b border-[rgba(0,245,212,0.08)] py-20 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid mask-radial opacity-30" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-cyan" />
            <span className="section-label">Consumer Store</span>
          </motion.div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="section-title">Choose Your <span className="text-cyan text-glow-cyan">Guardian</span></h1>
              <p className="text-ink-secondary mt-3 max-w-lg">
                {isAuthenticated
                  ? <>Welcome back, <span className="text-ink-primary">{user?.firstName}</span>. Every TermoGuard includes free shipping, a 30-day return window, and lifetime firmware updates.</>
                  : <>Browse our full range. <span className="text-cyan cursor-pointer hover:underline" onClick={() => navigate('/auth')}>Sign in</span> to add items to your cart.</>}
              </p>
            </motion.div>
            <div className="flex items-center gap-3 flex-wrap">
              <CurrencySwitcher />
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-ink-muted" />
                {[
                  { key: 'all', label: 'All' }, { key: 'cyan', label: 'Home' },
                  { key: 'amber', label: 'Pro' }, { key: 'green', label: 'Mesh' },
                  { key: 'secondary', label: 'Industrial' },
                ].map(opt => (
                  <button key={opt.key} onClick={() => setFilter(opt.key)}
                          className={`font-mono text-[10px] tracking-widest uppercase px-3 py-2 border transition-all duration-200
                                      ${filter === opt.key ? 'border-cyan/50 text-cyan bg-cyan/5' : 'border-[rgba(0,245,212,0.12)] text-ink-muted hover:text-ink-secondary'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products — use items-stretch so all cards in a row are equal height */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-t border-[rgba(0,245,212,0.08)] py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Shield,  label: 'Secure Payments', sub: 'SSL / 256-bit encryption' },
            { icon: Zap,     label: 'Free Shipping',    sub: 'Orders over $50' },
            { icon: Check,   label: '30-Day Returns',   sub: 'No questions asked' },
            { icon: Star,    label: '5-Star Support',   sub: '24/7 technical help' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-cyan/60" />
              </div>
              <div>
                <p className="font-display font-semibold text-xs text-ink-primary tracking-wide">{label}</p>
                <p className="font-mono text-[10px] text-ink-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
