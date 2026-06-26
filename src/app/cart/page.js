'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import '../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../page';

export default function CartPage() {
  useScrollReveal();

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Pink Crystal Beaded Bracelet', price: 14500, img: 'https://i.pinimg.com/736x/c6/b9/9e/c6b99ef41938e6186d097d554b44c921.jpg', size: 'Medium', qty: 1 },
    { id: 2, name: 'Black & White Marble Bracelet', price: 12800, img: 'https://i.pinimg.com/736x/af/08/54/af08547deca93880bc23eb302ef60527.jpg', size: 'Medium', qty: 1 },
    { id: 3, name: 'Marble Vase', price: 14000, img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800', size: 'Standard', qty: 1 }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQty = (id, amount) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + amount);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
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

          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }} className="reveal">
              <h2 style={{ fontSize: '1.8rem', color: '#666', fontWeight: '300', marginBottom: '24px' }}>Your bag is empty</h2>
              <p style={{ color: '#888', marginBottom: '32px' }}>Explore our exquisite collections to add items to your cart.</p>
              <Link href="/collections/stone-jewelry" className="btn-primary">
                <span>Shop Collections</span> <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="cart-page-grid">
              
              {/* Cart List */}
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
                      style={{ flex: 1, padding: '12px', border: '1px solid #eae5df', outline: 'none', fontSize: '0.9rem', background: '#fff' }} 
                    />
                    <button type="submit" style={{ padding: '0 20px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>Apply</button>
                  </form>

                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '56px' }} onClick={() => alert('Order received! Proceeding to Payment Gateway...')}>
                    <span>Proceed to Checkout</span>
                  </button>

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
