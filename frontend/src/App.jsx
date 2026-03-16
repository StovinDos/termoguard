import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import Navbar from '@/components/layout/Navbar';
import CartDrawer from '@/components/store/CartDrawer';

// Pages
import LandingPage    from '@/components/pages/LandingPage';
import AuthPage       from '@/components/pages/AuthPage';
import StorePage      from '@/components/pages/StorePage';
import CheckoutPage   from '@/components/pages/CheckoutPage';
import EnterprisePage from '@/components/pages/EnterprisePage';
import NotFoundPage   from '@/components/pages/NotFoundPage';

// ─── Protected Route Guard ─────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
          <p className="font-mono text-xs text-ink-muted tracking-widest uppercase">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve intended destination for post-login redirect
    return <Navigate to={`/auth?redirect=${location.pathname}`} replace />;
  }

  return children;
}

// ─── Inner App (needs AuthContext) ────────────────────────────────────────
function AppRoutes() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Routes>
        {/* Public Routes */}
        <Route path="/"           element={<LandingPage />} />
        <Route path="/auth"       element={<AuthPage />} />
        <Route path="/enterprise" element={<EnterprisePage />} />

        {/* Store — publicly browsable; auth required only at purchase */}
        <Route path="/store" element={<StorePage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
