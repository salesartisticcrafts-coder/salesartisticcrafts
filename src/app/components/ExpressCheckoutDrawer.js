'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, CreditCard, QrCode, Sparkles } from 'lucide-react';

export default function ExpressCheckoutDrawer({
  isOpen,
  onClose,
  product = null, // Single product checkout (if from product detail page)
  cartItems = [], // Cart checkout (if from cart page)
  subtotal = 0,
  discountAmount = 0,
  gst = 0,
  onSuccess
}) {
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [selectedDelivery, setSelectedDelivery] = useState('Delhivery');
  const [isReturningUser, setIsReturningUser] = useState(false);

  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Workflow states
  const [step, setStep] = useState(1); // 1: Express Review / Edit Profile, 2: Processing Payment
  const [processingMessage, setProcessingMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Look up returning customer profile from localStorage
      const savedName = localStorage.getItem('fullName');
      const savedEmail = localStorage.getItem('emailAddress');
      const savedPhone = localStorage.getItem('phoneNumber');
      const savedAddress = localStorage.getItem('shippingAddress');
      const savedPayment = localStorage.getItem('paymentMethod');

      if (savedName && savedAddress) {
        setFullName(savedName);
        setEmailAddress(savedEmail || '');
        setPhoneNumber(savedPhone || '');
        setShippingAddress(savedAddress);
        setPaymentMethod(savedPayment || 'UPI');
        setIsReturningUser(true);
      } else {
        setIsReturningUser(false);
      }
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Surcharges & totals calculation
  const getDeliveryPrice = () => {
    let baseShipping = subtotal > 15000 ? 0 : 500;
    if (selectedDelivery === 'BlueDart') return baseShipping + 150;
    if (selectedDelivery === 'DHL') return baseShipping + 600;
    return baseShipping;
  };
  const shippingPrice = getDeliveryPrice();
  const totalAmount = subtotal - discountAmount + shippingPrice + gst;

  const handleQuickPurchase = (e) => {
    e.preventDefault();

    if (!fullName || !shippingAddress || !phoneNumber) {
      alert('Please fill in all required shipping profile fields.');
      return;
    }

    // Save profile to localStorage for next 1-Click Checkout
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('emailAddress', emailAddress);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('shippingAddress', shippingAddress);
    localStorage.setItem('paymentMethod', paymentMethod);

    setStep(2);
    setProcessingMessage('1-Click Payment Routing via Secured Gateway...');

    setTimeout(() => {
      setProcessingMessage(`Registering consignment Airway Bill with ${selectedDelivery === 'BlueDart' ? 'Blue Dart Air' : selectedDelivery === 'DHL' ? 'DHL International' : 'Delhivery Express'}...`);

      setTimeout(() => {
        setProcessingMessage('Synchronizing payout settlement to Atelier Merchant HDFC Bank account...');

        setTimeout(() => {
          const orderId = 'AC-1CLICK-' + Math.floor(10000 + Math.random() * 90000);
          const awbNumber = (selectedDelivery === 'BlueDart' ? 'BD-' : selectedDelivery === 'DHL' ? 'DHL-' : 'DEL-') + Math.floor(10000000 + Math.random() * 90000000);
          
          // Register order to shared localStorage list of admin orders
          const existingOrders = JSON.parse(localStorage.getItem('atelier_orders') || '[]');
          const newOrder = {
            orderId,
            clientName: fullName,
            email: emailAddress,
            phone: phoneNumber,
            address: shippingAddress,
            payment: paymentMethod === 'UPI' ? 'UPI (1-Click)' : 'Credit Card (1-Click)',
            amount: totalAmount,
            deliveryPartner: selectedDelivery === 'BlueDart' ? 'Blue Dart Premium Air' : selectedDelivery === 'DHL' ? 'DHL International' : 'Delhivery Express',
            trackingNumber: awbNumber,
            date: new Date().toLocaleString(),
            isOneClick: true
          };
          existingOrders.unshift(newOrder);
          localStorage.setItem('atelier_orders', JSON.stringify(existingOrders));

          onSuccess(newOrder);
          onClose();
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(28,25,23,0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 99999
    }}>
      {/* Click outside backdrop close */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      {/* Slide-in panel body */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#FAF8F5',
        borderLeft: '1px solid var(--gold)',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(201,169,110,0.15)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--gold)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#1a1a1a', margin: 0 }}>Express 1-Click Buy</h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#666' }}>✕</button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleQuickPurchase} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
            
            {/* Returning client badge */}
            {isReturningUser ? (
              <div style={{ background: 'rgba(201, 169, 110, 0.1)', border: '1px dashed var(--gold)', padding: '12px', borderRadius: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ShieldCheck size={18} color="var(--gold)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--charcoal)', fontWeight: 500 }}>◈ Saved Profile Detected for Express Payout</span>
              </div>
            ) : (
              <div style={{ background: '#f4f1ee', padding: '12px', borderRadius: '4px', fontSize: '0.8rem', color: '#666' }}>
                Fill in shipping details once to enable 1-Click Purchase for your future visits.
              </div>
            )}

            {/* Product summary card */}
            <div style={{ background: '#fff', border: '1px solid #eae5df', padding: '16px', borderRadius: '4px', display: 'flex', gap: '16px' }}>
              {product ? (
                <>
                  <img src={product.img} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '2px', border: '1px solid #eae5df' }} />
                  <div>
                    <h4 style={{ fontSize: '0.88rem', margin: '0 0 4px', color: '#1a1a1a', fontWeight: 500 }}>{product.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#888', display: 'block' }}>Size: {product.size}</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>{product.price}</strong>
                  </div>
                </>
              ) : (
                <div style={{ width: '100%' }}>
                  <h4 style={{ fontSize: '0.85rem', margin: '0 0 8px', color: '#1a1a1a', fontWeight: 600 }}>Atelier Shopping Bag</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {cartItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#555' }}>
                        <span>{item.name} (x{item.qty})</span>
                        <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08rem', color: '#666', borderBottom: '1px solid #eae5df', paddingBottom: '6px', margin: 0 }}>Shipping Profile</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: '#888' }}>Full Name *</label>
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Mark Spencer" style={{ padding: '8px 12px', border: '1px solid #eae5df', background: '#fff', fontSize: '0.85rem', outline: 'none', color: '#1a1a1a' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.68rem', color: '#888' }}>Phone *</label>
                  <input type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+91 98765 43210" style={{ padding: '8px 12px', border: '1px solid #eae5df', background: '#fff', fontSize: '0.85rem', outline: 'none', color: '#1a1a1a' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.68rem', color: '#888' }}>Email Address</label>
                <input type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} placeholder="mark@example.com" style={{ padding: '8px 12px', border: '1px solid #eae5df', background: '#fff', fontSize: '0.85rem', outline: 'none', color: '#1a1a1a' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.68rem', color: '#888' }}>Shipping Address *</label>
                <textarea required rows={2} value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder="House, Street, City, State - Pincode" style={{ padding: '8px 12px', border: '1px solid #eae5df', background: '#fff', fontSize: '0.85rem', outline: 'none', color: '#1a1a1a', resize: 'none', fontFamily: 'inherit' }} />
              </div>
            </div>

            {/* Logistics partner selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08rem', color: '#666', borderBottom: '1px solid #eae5df', paddingBottom: '6px', margin: 0 }}>Courier Partner</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button type="button" onClick={() => setSelectedDelivery('Delhivery')} style={{ padding: '10px 6px', background: selectedDelivery === 'Delhivery' ? '#fff' : 'transparent', border: '1px solid', borderColor: selectedDelivery === 'Delhivery' ? 'var(--gold)' : '#eae5df', fontSize: '0.75rem', color: 'var(--charcoal)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <strong>Delhivery Express</strong>
                  <span style={{ fontSize: '0.65rem', color: '#888' }}>Standard (FREE)</span>
                </button>
                <button type="button" onClick={() => setSelectedDelivery('BlueDart')} style={{ padding: '10px 6px', background: selectedDelivery === 'BlueDart' ? '#fff' : 'transparent', border: '1px solid', borderColor: selectedDelivery === 'BlueDart' ? 'var(--gold)' : '#eae5df', fontSize: '0.75rem', color: 'var(--charcoal)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <strong>Blue Dart Air</strong>
                  <span style={{ fontSize: '0.65rem', color: 'var(--gold)' }}>Express (+₹150)</span>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08rem', color: '#666', borderBottom: '1px solid #eae5df', paddingBottom: '6px', margin: 0 }}>Saved Method</h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: '#1a1a1a' }}>
                  <input type="radio" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} style={{ accentColor: 'var(--gold)' }} />
                  <QrCode size={14} style={{ color: 'var(--gold)' }} /> UPI / QR Scan
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: '#1a1a1a' }}>
                  <input type="radio" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} style={{ accentColor: 'var(--gold)' }} />
                  <CreditCard size={14} style={{ color: 'var(--gold)' }} /> Card Payment
                </label>
              </div>

              {paymentMethod === 'Card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#fff', border: '1px solid #eae5df', borderRadius: '4px' }}>
                  <input type="text" required value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())} maxLength={19} placeholder="Card Number" style={{ padding: '8px', border: '1px solid #eae5df', fontSize: '0.8rem', outline: 'none' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input type="text" required value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} style={{ padding: '8px', border: '1px solid #eae5df', fontSize: '0.8rem', outline: 'none' }} />
                    <input type="password" required value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="CVV" maxLength={3} style={{ padding: '8px', border: '1px solid #eae5df', fontSize: '0.8rem', outline: 'none' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Total Billing */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #eae5df', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'green', marginBottom: '4px' }}>
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>
                <span>Shipping ({selectedDelivery === 'BlueDart' ? 'Blue Dart' : 'Delhivery'})</span>
                <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px' }}>
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* One Click Checkout Confirmation Button */}
              <button type="submit" className="btn-primary" style={{ width: '100%', height: '52px', justifyContent: 'center', fontSize: '0.85rem', background: 'var(--gold)', borderColor: 'var(--gold)', color: '#0d0d0d' }}>
                <Sparkles size={16} fill="none" />
                <span>Swipe to Buy (1-Click Order)</span>
              </button>
            </div>

          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '40px 0', textAlign: 'center' }}>
            <div className="payment-spinner" style={{ width: '50px', height: '50px', border: '3px solid rgba(201,169,110,0.2)', borderTopColor: 'var(--gold)', borderRadius: '50%', marginBottom: '24px', animation: 'spin 1s linear infinite' }}></div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#1a1a1a', marginBottom: '8px' }}>Securing Your Request</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', maxWidth: '280px', lineHeight: 1.5 }}>{processingMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
