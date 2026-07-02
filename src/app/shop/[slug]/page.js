'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import '../../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../../page';
import ExpressCheckoutDrawer from '../../components/ExpressCheckoutDrawer';
import { allProducts } from '../../utils/products';

export default function ProductDetailPage({ params }) {
  const { slug } = React.use(params);
  useScrollReveal();

  const product = allProducts.find(p => p.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === slug) || allProducts[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [activeTab, setActiveTab] = useState('desc');
  const [isOneClickOpen, setIsOneClickOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleAddToCart = () => {
    if (typeof window !== 'undefined' && window.addToCart) {
      const productId = allProducts.findIndex(p => p.name === product.name) + 1;
      const productObj = {
        id: productId,
        name: product.name,
        price: product.price,
        img: product.img
      };
      window.addToCart(productObj, quantity, selectedSize);
    } else {
      alert(`${product.name} (${selectedSize}, Qty: ${quantity}) has been added to your shopping bag!`);
    }
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
            <Link href="/collections/stone-jewelry" style={{ color: 'inherit', textDecoration: 'none' }}>Shop</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#1a1a1a' }}>{product.name}</span>
          </div>

          {/* Product Section */}
          <div className="product-detail-grid">
            
            {/* Gallery Left */}
            <div className="product-gallery">
              <div className="product-gallery__main">
                <img src={product.img} alt={product.name} className="product-gallery__img" />
              </div>
            </div>

            {/* Info Right */}
            <div className="product-info-panel reveal">
              <div>
                {product.tag && (
                  <span style={{
                    background: 'var(--gold)',
                    color: '#0d0d0d',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: '2px',
                    display: 'inline-block',
                    marginBottom: '16px'
                  }}>{product.tag}</span>
                )}
                <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#1a1a1a', fontWeight: '400', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>
                  {product.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: product.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="#C9A96E" stroke="none" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Verified Client Review</span>
                </div>
                <div style={{ fontSize: '1.6rem', color: 'var(--gold)', fontWeight: '400' }}>
                  {product.price}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #eae5df', borderBottom: '1px solid #eae5df', padding: '24px 0' }}>
                <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.98rem', margin: 0 }}>
                  {product.desc}
                </p>
                <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#888' }}>
                  <strong>Material:</strong> {product.material}
                </div>
              </div>

              {/* Option Selectors */}
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', display: 'block', marginBottom: '8px' }}>Select Size:</span>
                <div className="option-chips">
                  {['Small', 'Medium', 'Large'].map(size => (
                    <button 
                      key={size} 
                      className={`option-chip ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="product-actions-wrap">
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eae5df', height: '56px' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '40px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>-</button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: '500', color: '#1a1a1a' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} style={{ width: '40px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>+</button>
                </div>
                
                <button className="btn-primary" style={{ flex: 1, height: '56px', justifyContent: 'center' }} onClick={handleAddToCart}>
                  <ShoppingBag size={16} />
                  <span>Add To Bag</span>
                </button>

                <button className="btn-primary" style={{ flex: 1, height: '56px', justifyContent: 'center', background: 'var(--gold)', borderColor: 'var(--gold)', color: '#0d0d0d' }} onClick={() => setIsOneClickOpen(true)}>
                  <Sparkles size={16} fill="none" />
                  <span>1-Click Buy</span>
                </button>
              </div>

              {/* Atelier Guarantees */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#faf9f8', padding: '24px', border: '1px solid rgba(201, 169, 110, 0.15)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <ShieldCheck size={18} color="var(--gold)" />
                  <span style={{ fontSize: '0.85rem', color: '#555' }}>Authenticity Seal & Atelier Lifetime Care</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Truck size={18} color="var(--gold)" />
                  <span style={{ fontSize: '0.85rem', color: '#555' }}>Complimentary Insured Delivery Across India</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <RefreshCw size={18} color="var(--gold)" />
                  <span style={{ fontSize: '0.85rem', color: '#555' }}>Returns/Exchanges up to 14 days</span>
                </div>
              </div>

              {/* Informative Tabs */}
              <div>
                <div style={{ display: 'flex', borderBottom: '1px solid #eae5df' }}>
                  {[
                    { id: 'desc', label: 'Story & Craft' },
                    { id: 'shipping', label: 'Sourcing & Delivery' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : 'none',
                        color: activeTab === tab.id ? 'var(--charcoal)' : '#888',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: activeTab === tab.id ? '500' : '400',
                        fontFamily: 'inherit'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div style={{ padding: '20px 0', fontSize: '0.9rem', color: '#666', lineHeight: 1.7 }}>
                  {activeTab === 'desc' ? (
                    <p>
                      Each piece is hand-carved in our Udaipur workshop by master artisans using generations-old stone masonry secrets. Slabs are meticulously selected for texture and pattern, then inlaid with precious metal details before finishing.
                    </p>
                  ) : (
                    <p>
                      Agates and Marbles are ethically sourced from Rajasthani, Carrara, and Onyx quarries. Deliveries are fully insured and shipped in heavy custom felt presentation boxes. Expect delivery within 3-5 business days.
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />

      <ExpressCheckoutDrawer
        isOpen={isOneClickOpen}
        onClose={() => setIsOneClickOpen(false)}
        product={{
          name: product.name,
          price: product.price,
          img: product.img,
          size: selectedSize
        }}
        subtotal={parseInt(product.price.replace(/[^\d]/g, '')) * quantity}
        discountAmount={0}
        gst={parseInt(product.price.replace(/[^\d]/g, '')) * quantity * 0.18}
        onSuccess={(newOrder) => {
          setOrderSuccess(newOrder);
        }}
      />

      {orderSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28,25,23,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div className="reveal" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '40px 30px', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '4px', background: '#faf9f8', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px', border: '1px solid #2ecc71' }}>✓</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: '#1a1a1a', marginBottom: '8px' }}>1-Click Order Placed!</h2>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>Your premium order has been confirmed. Payout settlement to HDFC Atelier Bank account has been processed.</p>
            
            <div style={{ textAlign: 'left', background: '#fff', border: '1px solid #eae5df', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f4f1ee', paddingBottom: '8px' }}>
                <span style={{ color: '#888' }}>Order ID</span>
                <strong style={{ color: '#1a1a1a' }}>{orderSuccess.orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Logistics Partner</span>
                <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{orderSuccess.deliveryPartner}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>AWB Tracking ID</span>
                <span style={{ color: 'var(--gold)', fontWeight: '600' }}>
                  {orderSuccess.trackingNumber}
                  <span style={{ fontSize: '0.75rem', marginLeft: '6px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => alert(`Consignment status for AWB: ${orderSuccess.trackingNumber}\nStatus: Booked and awaiting dispatch\nCourier: ${orderSuccess.deliveryPartner}`)}>
                    (Track)
                  </span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f4f1ee', paddingTop: '8px' }}>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Total Paid</span>
                <strong style={{ color: '#1a1a1a' }}>₹{orderSuccess.amount.toLocaleString('en-IN')}</strong>
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setOrderSuccess(null)}>
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
