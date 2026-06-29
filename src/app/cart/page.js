'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Trash2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import '../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../page';
import ExpressCheckoutDrawer from '../components/ExpressCheckoutDrawer';

export default function CartPage() {
  useScrollReveal();

  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [isOneClickOpen, setIsOneClickOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState('Delhivery');
  const [paymentStep, setPaymentStep] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem('cartItems');
      const initialized = localStorage.getItem('cartInitialized');
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          setCartItems(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.error(e);
          setCartItems([]);
        }
      } else if (!initialized) {
        const defaultCart = [
          { id: 1, name: 'Pink Crystal Beaded Bracelet', price: 14500, img: 'https://i.pinimg.com/736x/c6/b9/9e/c6b99ef41938e6186d097d554b44c921.jpg', size: 'Medium', qty: 1 },
          { id: 2, name: 'Black & White Marble Bracelet', price: 12800, img: 'https://i.pinimg.com/736x/af/08/54/af08547deca93880bc23eb302ef60527.jpg', size: 'Medium', qty: 1 },
          { id: 3, name: 'Marble Vase', price: 14000, img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800', size: 'Standard', qty: 1 }
        ];
        setCartItems(defaultCart);
        localStorage.setItem('cartItems', JSON.stringify(defaultCart));
        localStorage.setItem('cartInitialized', 'true');
      } else {
        setCartItems([]);
      }
    };

    loadCart();

    // Restore session email asynchronously to prevent cascading render warnings
    setTimeout(() => {
      const storedEmail = localStorage.getItem('userEmail');
      const storedLoggedIn = localStorage.getItem('loggedIn') === 'true';
      if (storedLoggedIn && storedEmail) {
        setEmailAddress(storedEmail);
      }
    }, 0);

    const handleCartUpdate = () => {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          setCartItems(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.error(e);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateQty = (id, size, amount) => {
    const updated = cartItems.map(item => {
      if (item.id === id && item.size === size) {
        const newQty = Math.max(1, item.qty + amount);
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id, size) => {
    const updated = cartItems.filter(item => !(item.id === id && item.size === size));
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === 'luxury10') {
      setDiscount(0.1); // 10% discount
      alert('Promo code applied successfully! 10% discount has been applied to your subtotal.');
    } else {
      alert('Invalid promo code. Try "LUXURY10".');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = subtotal * discount;
  
  const getDeliveryPrice = () => {
    let baseShipping = subtotal > 15000 ? 0 : 500;
    if (selectedDelivery === 'BlueDart') return baseShipping + 150;
    if (selectedDelivery === 'DHL') return baseShipping + 600;
    return baseShipping; // Delhivery
  };
  const shipping = getDeliveryPrice();
  
  const gst = (subtotal - discountAmount) * 0.18; // 18% GST in India
  const total = subtotal - discountAmount + shipping + gst;

  const simulatePaymentSuccess = () => {
    setPaymentStep(3);
    setProcessingMessage('Securely communicating with SSL Encrypted Gateway...');
    
    setTimeout(() => {
      setProcessingMessage(`Registering consignment Airway Bill with ${selectedDelivery === 'BlueDart' ? 'Blue Dart' : selectedDelivery === 'DHL' ? 'DHL' : 'Delhivery'}...`);
      
      setTimeout(() => {
        setProcessingMessage('Payment Authorized. Generating Invoice...');
        
        setTimeout(() => {
          const orderId = 'AC-2026-' + Math.floor(10000 + Math.random() * 90000);
          const awbNumber = (selectedDelivery === 'BlueDart' ? 'BD-' : selectedDelivery === 'DHL' ? 'DHL-' : 'DEL-') + Math.floor(10000000 + Math.random() * 90000000);
          
          setOrderSuccess({
            orderId,
            name: fullName,
            email: emailAddress,
            phone: phoneNumber,
            address: shippingAddress,
            payment: paymentMethod,
            amount: total,
            deliveryPartner: selectedDelivery === 'BlueDart' ? 'Blue Dart Premium Air' : selectedDelivery === 'DHL' ? 'DHL International' : 'Delhivery Express',
            trackingNumber: awbNumber
          });
          
          setCartItems([]);
          localStorage.removeItem('cartItems');
          window.dispatchEvent(new Event('cartUpdated'));
          setShowPaymentModal(false);
          setIsCheckingOut(false);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setPaymentStep(1);
    setShowPaymentModal(true);
  };

  return (
    <>
      <Navbar />
      
      <main style={{ backgroundColor: '#fff', paddingTop: '80px' }}>
        <div className="container" style={{ padding: '60px 0 100px' }}>
          
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#1a1a1a' }}>Shopping Bag</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a', fontWeight: '400', marginBottom: '48px', fontFamily: 'var(--font-serif)' }}>
            Shopping Bag
          </h1>

          {orderSuccess ? (
            <div className="reveal" style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center', padding: '60px 40px', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '4px', background: '#faf9f8', boxShadow: 'var(--shadow-deep)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 24px', border: '1px solid #2ecc71' }}>✓</div>
              <h2 style={{ fontSize: '2rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: '#1a1a1a', marginBottom: '12px' }}>Order Placed Successfully!</h2>
              <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>Thank you for choosing Artistic Crafts. Your custom creation request is being sent to our Udaipur studio atelier.</p>
              
              <div style={{ textAlign: 'left', background: '#fff', border: '1px solid #eae5df', padding: '24px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f4f1ee', paddingBottom: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#888', fontWeight: '500' }}>Order ID</span>
                  <strong style={{ color: '#1a1a1a' }}>{orderSuccess.orderId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#888' }}>Client Name</span>
                  <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{orderSuccess.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#888' }}>Delivery Address</span>
                  <span style={{ color: '#1a1a1a', fontWeight: '500', maxWidth: '300px', textAlign: 'right', wordBreak: 'break-all' }}>{orderSuccess.address}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#888' }}>Logistics Partner</span>
                  <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{orderSuccess.deliveryPartner}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#888' }}>Tracking ID (AWB)</span>
                  <span style={{ color: 'var(--gold)', fontWeight: '600' }}>
                    {orderSuccess.trackingNumber} 
                    <span style={{ fontSize: '0.75rem', marginLeft: '6px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => alert(`Simulated Delhivery/Blue Dart tracking system:\nAWB: ${orderSuccess.trackingNumber}\nStatus: Shipment Booked at Jaipur Hub\nEstimated Delivery: 2 Days`)}>
                      (Track)
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#888' }}>Payment Method</span>
                  <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{orderSuccess.payment === 'UPI' ? 'UPI / QR Code Scan' : 'Credit / Debit Card'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderTop: '1px solid #f4f1ee', paddingTop: '12px', marginTop: '4px' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: '600' }}>Total Paid Amount</span>
                  <strong style={{ color: '#1a1a1a', fontSize: '1.05rem' }}>₹{orderSuccess.amount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <Link href="/" className="btn-primary" style={{ margin: '0 auto', display: 'inline-flex', textDecoration: 'none' }}>
                <span>Return to Gallery Home</span> <ArrowRight size={16} />
              </Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }} className="reveal">
              <h2 style={{ fontSize: '1.8rem', color: '#666', fontWeight: '300', marginBottom: '24px' }}>Your bag is empty</h2>
              <p style={{ color: '#888', marginBottom: '32px' }}>Explore our exquisite collections to add items to your cart.</p>
              <Link href="/collections/stone-jewelry" className="btn-primary">
                <span>Shop Collections</span> <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="cart-page-grid">
              
              {isCheckingOut ? (
                /* Checkout Form */
                <div className="reveal checkout-form-container">
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: '#1a1a1a', margin: 0, borderBottom: '1px solid rgba(201,169,110,0.25)', paddingBottom: '16px' }}>Atelier Checkout</h2>
                  <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="checkout-form-grid">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', fontWeight: '500' }}>Full Name *</label>
                        <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Mark Spencer" style={{ padding: '12px', border: '1px solid #eae5df', outline: 'none', background: '#fff', color: '#1a1a1a' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', fontWeight: '500' }}>Phone Number *</label>
                        <input type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+91 98765 43210" style={{ padding: '12px', border: '1px solid #eae5df', outline: 'none', background: '#fff', color: '#1a1a1a' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', fontWeight: '500' }}>Email Address *</label>
                      <input type="email" required value={emailAddress} onChange={e => setEmailAddress(e.target.value)} placeholder="mark@example.com" style={{ padding: '12px', border: '1px solid #eae5df', outline: 'none', background: '#fff', color: '#1a1a1a' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', fontWeight: '500' }}>Shipping Address *</label>
                      <textarea required rows={3} value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder="House No, Street Name, City, State - Pincode" style={{ padding: '12px', border: '1px solid #eae5df', outline: 'none', background: '#fff', color: '#1a1a1a', fontFamily: 'inherit', resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(201, 169, 110, 0.15)', paddingTop: '20px' }}>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', fontWeight: '500' }}>Select Payment Method *</label>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem', color: '#1a1a1a' }}>
                          <input type="radio" name="payment" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} style={{ accentColor: 'var(--gold)', width: '18px', height: '18px' }} />
                          UPI / QR Code Scan
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem', color: '#1a1a1a' }}>
                          <input type="radio" name="payment" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} style={{ accentColor: 'var(--gold)', width: '18px', height: '18px' }} />
                          Credit / Debit Card
                        </label>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                      <button type="button" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--charcoal)', color: 'var(--charcoal)', flex: 1, justifyContent: 'center' }} onClick={() => setIsCheckingOut(false)}>
                        <span>Back to Bag</span>
                      </button>
                      <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                        <span>Confirm & Place Order</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Cart List */
                <div className="reveal" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="cart-table-header">
                    <span>Product</span>
                    <span className="cart-table-header-right">
                      <span>Quantity</span>
                      <span>Total</span>
                    </span>
                  </div>

                  <div>
                    {cartItems.map(item => (
                      <div key={`${item.id}-${item.size}`} className="cart-table-item">
                        <img src={item.img} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(201, 169, 110, 0.15)' }} />
                        
                        <div className="cart-table-item-details">
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '500', color: '#1a1a1a', margin: '0 0 6px' }}>{item.name}</h3>
                            <span style={{ fontSize: '0.85rem', color: '#888' }}>Size: {item.size}</span>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id, item.size)} 
                            style={{ background: 'none', border: 'none', color: '#999', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, width: 'fit-content' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#c93b2b'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>

                        <div className="cart-table-item-actions">
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eae5df', height: '40px', justifyContent: 'space-between' }}>
                            <button onClick={() => updateQty(item.id, item.size, -1)} style={{ width: '28px', background: 'none', border: 'none', cursor: 'pointer', height: '100%' }}>-</button>
                            <span style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: '500' }}>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.size, 1)} style={{ width: '28px', background: 'none', border: 'none', cursor: 'pointer', height: '100%' }}>+</button>
                          </div>
                          <span style={{ fontWeight: '500', color: '#1a1a1a' }}>
                            ₹{(item.price * item.qty).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="reveal" style={{ transitionDelay: '0.2s' }}>
                <div className="cart-summary-box">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '24px', fontFamily: 'var(--font-serif)', letterSpacing: '0.05em' }}>Order Summary</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid rgba(201, 169, 110, 0.15)', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#666' }}>
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'green' }}>
                        <span>Promo Discount (10%)</span>
                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#666' }}>
                      <span>Estimated GST (18%)</span>
                      <span>₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#666' }}>
                      <span>Shipping & Insured Transit</span>
                      <span>{shipping === 0 ? <span style={{ color: 'green' }}>FREE</span> : `₹${shipping}`}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '500', color: '#1a1a1a', marginBottom: '30px' }}>
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                    <input 
                      type="text" 
                      placeholder="Promo Code" 
                      value={promoCode} 
                      onChange={e => setPromoCode(e.target.value)} 
                      style={{ flex: 1, padding: '12px', border: '1px solid #eae5df', outline: 'none', fontSize: '0.9rem', background: '#fff', color: '#1a1a1a' }} 
                    />
                    <button type="submit" style={{ padding: '0 20px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>Apply</button>
                  </form>

                  {isCheckingOut ? (
                    <div style={{ textAlign: 'center', padding: '14px 0', borderTop: '1px solid rgba(201, 169, 110, 0.15)', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ◈ Awaiting checkout form submission
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '56px' }} onClick={() => setIsCheckingOut(true)}>
                        <span>Proceed to Checkout</span>
                      </button>
                      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '56px', background: 'var(--gold)', borderColor: 'var(--gold)', color: '#0d0d0d' }} onClick={() => setIsOneClickOpen(true)}>
                        <Sparkles size={16} fill="none" />
                        <span>Express 1-Click Buy</span>
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', marginTop: '20px', color: '#666', fontSize: '0.8rem' }}>
                    <ShieldCheck size={16} color="var(--gold)" />
                    <span>Secure 256-bit SSL encrypted checkout.</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />

      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28,25,23,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#faf9f8',
            border: '1px solid var(--gold)',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '500px',
            padding: '30px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button 
              type="button" 
              onClick={() => setShowPaymentModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>

            {paymentStep === 1 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#1a1a1a', marginBottom: '20px', borderBottom: '1px solid rgba(201,169,110,0.15)', paddingBottom: '10px' }}>
                  Shipping & Delivery Partner
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>Choose your logistics partner for dispatching your luxury stone request:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eae5df', borderRadius: '4px', cursor: 'pointer', background: selectedDelivery === 'Delhivery' ? '#fff' : 'transparent', borderColor: selectedDelivery === 'Delhivery' ? 'var(--gold)' : '#eae5df' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a' }}>
                      <input type="radio" checked={selectedDelivery === 'Delhivery'} onChange={() => setSelectedDelivery('Delhivery')} style={{ accentColor: 'var(--gold)' }} />
                      Delhivery Express
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Standard (3-4 Days) — FREE</span>
                  </label>
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eae5df', borderRadius: '4px', cursor: 'pointer', background: selectedDelivery === 'BlueDart' ? '#fff' : 'transparent', borderColor: selectedDelivery === 'BlueDart' ? 'var(--gold)' : '#eae5df' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a' }}>
                      <input type="radio" checked={selectedDelivery === 'BlueDart'} onChange={() => setSelectedDelivery('BlueDart')} style={{ accentColor: 'var(--gold)' }} />
                      Blue Dart Premium Air
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>Express (1-2 Days) — +₹150</span>
                  </label>
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eae5df', borderRadius: '4px', cursor: 'pointer', background: selectedDelivery === 'DHL' ? '#fff' : 'transparent', borderColor: selectedDelivery === 'DHL' ? 'var(--gold)' : '#eae5df' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a' }}>
                      <input type="radio" checked={selectedDelivery === 'DHL'} onChange={() => setSelectedDelivery('DHL')} style={{ accentColor: 'var(--gold)' }} />
                      DHL International Courier
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>Global (3-5 Days) — +₹600</span>
                  </label>
                </div>
                <button type="button" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setPaymentStep(2)}>
                  <span>Proceed to Payment (₹{total.toLocaleString('en-IN')})</span>
                </button>
              </div>
            )}

            {paymentStep === 2 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#1a1a1a', marginBottom: '20px', borderBottom: '1px solid rgba(201,169,110,0.15)', paddingBottom: '10px' }}>
                  Secure Payment Gateway
                </h3>
                
                {paymentMethod === 'UPI' ? (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>Scan the QR code below using any UPI App (GPay, PhonePe, Paytm, BHIM) to pay:</p>
                    <div style={{ background: '#fff', border: '1px solid #eae5df', width: '160px', height: '160px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '4px' }}>
                      <div style={{ width: '100%', height: '100%', background: 'repeating-conic-gradient(from 45deg, #1c1917 0% 25%, transparent 0% 50%) 50% / 15px 15px', border: '4px solid #1c1917', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#fff', padding: '4px 8px', fontSize: '0.65rem', fontWeight: 600, border: '1px solid #1c1917' }}>ARTISTIC UPI</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '8px' }}>
                      UPI ID: artisticcrafts@yesbank
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '20px' }}>
                      Amount: <strong>₹{total.toLocaleString('en-IN')}</strong>
                    </div>
                    <button type="button" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={simulatePaymentSuccess}>
                      <span>Simulate UPI Payment Scan Success</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666' }}>Card Number</label>
                      <input type="text" required value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())} maxLength={19} placeholder="4111 2222 3333 4444" style={{ padding: '10px', border: '1px solid #eae5df', background: '#fff', color: '#1a1a1a', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666' }}>Expiry Date</label>
                        <input type="text" required value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} style={{ padding: '10px', border: '1px solid #eae5df', background: '#fff', color: '#1a1a1a', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666' }}>CVV</label>
                        <input type="password" required value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="•••" maxLength={3} style={{ padding: '10px', border: '1px solid #eae5df', background: '#fff', color: '#1a1a1a', outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666' }}>Cardholder Name</label>
                      <input type="text" required value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Mark Spencer" style={{ padding: '10px', border: '1px solid #eae5df', background: '#fff', color: '#1a1a1a', outline: 'none' }} />
                    </div>
                    <button type="button" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} onClick={simulatePaymentSuccess}>
                      <span>Securely Pay ₹{total.toLocaleString('en-IN')}</span>
                    </button>
                  </div>
                )}
                
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button type="button" onClick={() => setPaymentStep(1)} style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Go Back to Shipping Partner
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 3 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="payment-spinner" style={{ width: '60px', height: '60px', border: '3px solid rgba(201,169,110,0.2)', borderTopColor: 'var(--gold)', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }}></div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#1a1a1a', marginBottom: '8px' }}>Processing Transaction</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{processingMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ExpressCheckoutDrawer
        isOpen={isOneClickOpen}
        onClose={() => setIsOneClickOpen(false)}
        cartItems={cartItems}
        subtotal={subtotal}
        discountAmount={discountAmount}
        gst={gst}
        onSuccess={(newOrder) => {
          setOrderSuccess(newOrder);
        }}
      />
    </>
  );
}
