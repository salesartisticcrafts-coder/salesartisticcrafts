'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, CreditCard, QrCode, Sparkles } from 'lucide-react';
import { loadRazorpayScript } from '../utils/razorpay';

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
  
  // Razorpay simulation states
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [sandboxOrderData, setSandboxOrderData] = useState(null);

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

  const processOrderCompletion = (gatewayDetails) => {
    const orderId = gatewayDetails.razorpay_order_id || 'AC-RZP-' + Math.floor(10000 + Math.random() * 90000);
    const awbNumber = (selectedDelivery === 'BlueDart' ? 'BD-' : selectedDelivery === 'DHL' ? 'DHL-' : 'DEL-') + Math.floor(10000000 + Math.random() * 90000000);
    
    // Register order to shared localStorage list of admin orders
    const existingOrders = JSON.parse(localStorage.getItem('atelier_orders') || '[]');
    const newOrder = {
      orderId,
      clientName: fullName,
      email: emailAddress,
      phone: phoneNumber,
      address: shippingAddress,
      payment: `Razorpay (${paymentMethod})` + (gatewayDetails.isSandbox ? ' [Mock Sandbox]' : ''),
      amount: totalAmount,
      deliveryPartner: selectedDelivery === 'BlueDart' ? 'Blue Dart Premium Air' : selectedDelivery === 'DHL' ? 'DHL International' : 'Delhivery Express',
      trackingNumber: awbNumber,
      date: new Date().toLocaleString(),
      isOneClick: true,
      razorpay_payment_id: gatewayDetails.razorpay_payment_id,
      razorpay_order_id: gatewayDetails.razorpay_order_id
    };
    existingOrders.unshift(newOrder);
    localStorage.setItem('atelier_orders', JSON.stringify(existingOrders));

    onSuccess(newOrder);
    onClose();
  };

  const handleSandboxSuccess = async () => {
    setShowSandboxModal(false);
    setStep(2);
    setProcessingMessage('Simulating Razorpay verification on server...');

    try {
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: sandboxOrderData.id,
          razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 10),
          razorpay_signature: 'sig_mock_verified'
        })
      });
      
      const verifyData = await verifyRes.json();
      if (verifyData.verified) {
        setProcessingMessage('Payment verified! Finalizing order...');
        setTimeout(() => {
          processOrderCompletion({
            razorpay_order_id: sandboxOrderData.id,
            razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 10),
            isSandbox: true
          });
        }, 1000);
      } else {
        alert('Sandbox signature verification failed.');
        setStep(1);
      }
    } catch (err) {
      console.error(err);
      alert('Sandbox payment failed.');
      setStep(1);
    }
  };

  const handleQuickPurchase = async (e) => {
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
    setProcessingMessage('Contacting Razorpay Secure Gateway...');

    try {
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // in paise
          receipt: 'rcpt_1click_' + Date.now()
        })
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate order.');
      }
      
      const orderData = await res.json();
      
      if (orderData.isSandbox) {
        // Show simulated Razorpay overlay
        setSandboxOrderData(orderData);
        setShowSandboxModal(true);
        return;
      }

      // Real integration
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Are you offline?');
        setStep(1);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ARTISTIC CRAFTS",
        description: "Express 1-Click Checkout",
        order_id: orderData.id,
        handler: async function (response) {
          setStep(2);
          setProcessingMessage('Verifying transaction security...');
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              setProcessingMessage('Payment Authorized! Finalizing order...');
              setTimeout(() => {
                processOrderCompletion({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  isSandbox: false
                });
              }, 1000);
            } else {
              alert('Payment verification failed.');
              setStep(1);
            }
          } catch (err) {
            console.error(err);
            alert('Error verifying payment.');
            setStep(1);
          }
        },
        prefill: {
          name: fullName,
          email: emailAddress,
          contact: phoneNumber
        },
        theme: {
          color: "#C9A96E"
        },
        modal: {
          ondismiss: function () {
            setStep(1);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Razorpay transaction failed to initiate.');
      setStep(1);
    }
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

      {showSandboxModal && sandboxOrderData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28,25,23,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: '#FAF8F5',
            border: '2px solid var(--gold)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '440px',
            padding: '30px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            textAlign: 'center',
            fontFamily: 'inherit'
          }}>
            <div style={{ display: 'inline-flex', background: 'rgba(201, 169, 110, 0.1)', color: 'var(--gold)', borderRadius: '50%', padding: '12px', marginBottom: '16px' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#1a1a1a', margin: '0 0 10px' }}>Razorpay Sandbox</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5, marginBottom: '20px' }}>
              No active Razorpay API keys detected in your `.env.local`. Running in secure developer simulation mode.
            </p>
            
            <div style={{ background: '#fff', border: '1px solid #eae5df', padding: '16px', borderRadius: '4px', textAlign: 'left', marginBottom: '24px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Order ID</span>
                <span style={{ color: '#1a1a1a', fontWeight: 600 }}>{sandboxOrderData.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Client</span>
                <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{fullName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Amount</span>
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleSandboxSuccess} style={{ width: '100%', padding: '14px', background: 'var(--gold)', border: '1px solid var(--gold)', color: '#0d0d0d', fontWeight: 600, cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Simulate Payment Success
              </button>
              <button onClick={() => { setShowSandboxModal(false); setStep(1); }} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #eae5df', color: '#666', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem' }}>
                Cancel Payment
              </button>
            </div>
            
            <div style={{ marginTop: '20px', fontSize: '0.7rem', color: '#999' }}>
              * To run the real checkout, define your Razorpay API keys in `.env.local`
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
