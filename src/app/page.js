'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Star, Heart, ShoppingBag, Menu, X, Phone, Mail, MapPin, Share2, User, Search, ShieldCheck, Truck, Gem, Award, Sparkles, AlertCircle } from 'lucide-react';


// Custom social icons as inline SVGs
const Instagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const Facebook = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const Twitter = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l16 16M4 20L20 4"/><path d="M20 4h-5l-11 16h5"/>
  </svg>
);
import './App.css';

/* ─── Navbar ─── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    
    // Restore session and cart from localStorage asynchronously on mount
    setTimeout(() => {
      const storedEmail = localStorage.getItem('userEmail');
      const storedLoggedIn = localStorage.getItem('loggedIn') === 'true';
      if (storedLoggedIn) {
        setUserEmail(storedEmail || 'mark@example.com');
        setLoggedIn(true);
      }

      // Load cart items on mount
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
        // Default placeholder cart items (only run if first time visiting)
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
    }, 0);

    // Event listeners for cart updates and drawer state
    const handleCartUpdate = () => {
      const stored = localStorage.getItem('cartItems');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCartItems(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.error(e);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    
    const handleOpenDrawer = () => {
      setCartOpen(true);
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('openCartDrawer', handleOpenDrawer);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('openCartDrawer', handleOpenDrawer);
    };
  }, []);

  // Global addToCart action helper
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addToCart = (product, qty = 1, size = 'Medium') => {
        const storedCart = localStorage.getItem('cartItems');
        let cart = [];
        if (storedCart) {
          try {
            cart = JSON.parse(storedCart);
          } catch (e) {
            console.error(e);
          }
        }
        
        const priceNum = typeof product.price === 'string' 
          ? parseInt(product.price.replace(/[^0-9]/g, ''), 10) 
          : product.price;
          
        const existingItem = cart.find(item => item.id === product.id && item.size === size);
        if (existingItem) {
          existingItem.qty += qty;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: priceNum,
            img: product.img,
            size: size,
            qty: qty
          });
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new CustomEvent('openCartDrawer'));
      };
    }
  }, [userEmail]);

  const updateCartQty = (id, size, amount) => {
    const updated = cartItems.map(item => {
      if (item.id === id && item.size === size) {
        return { ...item, qty: Math.max(1, item.qty + amount) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeCartItem = (id, size) => {
    const updated = cartItems.filter(item => !(item.id === id && item.size === size));
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Retrieve value directly from form element to handle browser autofill
    const emailVal = e.target.elements.email?.value || userEmail || 'mark@example.com';
    setUserEmail(emailVal);
    setLoggedIn(true);
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userEmail', emailVal);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userEmail');
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const navItems = [
    { label: 'Collections', sub: ['Stone Jewelry', 'Marble Decor', 'Cristallo Quartzite Slabs'] },
    { label: 'Custom Studio', sub: [] },
    { label: 'About', sub: [] },
    { label: 'Contact', sub: [] },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__top">
        <span className="navbar__announcement">✦ Complimentary engraving on orders above ₹15,000 ✦ Free shipping pan India ✦</span>
      </div>
      <div className="navbar__main">
        <button className="navbar__mobile-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link href="/" className="navbar__logo">
          <span className="navbar__logo-icon">◈</span>
          <div>
            <div className="navbar__logo-name">ARTISTIC CRAFTS</div>
            <div className="navbar__logo-tagline">Luxury Atelier</div>
          </div>
        </Link>
        <ul className="navbar__links">
          {navItems.map((item) => (
            <li key={item.label}
              className="navbar__item"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}>
              {item.sub.length > 0 ? (
                <span className="navbar__link" style={{ cursor: 'pointer' }}>
                  {item.label} <ChevronDown size={12} />
                </span>
              ) : (
                <Link href={`/${item.label.toLowerCase().replace(/ /g, '-')}`} className="navbar__link">
                  {item.label}
                </Link>
              )}
              {item.sub.length > 0 && activeDropdown === item.label && (
                <div className="navbar__dropdown">
                  {item.sub.map(s => {
                    const slug = s.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                    const categorySlug = item.label.toLowerCase().replace(/ /g, '-');
                    const linkPath = `/${categorySlug}/${slug}`;
                    return (
                      <Link key={s} href={linkPath} className="navbar__dropdown-item">{s}</Link>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="navbar__actions">
          <button className="navbar__icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={18} />
          </button>
          <button 
            className="navbar__icon-btn" 
            aria-label="Account" 
            onClick={() => setLoginOpen(true)}
            style={{ position: 'relative', color: loggedIn ? 'var(--gold)' : 'inherit' }}
          >
            <User size={18} />
            {loggedIn && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#2ecc71',
                border: '1px solid rgba(255,255,255,0.8)'
              }} />
            )}
          </button>
          <button className="navbar__icon-btn" aria-label="Wishlist" onClick={() => alert('Wishlist updated. Items saved to your private dashboard.')}><Heart size={18} /></button>
          <button className="navbar__icon-btn navbar__cart-btn" aria-label="Cart" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={18} />
            <span className="navbar__cart-count">{cartCount}</span>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map(item => (
          <div key={item.label} className="navbar__mobile-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {item.sub.length > 0 ? (
              <>
                <span className="navbar__mobile-link" style={{ fontWeight: '600', color: 'var(--gold)', cursor: 'default' }}>
                  {item.label}
                </span>
                <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                  {item.sub.map(s => {
                    const slug = s.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                    const categorySlug = item.label.toLowerCase().replace(/ /g, '-');
                    const linkPath = `/${categorySlug}/${slug}`;
                    return (
                      <Link 
                        key={s} 
                        href={linkPath} 
                        className="navbar__mobile-sublink" 
                        onClick={() => setMenuOpen(false)}
                      >
                        {s}
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <Link 
                href={`/${item.label.toLowerCase().replace(/ /g, '-')}`} 
                className="navbar__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="cart-drawer-overlay" onClick={() => setCartOpen(false)} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()} style={{
            width: '100%',
            maxWidth: '420px',
            height: '100%',
            background: 'var(--marble-white)',
            borderLeft: '1px solid rgba(201, 169, 110, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            padding: '30px',
            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '400', margin: 0, color: 'var(--charcoal)', letterSpacing: '0.05em', fontFamily: 'var(--font-serif)' }}>Shopping Bag ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--warm-grey)', fontSize: '0.95rem' }}>
                  Your bag is empty
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(201, 169, 110, 0.1)', paddingBottom: '16px' }}>
                    <img src={item.img} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(201, 169, 110, 0.1)' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--charcoal)', margin: '0 0 4px' }}>{item.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: '500' }}>₹{item.price.toLocaleString('en-IN')}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--warm-grey)', textTransform: 'uppercase' }}>Size: {item.size}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eae5df', height: '28px' }}>
                          <button onClick={() => updateCartQty(item.id, item.size, -1)} style={{ width: '22px', background: 'none', border: 'none', cursor: 'pointer', height: '100%', fontSize: '0.8rem', padding: 0 }}>-</button>
                          <span style={{ fontSize: '0.8rem', padding: '0 4px', fontWeight: '500' }}>{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, item.size, 1)} style={{ width: '22px', background: 'none', border: 'none', cursor: 'pointer', height: '100%', fontSize: '0.8rem', padding: 0 }}>+</button>
                        </div>
                        <button onClick={() => removeCartItem(item.id, item.size)} style={{ background: 'none', border: 'none', color: '#999', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(201, 169, 110, 0.2)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.1rem', fontWeight: '500' }}>
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--warm-grey)', marginBottom: '20px', lineHeight: 1.5 }}>Taxes and shipping calculated at checkout.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href="/cart" className="btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', height: '48px' }} onClick={() => setCartOpen(false)}>
                  <span>View Bag & Checkout</span>
                </Link>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '48px', background: 'transparent', border: '1px solid var(--charcoal)', color: 'var(--charcoal)' }} onClick={() => setCartOpen(false)}>
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-overlay">
          <div className="search-overlay__header">
            <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', letterSpacing: '0.1em', fontSize: '1.2rem' }}>◈ ARTISTIC CRAFTS SEARCH</span>
            <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
              <X size={28} />
            </button>
          </div>
          <div className="search-overlay__input-wrap">
            <input 
              type="text" 
              className="search-overlay__input" 
              placeholder="Search curations, stone jewelry, slabs..." 
              autoFocus 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="search-overlay__results">
            {searchQuery.trim().length > 0 ? (
              [
                { name: 'Pink Crystal Beaded Bracelet', category: 'stone-jewelry', img: 'https://i.pinimg.com/736x/c6/b9/9e/c6b99ef41938e6186d097d554b44c921.jpg' },
                { name: 'Black & White Marble Bracelet', category: 'stone-jewelry', img: 'https://i.pinimg.com/736x/af/08/54/af08547deca93880bc23eb302ef60527.jpg' },
                { name: 'Hand-crafted Coasters Set', category: 'marble-decor', img: 'https://i.pinimg.com/736x/7b/26/39/7b263947af5bd40437e1d77abf879878.jpg' },
                { name: 'Cristallo Pink Quartzite Slab', category: 'cristallo-quartzite-slabs', img: 'https://i.pinimg.com/736x/92/a7/c5/92a7c5e96bc731477d866887ddab0efe.jpg' }
              ]
                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, idx) => {
                  const productSlug = item.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                  return (
                    <Link key={idx} href={`/shop/${productSlug}`} className="search-result-item" onClick={() => setSearchOpen(false)}>
                      <img src={item.img} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <div style={{ color: '#fff', fontSize: '1rem', fontWeight: '500' }}>{item.name}</div>
                        <div style={{ color: 'var(--gold)', fontSize: '0.75rem', textTransform: 'uppercase', marginTop: '2px' }}>{item.category.replace('-', ' ')}</div>
                      </div>
                    </Link>
                  );
                })
            ) : (
              <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>Type to search our signature collections...</p>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginOpen && (
        <div className="login-modal-overlay" onClick={() => setLoginOpen(false)}>
          <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLoginOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)' }}>
              <X size={20} />
            </button>
            {loggedIn ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201, 169, 110, 0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid var(--gold)' }}>◈</div>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--charcoal)', margin: 0 }}>Welcome Back</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Logged in as: <strong>{userEmail || 'mark@example.com'}</strong></p>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--charcoal)', marginBottom: '10px', textAlign: 'center' }}>
                  {isLogin ? 'Atelier Login' : 'Create Account'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Email Address</label>
                  <input type="email" name="email" required placeholder="mark@example.com" value={userEmail} onChange={e => setUserEmail(e.target.value)} style={{ padding: '12px', border: '1px solid #eae5df', outline: 'none', background: 'transparent', color: 'var(--charcoal)', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Password</label>
                  <input type="password" name="password" required placeholder="••••••••" style={{ padding: '12px', border: '1px solid #eae5df', outline: 'none', background: 'transparent', color: 'var(--charcoal)', fontFamily: 'inherit' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                  <span>{isLogin ? 'Sign In' : 'Register'}</span>
                </button>
                <p style={{ fontSize: '0.85rem', color: '#666', textAlign: 'center', margin: 0 }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--gold)', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontWeight: '500' }}>
                    {isLogin ? 'Register' : 'Login'}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ─── */
/* ─── Hero ─── */
function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      label: "Wearable Stone · Luxury Atelier",
      title: "Sculpted From Rare Earth.",
      subtitle: "Indulge in handcrafted stone jewelry and timeless objects, chiseled from Rajasthan and Carrara quarries and finished with 18k gold detailing.",
      img: "/images/jewelry.png",
      ctaText: "Explore Collection",
      ctaLink: "#shop"
    },
    {
      label: "Rare Reserves · Collector Slabs",
      title: "Geological Poetry In Slabs.",
      subtitle: "Italian Breccia Viola, Turkish Onyx, and Emerald Quartzite Slabs selected for exceptional veining structures and private residential commissions.",
      img: "/images/marble_hero.png",
      ctaText: "Browse Reserve",
      ctaLink: "#shop"
    },
    {
      label: "Heritage Stoneware · Home Artifacts",
      title: "Sculptural Objects For Living.",
      subtitle: "From chiseled marble trays and pedestals to solid onyx vessels. Elevate your spatial design with Rajasthan stone heritage.",
      img: "/images/founder.png",
      ctaText: "Discover Decor",
      ctaLink: "#shop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero-editorial">
      <div className="hero-editorial__container">
        {slides.map((s, idx) => (
          <div 
            key={idx} 
            className={`hero-editorial__slide ${activeSlide === idx ? 'active' : ''}`}
          >
            {/* Left Column: Typography Block */}
            <div className="hero-editorial__content-col">
              <span className="hero-editorial__label">{s.label}</span>
              <h1 className="hero-editorial__title">{s.title}</h1>
              <div className="gold-line" />
              <p className="hero-editorial__subtitle">{s.subtitle}</p>
              
              <div className="hero-editorial__actions">
                <Link href={s.ctaLink} className="btn-primary">
                  <span>{s.ctaText}</span>
                  <ArrowRight size={14} />
                </Link>
                <Link href="/custom-studio" className="btn-ghost">
                  Bespoke Commission
                </Link>
              </div>
            </div>
            
            {/* Right Column: Lifestyle Picture */}
            <div className="hero-editorial__image-col">
              <div className="hero-editorial__image-wrapper">
                <img src={s.img} alt={s.title} className="hero-editorial__img" />
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Dot Indicators */}
        <div className="hero-editorial__dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`hero-editorial__dot ${activeSlide === idx ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Trust Value Bar ─── */
function TrustBanner() {
  const trusts = [
    { icon: <Gem size={18} className="gold-text" />, title: "Jaipur Atelier", desc: "Ancestral Hand-chiseling" },
    { icon: <Sparkles size={18} className="gold-text" />, title: "Rare Reserves", desc: "Italian & Indian Slabs" },
    { icon: <Truck size={18} className="gold-text" />, title: "Insured Shipping", desc: "Secured White-glove Delivery" },
    { icon: <Award size={18} className="gold-text" />, title: "Heritage Sealed", desc: "Lifetime Authenticity" }
  ];

  return (
    <div className="trust-banner">
      <div className="container">
        <div className="trust-banner__grid">
          {trusts.map((t, idx) => (
            <div key={idx} className="trust-banner__item">
              <div className="trust-banner__icon-box">{t.icon}</div>
              <div className="trust-banner__text">
                <h4 className="trust-banner__title">{t.title}</h4>
                <p className="trust-banner__desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Featured Collections ─── */
function FeaturedCollections() {
  const collections = [
    { title: 'Stone Jewelry', subtitle: 'Wearable Stone', desc: 'Rings, pendants, earrings & bracelets carved from rare stone.', img: '/images/jewelry.png', tag: 'Limited Collection', class: 'col-left', link: '/collections/stone-jewelry', count: '48 items' },
    { title: 'Marble Decor', subtitle: 'Living in Stone', desc: 'Vases, sculptures & candle holders for discerning interiors.', img: '/images/decor.png', tag: 'Artisan Workshop', class: 'col-center', link: '/collections/marble-decor', count: '64 items' },
    { title: 'Cristallo Quartzite Slabs', subtitle: 'Rare & Exclusive', desc: 'Ultra-rare quartzite varieties in highly limited quantities.', img: '/images/black_marble.png', tag: 'Collector Private Reserve', class: 'col-right', link: '/collections/cristallo-quartzite-slabs', count: '12 left' },
  ];

  return (
    <section className="collections" id="collections">
      <div className="gold-glow-orb" style={{ top: '10%', left: '5%' }} />
      <div className="gold-glow-orb" style={{ bottom: '5%', right: '5%' }} />
      <div className="container">
        <div className="section-header reveal">
          <div className="section-label">Curated Collections</div>
          <h2 className="section-title">Where Stone Becomes Art</h2>
          <div className="gold-line center" />
          <p className="section-desc">Each collection tells a unique story of geological wonder transformed by human artistry.</p>
        </div>
        <div className="collections__grid collections__grid--asymmetrical">
          {collections.map((c, i) => (
            <div key={c.title} className={`collection-card collection-card--${c.class} reveal reveal-delay-${i + 1}`}>
              <div className="collection-card__img-wrap">
                <img src={c.img} alt={c.title} className="collection-card__img" />
                <div className="collection-card__overlay" />
                <div className="collection-card__badge-tag">{c.tag}</div>
                <div className="collection-card__count-tag">{c.count}</div>
                <div className="collection-card__border" />
                
                <div className="collection-card__floating-content">
                  <span className="collection-card__subtitle">{c.subtitle}</span>
                  <h3 className="collection-card__title">{c.title}</h3>
                  <p className="collection-card__desc">{c.desc}</p>
                  <Link href={c.link} className="collection-card__cta-btn">
                    <span>Explore Collection</span> <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Shop By Crystals ─── */
function ShopByCrystals() {
  const crystals = [
    { name: 'Pyrite', slug: 'pyrite', tag: 'Wealth & Solar Energy', desc: 'Attracts abundance, shields negativity, and fuels ambition.', img: '/images/Pyrite.webp' },
    { name: 'Garnet', slug: 'garnet', tag: 'Passion & Vitality', desc: 'Ignites creative fire, restores energy, and stimulates desire.', img: '/images/Garnet_434e07a9-af72-4158-8527-01f7b7cec3ca.webp' },
    { name: 'Citrine', slug: 'citrine', tag: 'Abundance & Mental Clarity', desc: 'The merchant\'s stone of prosperity, manifestation, and joy.', img: '/images/Citrine_1_001c9a19-d145-474e-b3ed-d8363d92c978.webp' },
    { name: 'Tiger Eye', slug: 'tigereye', tag: 'Courage & Dynamic Action', desc: 'Enhances focus, builds inner strength, and brings good fortune.', img: '/images/Tiger_Eye_76ccab7b-fa31-4a0b-a81d-31f198b2f09a (1).webp' },
    { name: 'Rose Quartz', slug: 'rosequartz', tag: 'Unconditional Love & Peace', desc: 'Opens the heart to self-love, deep healing, and relationship harmony.', img: '/images/Rose_Quartz_0b3ccc91-1368-48de-a332-599375982e4d (1).webp' },
    { name: 'Lapis Lazuli', slug: 'lapislazuli', tag: 'Wisdom & Intellectual Power', desc: 'Connects to inner truth, deep wisdom, and clear self-expression.', img: '/images/Lapis_Lazuli_5b5ff163-b2ab-4923-a2dd-1c1598e91687.webp' },
    { name: 'Amethyst', slug: 'amethyst', tag: 'Clarity & Divine Connection', desc: 'Calms active minds, purifies energy, and aids spiritual awareness.', img: '/images/Amethyst.webp' },
    { name: 'Selenite', slug: 'selenite', tag: 'Purification & Light Aura', desc: 'Clears stagnant energy blocks and channels high-frequency light.', img: '/images/Selenite.webp' },
  ];

  return (
    <section className="shop-crystals" id="crystals">
      <div className="container">
        <div className="section-header reveal" style={{ marginBottom: '50px' }}>
          <div className="section-label">Geological Sourcing</div>
          <h2 className="section-title" style={{ color: 'var(--charcoal)' }}>Shop by Crystal Energy</h2>
          <div className="gold-line center" />
          <p className="section-desc">Select an artifact based on the raw mineral crystal fused with its design.</p>
        </div>
        
        <div className="crystals-grid-container reveal">
          <div className="crystals-luxury-grid">
            {crystals.map((c, i) => (
              <Link
                key={c.name}
                href={`/collections/stone-jewelry?material=${encodeURIComponent(c.name)}`}
                className={`crystal-card crystal-card--${c.slug}`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className="crystal-img-container">
                  <div className="crystal-halo" />
                  <img src={c.img} alt={c.name} className="crystal-stone-img" />
                </div>
                <div className="crystal-pedestal" />
                
                <div className="crystal-card__content">
                  <h3 className="crystal-name">{c.name}</h3>
                  <div className="crystal-meta-tag-pill">
                    <span className="crystal-meta-tag">{c.tag}</span>
                  </div>
                  <p className="crystal-energy-desc">{c.desc}</p>
                  
                  <div className="crystal-card__explore">
                    <span>Discover {c.name} Jewelry</span>
                    <ArrowRight size={12} className="explore-arrow" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Brand Story ─── */
function BrandStory() {
  return (
    <section className="brand-story-editorial" id="story">
      <div className="container">
        <div className="brand-story-editorial__content reveal">
          <div className="section-label">The Artistic Crafts Philosophy</div>
          <h2 className="brand-story-editorial__title">Every Piece Begins With A Rare Earth Stone.</h2>
          <div className="gold-line center" />
          <p className="brand-story-editorial__text">
            Born in the historic marble quarries of Rajasthan, Artistic Crafts was founded on one uncompromising belief: that the earth's most extraordinary geological materials deserve to be worn, displayed, and cherished — not hidden in museums.
          </p>
          <p className="brand-story-editorial__text">
            Our founder traveled to over 12 countries sourcing the world's rarest mineral varieties — from Italian Calacatta Gold to translucent Turkish Onyx. Each stone is hand-selected for its unique veining, translucency, and individual character before our master artisans begin the meticulous process of hand-carving in our Jaipur atelier.
          </p>
          
          <div className="brand-story-editorial__cta">
            <Link href="/about" className="btn-ghost">
              Explore Our Heritage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Best Sellers ─── */
/* ─── Luxury Products Datasets ─── */
const jewelryProducts = [
  { id: 1, name: 'Pink Crystal Beaded Bracelet', price: '₹14,500', img: 'https://i.pinimg.com/736x/c6/b9/9e/c6b99ef41938e6186d097d554b44c921.jpg', tag: 'Best Seller', rating: 5, reviews: 48, stock: 3 },
  { id: 2, name: 'Black & White Marble Bracelet', price: '₹12,800', img: 'https://i.pinimg.com/736x/af/08/54/af08547deca93880bc23eb302ef60527.jpg', tag: 'New', rating: 5, reviews: 32, stock: 2 },
  { id: 3, name: 'Boho Marble Stone Bracelet', price: '₹13,200', img: 'https://i.pinimg.com/736x/87/4d/7c/874d7ca0a362d0ddc5246f32ab4bd28d.jpg', tag: 'Trending', rating: 4, reviews: 19, stock: 7 },
  { id: 4, name: 'Rose Quartz Connemara Bracelet', price: '₹11,500', img: 'https://i.pinimg.com/736x/b3/c8/34/b3c83472c84405efdd073a7a1b000fee.jpg', tag: 'Classic', rating: 5, reviews: 26, stock: 5 },
  { id: 5, name: 'Gray & Tan Watercolor Bracelet', price: '₹15,400', img: 'https://i.pinimg.com/736x/50/52/02/5052028ef58a458f0a312ed6a3c4381c.jpg', tag: 'Staff Pick', rating: 5, reviews: 14, stock: 3 },
  { id: 6, name: 'Rainbow Marble Bracelet', price: '₹16,800', img: 'https://i.pinimg.com/736x/b5/42/89/b54289333d78d91ef9e1a32d264ad1e6.jpg', tag: 'Exclusive', rating: 5, reviews: 11, stock: 2 },
];

const decorProducts = [
  { id: 101, name: 'Resin Coaster Set White & Gold', price: '₹12,400', img: 'https://i.pinimg.com/736x/0a/31/b0/0a31b0ce9c2fadd9b9e044540c593801.jpg', tag: 'New Launch', rating: 5, reviews: 18, stock: 3 },
  { id: 103, name: 'Concrete Resin Art Dish', price: '₹11,000', img: 'https://i.pinimg.com/736x/ec/04/84/ec04843094fd1fc9821d5092d4c0402b.jpg', tag: 'Artisan Accent', rating: 5, reviews: 9, stock: 4 },
  { id: 104, name: 'Terrazzo Ceramic Holder Set', price: '₹6,800', img: 'https://i.pinimg.com/736x/3f/84/02/3f84023138a190c8b5e06d8cfc4444f8.jpg', tag: 'Modern', rating: 4, reviews: 22, stock: 8 },
  { id: 201, name: 'Marble Vanity Tray', price: '₹18,500', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800', tag: 'Atelier Spec', rating: 5, reviews: 15, stock: 2 },
];

const slabProducts = [
  { id: 102, name: 'Cristallo Pink Quartzite Slab', price: '₹1,45,000', img: 'https://i.pinimg.com/736x/92/a7/c5/92a7c5e96bc731477d866887ddab0efe.jpg', tag: 'Ultra Luxury', rating: 5, reviews: 6, stock: 1 },
  { id: 106, name: 'Cristallo Rose Soft Touch Slab', price: '₹1,65,000', img: 'https://i.pinimg.com/736x/6b/50/ca/6b50cae255f42bdd1cc4ec34038d8594.jpg', tag: 'Exclusive Slab', rating: 5, reviews: 4, stock: 1 },
  { id: 202, name: 'Emerald Onyx Backlit Slab', price: '₹2,10,000', img: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800', tag: 'Private Reserve', rating: 5, reviews: 3, stock: 1 },
];

/* ─── Luxury Product Card Component ─── */
function ProductCard({ product, wishlist, toggleWishlist }) {
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [added, setAdded] = useState(false);

  const sizes = ['Small', 'Medium', 'Large'];
  const isSlab = product.price.includes('1,') || product.price.includes('2,');

  const handleAdd = () => {
    if (typeof window !== 'undefined' && window.addToCart) {
      window.addToCart(product, 1, isSlab ? 'Standard' : selectedSize);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="luxury-product-card">
      <div className="luxury-product-card__img-wrap">
        <img src={product.img} alt={product.name} className="luxury-product-card__img" />
        <div className="luxury-product-card__tag">{product.tag}</div>
        
        {product.stock <= 3 && (
          <div className="luxury-product-card__stock-alert">
            <AlertCircle size={10} /> Only {product.stock} left in Jaipur
          </div>
        )}

        <div className="luxury-product-card__actions">
          <button 
            type="button"
            className={`luxury-product-card__wish ${wishlist.includes(product.id) ? 'active' : ''}`}
            onClick={() => toggleWishlist(product.id)} 
            aria-label="Add to wishlist"
          >
            <Heart size={15} fill={wishlist.includes(product.id) ? 'var(--gold)' : 'none'} />
          </button>
        </div>

        {/* Dynamic Action Drawer Overlay (Reveals on Hover) */}
        <div className="luxury-product-card__drawer">
          {!isSlab && (
            <div className="luxury-product-card__sizes">
              <span className="sizes-title">Select Size:</span>
              <div className="sizes-chips">
                {sizes.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`size-chip ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button 
            type="button"
            className={`luxury-product-card__add-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
          >
            <ShoppingBag size={14} />
            <span>{added ? 'Added to Cart' : 'Quick Add'}</span>
          </button>
        </div>

        <div className="luxury-product-card__360">360°</div>
      </div>
      
      <div className="luxury-product-card__info">
        <div className="luxury-product-card__rating-row">
          <div className="luxury-product-card__stars">
            {Array.from({ length: product.rating }).map((_, i) => (
              <Star key={i} size={11} fill="var(--gold)" stroke="none" />
            ))}
          </div>
          <span className="luxury-product-card__reviews-count">({product.reviews} reviews)</span>
        </div>
        <h4 className="luxury-product-card__name">{product.name}</h4>
        <div className="luxury-product-card__price-row">
          <span className="luxury-product-card__price">{product.price}</span>
          {!isSlab && <span className="luxury-product-card__size-indicator">Size: {selectedSize}</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Atelier Registry (Unified Tabbed Catalog) ─── */
function AtelierRegistry() {
  const [activeTab, setActiveTab] = useState('jewelry');
  const [wishlist, setWishlist] = useState([]);

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

  const tabs = [
    { id: 'jewelry', label: 'Bespoke Jewelry', products: jewelryProducts },
    { id: 'decor', label: 'Artisan Decor', products: decorProducts },
    { id: 'slabs', label: 'Rare Quartzite Slabs', products: slabProducts }
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <section className="atelier-registry" id="shop">
      <div className="gold-glow-orb" style={{ top: '25%', right: '5%' }} />
      <div className="container">
        <div className="section-header reveal">
          <div className="section-label">Atelier Registry</div>
          <h2 className="section-title">Shop Exclusive Pieces</h2>
          <div className="gold-line center" />
          <p className="section-desc">Hand-carved artifacts from our Jaipur workshop. Limited quantities available.</p>
        </div>

        {/* Elegant Tab Selector Bar */}
        <div className="atelier-registry__tabs-bar">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              className={`atelier-registry__tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              <span className="tab-btn__count">({t.products.length})</span>
            </button>
          ))}
        </div>

        {/* Tab Content Catalog Grid */}
        <div className="atelier-registry__grid-wrap">
          <div className="atelier-registry__grid animate-fade-in" key={activeTab}>
            {currentTab.products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        </div>

        <div className="atelier-registry__cta reveal">
          <Link href="/collections/stone-jewelry" className="btn-primary">
            <span>Explore Full Catalog</span> <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}

/* ─── Craftsmanship Accordion Gallery (Interactive Vertical Accordion) ─── */
function CraftsmanshipTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { num: '01', title: 'Stone Selection', desc: 'Our geologists travel to the world\'s finest quarries in Rajasthan, Carrara, and Turkey to hand-select slabs with exceptional veining and character.', img: '/images/marble_hero.png' },
    { num: '02', title: 'Hand Carving', desc: 'Master artisans with decades of inherited heritage shape each piece using traditional hand-chisels and diamond-edged saws.', img: '/images/founder.png' },
    { num: '03', title: 'Refined Polishing', desc: 'Seven stages of mechanical and hand polishing bring out the stone\'s natural translucency and mirror-like mirror finish.', img: '/images/decor.png' },
    { num: '04', title: '18K Gold Inlays', desc: 'Certified goldsmiths apply liquid 18k gold detailing, fusing metal into the marble\'s natural gray veins.', img: '/images/jewelry.png' },
    { num: '05', title: 'Final Inspection', desc: 'Each artifact undergoes a rigorous 47-point quality test to receive the Artistic Crafts atelier seal of authenticity.', img: '/images/custom.png' },
  ];

  return (
    <section className="craftsmanship" id="craftsmanship">
      <div className="container craftsmanship__grid-sticky">
        
        {/* Left Side: Museum Visual Gallery */}
        <div className="craftsmanship__sticky-visual">
          <div className="sticky-img-container">
            {steps.map((step, i) => (
              <img
                key={step.num}
                src={step.img}
                alt={step.title}
                className={`sticky-process-img ${activeStep === i ? 'active' : ''}`}
              />
            ))}
            <div className="sticky-img-overlay" />
            <div className="sticky-badge">
              <span className="sticky-badge-num">{steps[activeStep].num}</span>
              <span className="sticky-badge-label">Active Step</span>
            </div>
          </div>
        </div>

        {/* Right Side: Accordion content */}
        <div className="craftsmanship__scroll-content">
          <div className="section-label" style={{ color: 'var(--gold-light)' }}>Artisan Ritual</div>
          <h2 className="section-title text-white">The Craftsmanship Process</h2>
          <div className="gold-line" />
          
          <div className="process-steps">
            {steps.map((step, i) => (
              <div 
                key={step.num} 
                className={`process-step-block ${activeStep === i ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(i)}
                onClick={() => setActiveStep(i)}
              >
                <div className="process-step-header">
                  <div className="process-step-header-left">
                    <span className="process-step-num">{step.num}</span>
                    <h3 className="process-step-title">{step.title}</h3>
                  </div>
                  <ChevronDown className="chevron-icon" size={20} />
                </div>
                
                <div className="process-step-desc-wrapper">
                  <p className="process-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─── Custom Design Studio Promo Showcase ─── */
export function CustomDesignStudio() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. The Concept Sketch",
      subtitle: "Bespoke Consult",
      desc: "Share your vision, dimensions, or a simple moodboard. Our Rajasthan-based designer translates your idea into an exact digital blueprint or hand-drawn perspective sketch.",
      image: "/images/custom.png"
    },
    {
      title: "2. Rare Stone Sourcing",
      subtitle: "Geological Sourcing",
      desc: "Choose from our private reserve of rare minerals. From Italian Breccia Viola to Emerald Onyx and Calacatta Gold marble, each slab features distinctive veining formed over eras.",
      image: "/images/marble_hero.png"
    },
    {
      title: "3. Ancestral Chiseled Carving",
      subtitle: "Rajasthani Craftsmanship",
      desc: "Our master carvers with inherited stone-craft lineage chisel your artifact by hand in our local workshop, ensuring a level of organic detail that no machine can match.",
      image: "/images/founder.png"
    },
    {
      title: "4. Liquid 18K Gold Inlay",
      subtitle: "Goldsmith Fusing",
      desc: "Enhance your commission with hand-fused 18-karat gold or sterling silver accents, seamlessly integrated into the natural crystalline fractures of the marble.",
      image: "/images/jewelry.png"
    }
  ];

  return (
    <section className="bespoke-promo" id="custom">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-label">Tailored Commissions</div>
          <h2 className="section-title">Design A One-of-a-Kind Piece</h2>
          <div className="gold-line center" />
          <p className="section-desc">
            Collaborate directly with our Rajasthan workshop to sculpt a signature artifact tailored to your exact style.
          </p>
        </div>

        <div className="bespoke-promo-grid reveal">
          
          {/* Left: Dynamic Visual Showcase */}
          <div className="bespoke-promo__visual-panel">
            <div className="bespoke-promo__image-container">
              {steps.map((step, idx) => (
                <img 
                  key={idx} 
                  src={step.image} 
                  alt={step.title}
                  className={`bespoke-promo-img ${activeStep === idx ? 'active' : ''}`}
                />
              ))}
              <div className="bespoke-promo__overlay" />
              <div className="bespoke-promo__badge">
                <span className="badge-num">{`0${activeStep + 1}`}</span>
                <span className="badge-label">{steps[activeStep].subtitle}</span>
              </div>
            </div>
          </div>

          {/* Right: Step-by-Step Interactive Details */}
          <div className="bespoke-promo__details-panel">
            <h3 className="bespoke-promo__headline">
              The Artisan Ritual
            </h3>
            <p className="bespoke-promo__subheadline">
              From raw earth block to museum-grade heirloom, every bespoke commission follows a centuries-old workflow.
            </p>

            <div className="bespoke-promo-steps">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className={`promo-step-card ${activeStep === idx ? 'active' : ''}`}
                  onMouseEnter={() => setActiveStep(idx)}
                  onClick={() => setActiveStep(idx)}
                >
                  <div className="promo-step-card__header">
                    <span className="promo-step-card__num">{`0${idx + 1}`}</span>
                    <h4 className="promo-step-card__title">{step.title}</h4>
                  </div>
                  <div className="promo-step-card__body">
                    <p className="promo-step-card__desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bespoke-promo__cta-box">
              <Link href="/custom-studio" className="btn-primary bespoke-promo__cta-btn">
                <span>Start Your Bespoke Journey</span>
                <ArrowRight size={18} />
              </Link>
              <span className="bespoke-promo__cta-note">
                ✦ Sketch consult is complimentary. No upfront fees required.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

/* ─── Interior Inspiration Gallery ─── */
function InspirationGallery() {
  const images = [
    { src: '/images/decor.png', title: 'Marble Minimalism', category: '01 / Minimalist Accent', span: 'wide' },
    { src: '/images/jewelry.png', title: 'Wearable Elegance', category: '02 / Personal Statement', span: 'narrow' },
    { src: '/images/custom.png', title: 'The Artisan\'s Hand', category: '03 / Workshop Process', span: 'narrow' },
    { src: '/images/marble_hero.png', title: 'Stone & Light', category: '04 / Geological Essence', span: 'wide' },
  ];

  return (
    <section className="inspiration" id="inspiration">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-label">Style Inspirations</div>
          <h2 className="section-title">Interior Harmony</h2>
          <div className="gold-line center" />
          <p className="section-desc">See how Artistic Crafts pieces transform living spaces into galleries of natural beauty</p>
        </div>
        <div className="inspiration__grid">
          {images.map((img, i) => (
            <div key={i} className={`inspiration-item inspiration-item--${img.span} reveal reveal-delay-${i + 1}`}>
              <div className="inspiration-item__img-wrap">
                <img src={img.src} alt={img.title} className="inspiration-item__img" />
                <div className="inspiration-item__border" />
                <div className="inspiration-item__overlay">
                  <span className="inspiration-item__category">{img.category}</span>
                  <h3 className="inspiration-item__title">{img.title}</h3>
                  <div className="inspiration-item__cta">
                    <span className="inspiration-item__link">Explore</span>
                    <ArrowRight size={14} className="inspiration-item__arrow" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const testimonials = [
    { name: 'Priya Sharma', title: 'Interior Designer, Mumbai', text: 'The Calacatta marble vase I commissioned for my client\'s penthouse is now the centerpiece of the entire space. The craftsmanship is absolutely unparalleled — it stopped three international guests in their tracks.' },
    { name: 'Arjun Mehta', title: 'CEO, Delhi', text: 'I gifted my wife the Carrara Signet Ring for our anniversary. She still gets asked about it everywhere she goes. Artistic Crafts has created something genuinely extraordinary — jewelry that tells a geological story.' },
    { name: 'Sofia Laurent', title: 'Luxury Hotel Director, Goa', text: 'We ordered a custom marble sculpture for our hotel lobby. The attention to detail, the communication throughout the process, and the final result exceeded every expectation. Worth every rupee.' }
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="testimonials-editorial">
      <div className="container">
        <div className="testimonials-editorial__wrapper reveal">
          <div className="section-label">Client Stories</div>
          <span className="quote-mark">“</span>
          
          <div className="testimonials-editorial__slide-box">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className={`testimonials-editorial__slide ${active === idx ? 'active' : ''}`}
              >
                <p className="testimonials-editorial__text">{t.text}</p>
                <h4 className="testimonials-editorial__author">{t.name}</h4>
                <span className="testimonials-editorial__title">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ─── Instagram Gallery ─── */
function InstagramGallery() {
  const posts = [
    { img: '/images/jewelry.png', likes: '2.4K', caption: 'Carrara meets gold ✦' },
    { img: '/images/decor.png', likes: '1.8K', caption: 'Marble moments 🤍' },
    { img: '/images/interior.png', likes: '3.1K', caption: 'Grand salon vibes' },
    { img: '/images/black_marble.png', likes: '4.2K', caption: 'Noir collection drop 🖤' },
    { img: '/images/custom.png', likes: '2.9K', caption: 'Crafted with intention' },
    { img: '/images/marble_hero.png', likes: '5.6K', caption: 'Stone is forever ◈' },
  ];

  return (
    <section className="instagram" id="instagram">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-label">@artisticcrafts.atelier</div>
          <h2 className="section-title">Follow Our World</h2>
          <div className="gold-line center" />
          <p className="section-desc">Step into our visual diary — where marble meets light, and craft becomes art</p>
        </div>
        <div className="instagram__grid">
          {posts.map((p, i) => (
            <div key={i} className={`instagram-post reveal reveal-delay-${(i % 4) + 1}`}>
              <img src={p.img} alt={p.caption} className="instagram-post__img" />
              <div className="instagram-post__overlay">
                <div className="instagram-post__overlay-icon"><Instagram size={22} /></div>
                <div className="instagram-post__likes">♥ {p.likes}</div>
                <p className="instagram-post__caption">{p.caption}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="instagram__cta reveal">
          <a href="#" className="btn-ghost" style={{ color: 'var(--charcoal)', borderColor: 'var(--gold)' }}>
            <Instagram size={16} />
            <span>Follow @artisticcrafts.atelier</span>
          </a>
        </div>
      </div>
    </section>
  );
}


/* ─── Footer ─── */
export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <Link href="/" className="footer__logo" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="footer__logo-icon shimmer-text">◈</span>
                <div>
                  <div className="footer__logo-name">ARTISTIC CRAFTS</div>
                  <div className="footer__logo-tagline">Luxury Atelier</div>
                </div>
              </Link>
              <p className="footer__brand-desc">Every piece begins with a rare stone, shaped by master hands, and designed to endure through generations.</p>
              <div className="footer__social">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="footer__social-link" aria-label="Social">
                    <Icon size={16} />
                  </a>
                ))}
                <a href="https://wa.me/" className="footer__social-link whatsapp" aria-label="WhatsApp">
                  <Phone size={16} />
                </a>
              </div>
            </div>

            {/* About */}
            <div className="footer__col">
              <h4 className="footer__col-title">About</h4>
              <Link href="/about" className="footer__link">Our Story</Link>
              <Link href="/collections/stone-jewelry" className="footer__link">Our Materials</Link>
              <Link href="/about" className="footer__link">Sustainability</Link>
              <Link href="/about" className="footer__link">Workshop</Link>
              <Link href="/contact" className="footer__link">Careers</Link>
            </div>
            {/* Contact */}
            <div className="footer__col">
              <h4 className="footer__col-title">Contact</h4>
              <div className="footer__contact-item">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={14} />
                <span>hello@artisticcrafts.in</span>
              </div>
              <div className="footer__contact-item">
                <MapPin size={14} />
                <span>Shop No.4, 6 Block, A Central Area Extension, Udaipur</span>
              </div>
              <div className="footer__contact-item" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--gold)', fontWeight: 500 }}>GSTIN:</span>
                <span>08CPEPJ3517C1Z9 (Rajasthan, Code: 08)</span>
              </div>
              <div className="footer__social" style={{ marginTop: '16px', marginBottom: '8px' }}>
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="footer__social-link" aria-label="Social">
                    <Icon size={16} />
                  </a>
                ))}
                <a href="https://wa.me/" className="footer__social-link whatsapp" aria-label="WhatsApp">
                  <Phone size={16} />
                </a>
              </div>
              <Link href="/contact" className="btn-primary footer__appt-btn"><span>Book Showroom Visit</span></Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p className="footer__copy">© 2025 ARTISTIC CRAFTS Luxury Atelier. All rights reserved.</p>
            <div className="footer__legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Returns & Exchanges</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Scroll Reveal Hook ─── */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });
    
    const observeNewElements = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        observer.observe(el);
      });
    };

    observeNewElements();

    const mutationObserver = new MutationObserver((mutations) => {
      let needsObserve = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          needsObserve = true;
          break;
        }
      }
      if (needsObserve) {
        observeNewElements();
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}

/* ─── App ─── */
export default function Home() {
  useScrollReveal();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBanner />
        <FeaturedCollections />
        <ShopByCrystals />
        <AtelierRegistry />
        <BrandStory />
        <CustomDesignStudio />
        <Testimonials />
        <InstagramGallery />
      </main>
      <Footer />
    </>
  );
}
