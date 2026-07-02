'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, SlidersHorizontal, ChevronDown, Heart, ShoppingBag } from 'lucide-react';
import '../../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../../page';
import { jewelryProducts, decorProducts, slabProducts, allProducts } from '../../utils/products';

export default function CollectionPage({ params }) {
  const { slug } = React.use(params);
  useScrollReveal();
  const [wishlist, setWishlist] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState([]);
  const [sortBy, setSortBy] = useState('Recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);


  useEffect(() => {
    const loadWishlist = () => {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        try {
          setWishlist(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadWishlist();
    window.addEventListener('wishlistUpdated', loadWishlist);
    return () => window.removeEventListener('wishlistUpdated', loadWishlist);
  }, []);

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id];
      localStorage.setItem('wishlist', JSON.stringify(next));
      window.dispatchEvent(new Event('wishlistUpdated'));
      return next;
    });
  };

  const toggleMaterial = (mat) => {
    setSelectedMaterials(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]);
  };

  const togglePrice = (pr) => {
    setSelectedPrices(prev => prev.includes(pr) ? prev.filter(p => p !== pr) : [...prev, pr]);
  };

  const toggleAvailability = (av) => {
    setSelectedAvailabilities(prev => prev.includes(av) ? prev.filter(a => a !== av) : [...prev, av]);
  };

  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let products = allProducts;
  if (slug === 'marble-jewelry' || slug === 'stone-jewelry') products = jewelryProducts;
  else if (slug === 'marble-decor') products = decorProducts;
  else if (slug === 'cristallo-quartzite-slabs') products = slabProducts;

  // Filter products dynamically
  const filteredProducts = products.filter(product => {
    // 1. Material filter
    if (selectedMaterials.length > 0) {
      const matchesMat = selectedMaterials.some(mat => 
        product.material.toLowerCase().includes(mat.toLowerCase())
      );
      if (!matchesMat) return false;
    }

    // 2. Price filter
    if (selectedPrices.length > 0) {
      const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''), 10);
      const matchesPrice = selectedPrices.some(range => {
        if (range === 'Under ₹500') return priceNum < 500;
        if (range === '₹500 - ₹1,000') return priceNum >= 500 && priceNum <= 1000;
        if (range === 'Above ₹1,000') return priceNum > 1000;
        return false;
      });
      if (!matchesPrice) return false;
    }

    // 3. Availability filter
    if (selectedAvailabilities.length > 0) {
      const isLimited = product.tag === 'Limited' || product.tag === 'Exclusive' || product.tag === 'Masterpiece';
      const isMadeToOrder = product.tag === 'Bespoke' || product.tag === 'Custom' || product.tag === 'Artisan';
      const isInStock = !isMadeToOrder;
      
      const matchesAv = selectedAvailabilities.some(av => {
        if (av === 'In Stock') return isInStock;
        if (av === 'Made to Order') return isMadeToOrder;
        if (av === 'Limited Edition') return isLimited;
        return false;
      });
      if (!matchesAv) return false;
    }

    return true;
  });

  // Sort products dynamically
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^0-9]/g, ''), 10);
    const priceB = parseInt(b.price.replace(/[^0-9]/g, ''), 10);

    if (sortBy === 'Price: Low to High') {
      return priceA - priceB;
    }
    if (sortBy === 'Price: High to Low') {
      return priceB - priceA;
    }
    if (sortBy === 'Newest Arrivals') {
      const scoreA = (a.tag === 'New' ? 100 : 0) + a.id;
      const scoreB = (b.tag === 'New' ? 100 : 0) + b.id;
      return scoreB - scoreA;
    }
    return 0;
  });

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
          <div className="collections-layout">
            
            {/* Left Sidebar - Desktop Only (hidden on mobile via CSS) */}
            <aside className="shop-sidebar collections-sidebar">
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
                  {['Black Obsidian', 'Tiger Eye', 'Rose Quartz', 'Amethyst', 'Green Aventurine', '7 Chakra Stones', 'Black Tourmaline', 'White Marble', 'Green Onyx', 'Quartzite'].map(mat => (
                    <label key={mat} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={selectedMaterials.includes(mat)} onChange={() => toggleMaterial(mat)} style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
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
                  {['Under ₹500', '₹500 - ₹1,000', 'Above ₹1,000'].map(price => (
                    <label key={price} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={selectedPrices.includes(price)} onChange={() => togglePrice(price)} style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
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
                      <input type="checkbox" checked={selectedAvailabilities.includes(av)} onChange={() => toggleAvailability(av)} style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '0.9rem', color: '#555' }}>{av}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Main Content */}
            <div className="collections-main">
              
              {/* Toolbar */}
              <div className="collections-toolbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Mobile Filter Toggle Button - visible only on mobile via CSS */}
                  <button
                    className="mobile-filter-toggle"
                    onClick={() => setMobileFilterOpen(prev => !prev)}
                    aria-label="Toggle Filters"
                  >
                    <SlidersHorizontal size={15} />
                    <span>{mobileFilterOpen ? 'Hide Filters' : 'Filters'}</span>
                  </button>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>Showing {sortedProducts.length} Products</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '8px 16px', border: '1px solid #eae5df', background: '#faf9f8', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Newest Arrivals">Newest Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Mobile Filter Drawer - shown below toolbar only on mobile when open */}
              <div className={`mobile-filter-drawer${mobileFilterOpen ? '' : ' hidden'}`}>
                {/* Filter Group: Material */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '600', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a1a1a' }}>Material</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Black Obsidian', 'Tiger Eye', 'Rose Quartz', 'Amethyst', 'Green Aventurine', '7 Chakra Stones', 'Black Tourmaline', 'White Marble', 'Green Onyx', 'Quartzite'].map(mat => (
                      <label key={mat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: selectedMaterials.includes(mat) ? '#f5efe6' : '#fff', border: `1px solid ${selectedMaterials.includes(mat) ? 'var(--gold)' : '#eae5df'}`, borderRadius: '4px', padding: '6px 12px' }}>
                        <input type="checkbox" checked={selectedMaterials.includes(mat)} onChange={() => toggleMaterial(mat)} style={{ accentColor: 'var(--gold)', width: '14px', height: '14px' }} />
                        <span style={{ fontSize: '0.82rem', color: '#555' }}>{mat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Filter Group: Price */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '600', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a1a1a' }}>Price</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Under ₹500', '₹500 - ₹1,000', 'Above ₹1,000'].map(price => (
                      <label key={price} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: selectedPrices.includes(price) ? '#f5efe6' : '#fff', border: `1px solid ${selectedPrices.includes(price) ? 'var(--gold)' : '#eae5df'}`, borderRadius: '4px', padding: '6px 12px' }}>
                        <input type="checkbox" checked={selectedPrices.includes(price)} onChange={() => togglePrice(price)} style={{ accentColor: 'var(--gold)', width: '14px', height: '14px' }} />
                        <span style={{ fontSize: '0.82rem', color: '#555' }}>{price}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Filter Group: Availability */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '600', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a1a1a' }}>Availability</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['In Stock', 'Made to Order', 'Limited Edition'].map(av => (
                      <label key={av} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: selectedAvailabilities.includes(av) ? '#f5efe6' : '#fff', border: `1px solid ${selectedAvailabilities.includes(av) ? 'var(--gold)' : '#eae5df'}`, borderRadius: '4px', padding: '6px 12px' }}>
                        <input type="checkbox" checked={selectedAvailabilities.includes(av)} onChange={() => toggleAvailability(av)} style={{ accentColor: 'var(--gold)', width: '14px', height: '14px' }} />
                        <span style={{ fontSize: '0.82rem', color: '#555' }}>{av}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="collections-grid">
                {sortedProducts.map((product, i) => {
                  const productSlug = product.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                  return (
                    <div key={product.id} className="product-card reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s`, margin: 0 }}>
                      <div className="product-card__img-wrap" style={{ aspectRatio: '4/5', background: '#faf9f8' }}>
                        {product.tag && <span className="product-card__tag" style={{ zIndex: 2 }}>{product.tag}</span>}
                        <Link href={`/shop/${productSlug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                          <img src={product.img} alt={product.name} className="product-card__img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Link>
                        <div className="product-card__actions">
                          <button className={`product-card__wish ${wishlist.includes(product.id) ? 'active' : ''}`}
                            onClick={() => toggleWishlist(product.id)} aria-label="Add to wishlist">
                            <Heart size={16} fill={wishlist.includes(product.id) ? '#C9A96E' : 'none'} />
                          </button>
                          <button 
                            className="product-card__add" 
                            aria-label="Add to cart"
                            onClick={() => {
                              if (typeof window !== 'undefined' && window.addToCart) {
                                window.addToCart(product);
                              }
                            }}
                          >
                            <ShoppingBag size={16} />
                            <span>Quick Add</span>
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: '16px 0' }}>
                        <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{product.material}</div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '400', margin: '0 0 6px', color: '#1a1a1a' }}>
                          <Link href={`/shop/${productSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {product.name}
                          </Link>
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{product.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
