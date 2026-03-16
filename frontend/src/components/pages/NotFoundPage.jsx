import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-void pt-[72px] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid mask-radial opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-6"
      >
        <div className="font-display font-black text-[160px] leading-none text-cyan/5 select-none mb-4"
             style={{ textShadow: '0 0 80px rgba(0,245,212,0.1)' }}>
          404
        </div>
        <h1 className="font-display font-bold text-2xl text-ink-primary mb-3 -mt-12">Signal Lost</h1>
        <p className="font-mono text-sm text-ink-muted mb-10">The page you're looking for doesn't exist in this sector.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Return to Base</button>
      </motion.div>
    </div>
  );
}
