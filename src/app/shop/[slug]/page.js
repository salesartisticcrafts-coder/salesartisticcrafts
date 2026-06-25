'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, SlidersHorizontal, ChevronDown } from 'lucide-react';
import '../../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../../page';

export default function CollectionPage({ params }) {
  const { slug } = React.use(params);
  useScrollReveal();

  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const products = [
    { id: 1, name: `${title} Signature Piece`, price: '₹18,500', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop', tag: 'Best Seller', rating: 5 },
    { id: 2, name: `${title} Classic Design`, price: '₹12,800', img: 'https://images.unsplash.com/photo-1573408301145-b98c4af05b8b?q=80&w=800&auto=format&fit=crop', tag: 'New', rating: 5 },
    { id: 3, name: `${title} Modern Edition`, price: '₹24,000', img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop', tag: '', rating: 4 },
    { id: 4, name: `${title} Essential`, price: '₹9,500', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop', tag: '', rating: 5 },
    { id: 5, name: `${title} Luxe Item`, price: '₹29,000', img: 'https://images.unsplash.com/photo-1573408301145-b98c4af05b8b?q=80&w=800&auto=format&fit=crop', tag: 'Exclusive', rating: 5 },
    { id: 6, name: `${title} Artisan Core`, price: '₹16,400', img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop', tag: '', rating: 5 },
    { id: 7, name: `${title} Limited Set`, price: '₹34,500', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop', tag: 'Limited', rating: 5 },
    { id: 8, name: `${title} Bespoke Core`, price: '₹21,800', img: 'https://images.unsplash.com/photo-1573408301145-b98c4af05b8b?q=80&w=800&auto=format&fit=crop', tag: '', rating: 5 },
    { id: 9, name: `${title} Grand Slab`, price: '₹55,000', img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop', tag: 'Bestseller', rating: 4 },
  ];

  return (
    <>
      <Navbar />
      
      <main style={{ backgroundColor: '#fff', paddingTop: '80px' }}>
        
        {/* Minimal Breadcrumb & Title */}
        <div className="container" style={{ padding: '60px 0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Collections</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#1a1a1a' }}>{title}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a', fontWeight: '400', marginBottom: '16px' }}>
            {title}
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '700px', lineHeight: '1.6' }}>
            Discover our masterfully sculpted pieces, blending rare materials with timeless artisanal craftsmanship.
          </p>
        </div>

        {/* E-Commerce Layout */}
        <div className="container" style={{ paddingBottom: '100px' }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            
            {/* Left Sidebar (Filters) */}
            <aside style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px' }} className="shop-sidebar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '20px', borderBottom: '1px solid #eae5df', marginBottom: '24px' }}>
                <SlidersHorizontal size={18} />
                <h3 style={{ fontSize: '1rem', fontWeight: '500', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Filters</h3>
              </div>

              {/* Filter Group: Material */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>Material</h4>
                  <ChevronDown size={16} color="#888" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Carrara Marble', 'Nero Marquina', 'Agate Stone', 'Quartzite', 'Rose Quartz'].map(mat => (
                    <label key={mat} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '0.9rem', color: '#555' }}>{mat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Group: Price */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>Price</h4>
                  <ChevronDown size={16} color="#888" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Under ₹10,000', '₹10,000 - ₹20,000', '₹20,000 - ₹50,000', 'Above ₹50,000'].map(price => (
                    <label key={price} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '0.9rem', color: '#555' }}>{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Group: Availability */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>Availability</h4>
                  <ChevronDown size={16} color="#888" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['In Stock', 'Made to Order', 'Limited Edition'].map(av => (
                    <label key={av} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '0.9rem', color: '#555' }}>{av}</span>
                    </label>
                  ))}
                </div>
              </div>

            </aside>

            {/* Right Main Content */}
            <div style={{ flex: 1 }}>
              
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid #eae5df' }}>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>Showing {products.length} Products</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By</span>
                  <select style={{ padding: '8px 16px', border: '1px solid #eae5df', background: '#faf9f8', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                {products.map((product, i) => (
                  <div key={product.id} className="product-card reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s`, margin: 0 }}>
                    <div className="product-card__image-wrap" style={{ aspectRatio: '4/5', background: '#faf9f8' }}>
                      {product.tag && <span className="product-card__tag" style={{ zIndex: 2 }}>{product.tag}</span>}
                      <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="product-card__actions">
                        <button className="btn-icon">♥</button>
                      </div>
                    </div>
                    <div style={{ padding: '20px 0' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '400', margin: '0 0 8px', color: '#1a1a1a' }}>{product.name}</h3>
                      <div style={{ fontSize: '0.95rem', color: '#666' }}>{product.price}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
