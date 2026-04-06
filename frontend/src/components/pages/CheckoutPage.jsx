import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Check, ChevronLeft, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

function FormSection({ title, children }) {
  return (
    <div className="glass clip-corner p-6 space-y-5">
      <h3 className="font-display font-semibold text-sm text-ink-primary tracking-wider border-b border-[rgba(0,245,212,0.08)] pb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FieldRow({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, placeholder, value, onChange, type = 'text', maxLength, className = '' }) {
  return (
    <div className={className}>
      <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="input-field"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const navigate  = useNavigate();
  const { items, total, clearCart } = useCart();
  const [step, setStep]       = useState(1); // 1: info, 2: payment, 3: success
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({ firstName: '', lastName: '', address: '', city: '', zip: '', country: 'US' });
  const [payment,  setPayment]  = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' });

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center pt-[72px]">
        <div className="text-center">
          <p className="font-display text-ink-muted text-lg mb-6">Your cart is empty</p>
          <button onClick={() => navigate('/store')} className="btn-primary">Browse Products</button>
        </div>
      </div>
    );
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulated API call — replace with real payment gateway
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep(3);
    clearCart();
  };

  // ── Success Screen ─────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center pt-[72px] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass clip-corner p-12 max-w-lg w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mx-auto mb-6"
               style={{ boxShadow: '0 0 30px rgba(57,255,20,0.2)' }}>
            <Check size={28} className="text-neon-green" />
          </div>
          <h2 className="font-display font-black text-2xl text-ink-primary mb-3">Order Confirmed</h2>
          <p className="text-ink-secondary text-sm mb-2">
            Your TermoGuard order has been placed successfully.
          </p>
          <p className="font-mono text-[10px] text-ink-muted mb-8">
            A confirmation email has been dispatched to your registered address.
          </p>
          <div className="border border-neon-green/20 bg-neon-green/5 p-4 mb-8 font-mono text-xs text-neon-green">
            ORDER #TG-{Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
          <button onClick={() => navigate('/')} className="btn-primary w-full">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void pt-[72px]">
      {/* Header */}
      <div className="border-b border-[rgba(0,245,212,0.08)] py-8 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <button
            onClick={() => step === 1 ? navigate('/store') : setStep(1)}
            className="flex items-center gap-1.5 font-mono text-xs text-ink-muted hover:text-cyan transition-colors"
          >
            <ChevronLeft size={15} />
            {step === 1 ? 'Back to Store' : 'Back to Shipping'}
          </button>
          <div className="flex items-center gap-3 ml-auto">
            {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Payment' }].map(({ n, label }) => (
              <React.Fragment key={n}>
                <div className={`flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase ${step >= n ? 'text-cyan' : 'text-ink-muted'}`}>
                  <div className={`w-5 h-5 border flex items-center justify-center text-[9px] font-bold
                                   ${step > n ? 'bg-cyan border-cyan text-void' : step === n ? 'border-cyan text-cyan' : 'border-ink-muted/30'}`}>
                    {step > n ? <Check size={10} /> : n}
                  </div>
                  {label}
                </div>
                {n < 2 && <div className={`w-8 h-px ${step > n ? 'bg-cyan' : 'bg-ink-muted/20'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">

          {/* Left — Forms */}
          <div className="space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="font-display font-bold text-2xl text-ink-primary">Shipping Information</h2>
                <FormSection title="Contact Details">
                  <FieldRow>
                    <Field label="First Name" placeholder="John" value={shipping.firstName}
                           onChange={e => setShipping(p => ({ ...p, firstName: e.target.value }))} />
                    <Field label="Last Name"  placeholder="Doe"  value={shipping.lastName}
                           onChange={e => setShipping(p => ({ ...p, lastName: e.target.value }))} />
                  </FieldRow>
                </FormSection>
                <FormSection title="Delivery Address">
                  <Field label="Street Address" placeholder="123 Main Street, Apt 4B" className="sm:col-span-2"
                         value={shipping.address} onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} />
                  <FieldRow>
                    <Field label="City"     placeholder="New York" value={shipping.city}
                           onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} />
                    <Field label="ZIP Code" placeholder="10001"    value={shipping.zip}
                           onChange={e => setShipping(p => ({ ...p, zip: e.target.value }))} />
                  </FieldRow>
                </FormSection>
                <button onClick={() => setStep(2)} className="btn-primary w-full flex items-center justify-center gap-2">
                  Continue to Payment
                  <CreditCard size={16} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleOrder}
                className="space-y-6"
              >
                <h2 className="font-display font-bold text-2xl text-ink-primary">Payment Details</h2>

                <FormSection title="Card Information">
                  <div className="flex items-center gap-2 p-3 border border-cyan/10 bg-cyan/5 mb-2">
                    <Lock size={13} className="text-cyan flex-shrink-0" />
                    <p className="font-mono text-[10px] text-cyan/70">
                      This is a demo checkout. No real payment is processed.
                    </p>
                  </div>

                  <Field
                    label="Card Number" placeholder="4242 4242 4242 4242" maxLength={19}
                    value={payment.cardNumber}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setPayment(p => ({ ...p, cardNumber: v }));
                    }}
                  />
                  <Field label="Cardholder Name" placeholder="John Doe"
                         value={payment.cardName} onChange={e => setPayment(p => ({ ...p, cardName: e.target.value }))} />
                  <FieldRow>
                    <Field label="Expiry Date" placeholder="MM / YY" maxLength={7}
                           value={payment.expiry}
                           onChange={e => {
                             let v = e.target.value.replace(/\D/g, '');
                             if (v.length >= 2) v = v.slice(0,2) + ' / ' + v.slice(2,4);
                             setPayment(p => ({ ...p, expiry: v }));
                           }} />
                    <Field label="CVV" placeholder="•••" maxLength={4} type="password"
                           value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'') }))} />
                  </FieldRow>

                  {/* Card type logos placeholder */}
                  <div className="flex gap-2 pt-2">
                    {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(c => (
                      <div key={c} className="border border-[rgba(0,245,212,0.12)] px-2.5 py-1 font-mono text-[9px] text-ink-muted">
                        {c}
                      </div>
                    ))}
                  </div>
                </FormSection>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-void/50 border-t-void rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      Place Order — ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="space-y-4 lg:sticky lg:top-24 self-start">
            <h3 className="font-display font-semibold text-sm text-ink-primary tracking-wider">Order Summary</h3>

            <div className="glass clip-corner divide-y divide-[rgba(0,245,212,0.06)]">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 border border-cyan/15 flex items-center justify-center flex-shrink-0 bg-panel/50">
                    <span className="font-display font-black text-[9px] text-cyan">TG</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-xs font-semibold text-ink-primary truncate">{item.name}</p>
                    <p className="font-mono text-[10px] text-ink-muted">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono text-sm text-ink-primary">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="p-4 space-y-2">
                <div className="flex justify-between font-mono text-xs text-ink-secondary">
                  <span>Subtotal</span><span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-mono text-xs text-ink-secondary">
                  <span>Shipping</span><span className="text-neon-green">Free</span>
                </div>
                <div className="flex justify-between font-mono text-xs text-ink-secondary">
                  <span>Tax</span><span>${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between p-4 font-display font-bold">
                <span className="text-sm text-ink-primary tracking-wide">Total</span>
                <span className="text-xl text-cyan">${(total * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-ink-muted justify-center">
              <Lock size={11} />
              256-bit SSL — Powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
