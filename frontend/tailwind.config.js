/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        body: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void:   '#030508',
        deep:   '#080c12',
        panel:  '#0d1420',
        surface:'#111827',
        cyan: {
          DEFAULT: '#00f5d4',
          dim:     '#00c4aa',
          glow:    'rgba(0,245,212,0.15)',
        },
        neon: {
          green:  '#39ff14',
          amber:  '#ffb700',
          red:    '#ff3860',
        },
        ink: {
          primary:   '#e8f0fe',
          secondary: '#7a9abf',
          muted:     '#3a5070',
        },
      },
      boxShadow: {
        cyan:      '0 0 20px rgba(0,245,212,0.25), 0 0 60px rgba(0,245,212,0.1)',
        'cyan-sm': '0 0 10px rgba(0,245,212,0.2)',
        'cyan-lg': '0 0 40px rgba(0,245,212,0.35), 0 0 100px rgba(0,245,212,0.15)',
        panel:     '0 4px 32px rgba(0,0,0,0.6)',
        glass:     'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'grid-cyan': `
          linear-gradient(rgba(0,245,212,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,212,0.04) 1px, transparent 1px)
        `,
        'hero-radial': 'radial-gradient(ellipse 60% 60% at 65% 50%, rgba(0,245,212,0.07) 0%, transparent 70%)',
        'glow-cyan':   'radial-gradient(circle, rgba(0,245,212,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        grid: '60px 60px',
      },
      animation: {
        'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':   'spin 12s linear infinite',
        'float':       'float 6s ease-in-out infinite',
        'scan':        'scan 3s linear infinite',
        'glow-pulse':  'glowPulse 3s ease-in-out infinite',
        'slide-up':    'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':     'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-20px)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(0,245,212,0.2)' },
          '50%':     { boxShadow: '0 0 40px rgba(0,245,212,0.5), 0 0 80px rgba(0,245,212,0.2)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
      backdropBlur: { xs: '2px' },
      borderColor: {
        DEFAULT: 'rgba(0,245,212,0.12)',
      },
    },
  },
  plugins: [],
};
