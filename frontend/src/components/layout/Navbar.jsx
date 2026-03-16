import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Product',    href: '/' },
  { label: 'About Us',   href: '/about' },
  { label: 'Store',      href: '/store',      protected: true },
  { label: 'Enterprise', href: '/enterprise' },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isAuthenticated, user, logout, demoMode } = useAuth();
  const { itemCount, setIsOpen } = useCart();
  const [scrolled,    setScrolled]   = useState(false);
  const [mobileOpen,  setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (link) => {
    setMobileOpen(false);
    if (link.protected && !isAuthenticated) {
      navigate(`/auth?redirect=${link.href}`);
    } else {
      navigate(link.href);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-void/95 backdrop-blur-xl border-b border-[rgba(0,245,212,0.1)]' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="font-display font-bold text-lg tracking-[0.15em] text-cyan hover:opacity-80 transition-opacity"
          style={{ textShadow: '0 0 20px rgba(0,245,212,0.5)' }}
        >
          TERMO<span className="text-ink-primary">GUARD</span>
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link)}
                className={`nav-link ${location.pathname === link.href ? 'active text-cyan' : ''}`}
              >
                {link.label}
                {link.protected && !isAuthenticated && (
                  <span className="ml-1.5 text-[8px] text-ink-muted tracking-widest">[LOGIN]</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 font-mono text-xs text-ink-secondary">
                {/* Demo mode / live mode indicator */}
                {demoMode ? (
                  <span className="flex items-center gap-1.5 text-neon-amber">
                    <WifiOff size={11} />
                    <span className="text-[10px] tracking-widest">DEMO</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-neon-green">
                    <Wifi size={11} />
                    <span className="text-[10px] tracking-widest">LIVE</span>
                  </span>
                )}
                <User size={14} className="text-cyan ml-1" />
                <span>{user?.firstName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 font-mono text-xs text-ink-muted hover:text-neon-red transition-colors"
              >
                <LogOut size={13} />
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/auth')} className="btn-ghost text-xs py-2.5 px-5">
              Sign In
            </button>
          )}

          {/* Cart button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 font-mono text-xs tracking-widest uppercase
                       border border-[rgba(0,245,212,0.2)] text-ink-secondary px-4 py-2.5
                       hover:border-cyan/50 hover:text-cyan transition-all duration-200 clip-angled"
          >
            <ShoppingCart size={14} />
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyan text-void text-[10px] font-bold font-display
                               w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-ink-secondary hover:text-cyan transition-colors"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-deep/95 backdrop-blur-xl border-b border-[rgba(0,245,212,0.1)]"
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link)}
                  className={`nav-link text-left ${location.pathname === link.href ? 'active text-cyan' : ''}`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-[rgba(0,245,212,0.1)] flex items-center gap-4">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="btn-ghost text-xs py-2 px-5">Logout</button>
                ) : (
                  <button onClick={() => { navigate('/auth'); setMobileOpen(false); }} className="btn-primary text-xs py-3 px-6">
                    Sign In
                  </button>
                )}
                <button onClick={() => { setIsOpen(true); setMobileOpen(false); }} className="relative">
                  <ShoppingCart size={20} className="text-ink-secondary" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-cyan text-void text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
