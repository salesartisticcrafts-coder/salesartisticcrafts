'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import '../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../page';

export default function CartPage() {
  useScrollReveal();

  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          console.error(e);
        }
      } else {
        const defaultCart = [
          { id: 1, name: 'Pink Crystal Beaded Bracelet', price: 14500, img: 'https://i.pinimg.com/736x/c6/b9/9e/c6b99ef41938e6186d097d554b44c921.jpg', size: 'Medium', qty: 1 },
          { id: 2, name: 'Black & White Marble Bracelet', price: 12800, img: 'https://i.pinimg.com/736x/af/08/54/af08547deca93880bc23eb302ef60527.jpg', size: 'Medium', qty: 1 },
          { id: 3, name: 'Marble Vase', price: 14000, img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800', size: 'Standard', qty: 1 }
        ];
        setCartItems(defaultCart);
        localStorage.setItem('cartItems', JSON.stringify(defaultCart));
      }
    };

    loadCart();

    const storedEmail = localStorage.getItem('userEmail');
    const storedLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (storedLoggedIn && storedEmail) {
      setEmailAddress(storedEmail);
    }

    const handleCartUpdate = () => {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          console.error(e);
        }
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateQty = (id, amount) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + amount);
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
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
  const shipping = subtotal > 15000 ? 0 : 500;
  const gst = (subtotal - discountAmount) * 0.18; // 18% GST in India
  const total = subtotal - discountAmount + shipping + gst;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const orderId = 'AC-2026-' + Math.floor(10000 + Math.random() * 90000);
    setOrderSuccess({
      orderId,
      name: fullName,
      email: emailAddress,
      phone: phoneNumber,
      address: shippingAddress,
      payment: paymentMethod,
      amount: total
    });
    setCartItems([]);
    localStorage.removeItem('cartItems');
    window.dispatchEvent(new Event('cartUpdated'));
    setIsCheckingOut(false);
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
                <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '40px', border: '1px solid #eae5df', borderRadius: '4px', background: '#faf9f8' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: '#1a1a1a', margin: 0, borderBottom: '1px solid rgba(201,169,110,0.25)', paddingBottom: '16px' }}>Atelier Checkout</h2>
                  <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(201, 169, 110, 0.25)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>
                    <span>Product</span>
                    <span style={{ display: 'grid', gridTemplateColumns: '100px 100px', gap: '40px', textAlign: 'right' }}>
                      <span>Quantity</span>
                      <span>Total</span>
                    </span>
                  </div>

                  <div>
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-table-item">
                        <img src={item.img} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(201, 169, 110, 0.15)' }} />
                        
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '500', color: '#1a1a1a', margin: '0 0 6px' }}>{item.name}</h3>
                            <span style={{ fontSize: '0.85rem', color: '#888' }}>Size: {item.size}</span>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)} 
                            style={{ background: 'none', border: 'none', color: '#999', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, width: 'fit-content' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#c93b2b'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '100px 100px', gap: '40px', alignItems: 'center', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eae5df', height: '40px', justifyContent: 'space-between' }}>
                            <button onClick={() => updateQty(item.id, -1)} style={{ width: '28px', background: 'none', border: 'none', cursor: 'pointer', height: '100%' }}>-</button>
                            <span style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: '500' }}>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} style={{ width: '28px', background: 'none', border: 'none', cursor: 'pointer', height: '100%' }}>+</button>
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
                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '56px' }} onClick={() => setIsCheckingOut(true)}>
                      <span>Proceed to Checkout</span>
                    </button>
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
    </>
  );
}
