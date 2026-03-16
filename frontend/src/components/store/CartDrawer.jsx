import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { items, total, itemCount, isOpen, setIsOpen, removeItem, updateQty } = useCart();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 flex flex-col
                       bg-deep border-l border-[rgba(0,245,212,0.12)]"
            style={{ boxShadow: '-20px 0 60px rgba(0,0,0,0.6)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(0,245,212,0.1)]">
              <div>
                <h2 className="font-display font-bold text-lg text-ink-primary tracking-wider">Cart</h2>
                <p className="font-mono text-xs text-ink-muted">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 border border-[rgba(0,245,212,0.15)] flex items-center justify-center
                           text-ink-muted hover:text-cyan hover:border-cyan/40 transition-all"
              >
                <X size={17} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20">
                  <div className="w-16 h-16 border border-[rgba(0,245,212,0.12)] flex items-center justify-center">
                    <ShoppingBag size={24} className="text-ink-muted" />
                  </div>
                  <p className="font-display font-semibold text-sm text-ink-muted tracking-wide">Your cart is empty</p>
                  <button
                    onClick={() => { setIsOpen(false); navigate('/store'); }}
                    className="btn-ghost text-xs py-2.5 px-6"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass p-4 flex gap-4"
                  >
                    {/* Mini device icon */}
                    <div className="w-14 h-14 border border-cyan/15 flex items-center justify-center flex-shrink-0 bg-panel/50">
                      <div className="font-display font-black text-xs text-cyan">TG</div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm text-ink-primary truncate">{item.name}</p>
                      <p className="font-mono text-xs text-ink-muted mt-0.5">${item.price}</p>

                      {/* Qty controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-[rgba(0,245,212,0.15)]">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-ink-muted hover:text-cyan transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-8 text-center font-mono text-xs text-ink-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-ink-muted hover:text-cyan transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="font-display font-bold text-sm text-cyan ml-auto">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-ink-muted hover:text-neon-red transition-colors self-start mt-0.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[rgba(0,245,212,0.1)] space-y-4">
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs text-ink-secondary">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-xs text-ink-secondary">
                    <span>Shipping</span>
                    <span className="text-neon-green">Free</span>
                  </div>
                  <div className="h-px bg-[rgba(0,245,212,0.08)]" />
                  <div className="flex justify-between font-display font-bold text-ink-primary">
                    <span className="text-sm tracking-wider">Total</span>
                    <span className="text-xl text-cyan">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>

                <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-ink-muted">
                  <Lock size={10} />
                  <span>Secured with 256-bit SSL encryption</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
