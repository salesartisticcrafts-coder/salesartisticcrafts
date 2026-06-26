'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Star, Heart, ShoppingBag, Menu, X, Phone, Mail, MapPin, Share2, User, Search } from 'lucide-react';

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
                        style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.9rem' }}
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
function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [magnifier, setMagnifier] = useState({ x: 0, y: 0, xPercent: 0, yPercent: 0, show: false });
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  const slides = [
    {
      label: "Wearable Stone · Luxury Atelier",
      titleLine1: "Sculpted From",
      titleItalic1: " Rare Earth.",
      titleLine2: "Designed For",
      titleItalic2: " Eternity.",
      subtitle: "Indulge in handcrafted stone jewelry and timeless objects, carved from Rajasthan and Carrara quarries and finished with 18k gold detailing.",
      img: "/images/jewelry.png",
      ctaText: "Shop Jewelry",
      ctaLink: "#shop",
      glow: "rgba(224, 224, 224, 0.12)",
      colorName: "carrara-white",
      specs: {
        origin: "Carrara, Italy",
        veining: "Feathered Grey",
        density: "2.71 g/cm³",
        hardness: "3.5 Mohs",
        densityLevel: 85,
        hardnessLevel: 35,
        rarity: "Premium Selection"
      },
      coords: "44.0792° N, 10.1167° E",
      watermark: "C A R R A R A",
      slabName: "Carrara White",
      slabOrigin: "Italy"
    },
    {
      label: "Living In Stone · Bespoke Collection",
      titleLine1: "Artisan Decor",
      titleItalic1: " Refined.",
      titleLine2: "Elegance For",
      titleItalic2: " Your Space.",
      subtitle: "Discover minimalist vases, sculptures, and candle holders shaped by master hands to transform your home interiors.",
      img: "/images/decor.png",
      ctaText: "Explore Decor",
      ctaLink: "#collections",
      glow: "rgba(201, 169, 110, 0.12)",
      colorName: "artisan-gold",
      specs: {
        origin: "Rajasthan, India",
        veining: "Golden Thread",
        density: "2.65 g/cm³",
        hardness: "3.2 Mohs",
        densityLevel: 75,
        hardnessLevel: 32,
        rarity: "Atelier Exclusive"
      },
      coords: "26.9124° N, 75.7873° E",
      watermark: "A T E L I E R",
      slabName: "Rajasthan Gold",
      slabOrigin: "India"
    },
    {
      label: "Bespoke Commissions · Limited Edition",
      titleLine1: "Rare Marble",
      titleItalic1: " Masterpieces.",
      titleLine2: "Customized For",
      titleItalic2: " You.",
      subtitle: "Collaborate directly with our Rajasthan workshop to design a one-of-a-kind creation tailored to your exact style.",
      img: "/images/black_marble.png",
      ctaText: "Bespoke Atelier",
      ctaLink: "#custom",
      glow: "rgba(139, 105, 20, 0.1)",
      colorName: "nero-marquina",
      specs: {
        origin: "Markina, Spain",
        veining: "Calcite Striations",
        density: "2.69 g/cm³",
        hardness: "4.0 Mohs",
        densityLevel: 80,
        hardnessLevel: 40,
        rarity: "Highly Limited"
      },
      coords: "43.2683° N, 2.5008° W",
      watermark: "N E R O  N O I R",
      slabName: "Nero Marquina",
      slabOrigin: "Spain"
    }
  ];

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    startTimer();

    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Calculate tilt angles (max 10 degrees)
    const tiltX = (mouseY / (height / 2)) * -10;
    const tiltY = (mouseX / (width / 2)) * 10;
    setTilt({ x: tiltX, y: tiltY });

    // Calculate loupe position relative to the image
    const xPercent = ((e.clientX - rect.left) / width) * 100;
    const yPercent = ((e.clientY - rect.top) / height) * 100;
    
    setMagnifier({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      xPercent,
      yPercent,
      show: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setMagnifier(prev => ({ ...prev, show: false }));
  };

  const [particles] = useState(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
  })));

  return (
    <section
      className={`hero hero--v3 hero--${slides[activeSlide].colorName}`}
      id="hero"
      style={{ '--active-glow': slides[activeSlide].glow }}
    >
      {/* ── Animated Gradient Background ── */}
      <div className="hero__grad-bg" />

      {/* ── Cinematic Backdrop Images ── */}
      <div className="hero__cinema-wrap">
        {slides.map((s, idx) => (
          <div key={idx} className={`hero__cinema-slide ${activeSlide === idx ? 'active' : ''}`}>
            <img src={s.img} alt={s.slabName} className="hero__cinema-img" />
            <div className="hero__cinema-overlay" />
          </div>
        ))}
      </div>

      {/* ── Glow Orbs ── */}
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />

      {/* ── Noise Grain Texture ── */}
      <div className="hero__grain" />

      {/* ── Center Content ── */}
      <div className="hero__center-stage">

        {/* Label */}
        <div key={`label-${activeSlide}`} className="hero__badge animate-badge">
          <span className="hero__badge-dot" />
          {slides[activeSlide].label}
          <span className="hero__badge-dot" />
        </div>

        {/* Main Title */}
        <h1 key={`h1-${activeSlide}`} className="hero__mega-title">
          <span className="hero__mega-line hero__mega-line--1">
            {slides[activeSlide].titleLine1}
            <em className="hero__mega-italic">{slides[activeSlide].titleItalic1}</em>
          </span>
          <span className="hero__mega-line hero__mega-line--2">
            {slides[activeSlide].titleLine2}
            <em className="hero__mega-italic">{slides[activeSlide].titleItalic2}</em>
          </span>
        </h1>

        {/* Gold divider */}
        <div className="hero__gold-rule" />

        {/* Subtitle */}
        <p key={`sub-${activeSlide}`} className="hero__mega-subtitle">
          {slides[activeSlide].subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="hero__cta-group">
          <a href={slides[activeSlide].ctaLink} className="btn-primary hero__cta-primary">
            <span>{slides[activeSlide].ctaText}</span>
            <ArrowRight size={16} />
          </a>
          <a href="#custom" className="btn-ghost hero__cta-ghost">
            <span>Custom Atelier</span>
          </a>
        </div>

      </div>



      {/* ── Dot Navigation ── */}
      <div className="hero__dot-nav">
        {slides.map((s, idx) => (
          <button
            key={idx}
            className={`hero__dot ${activeSlide === idx ? 'active' : ''}`}
            onClick={() => { setActiveSlide(idx); startTimer(); }}
            aria-label={s.slabName}
          >
            {activeSlide === idx && (
              <svg className="hero__dot-ring" viewBox="0 0 32 32">
                <circle className="hero__dot-ring-bg" cx="16" cy="16" r="14" />
                <circle className="hero__dot-ring-fill" cx="16" cy="16" r="14" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* ── Slide Counter ── */}
      <div className="hero__slide-counter">
        <span className="hero__counter-current">0{activeSlide + 1}</span>
        <span className="hero__counter-sep" />
        <span className="hero__counter-total">0{slides.length}</span>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className="hero__scroll-indicator">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>

      {/* ── Corner Decorations ── */}
      <div className="hero__corner hero__corner--tl" />
      <div className="hero__corner hero__corner--br" />
    </section>
  );
}

/* ─── Featured Collections ─── */
function FeaturedCollections() {
  const collections = [
    { title: 'Stone Jewelry', subtitle: 'Wearable Stone', desc: 'Rings, pendants, earrings & bracelets carved from rare stone', img: '/images/jewelry.png', tag: '48 Pieces', class: 'col-left', link: '/collections/stone-jewelry' },
    { title: 'Marble Decor', subtitle: 'Living in Stone', desc: 'Vases, sculptures & candle holders for discerning interiors', img: '/images/decor.png', tag: '64 Pieces', class: 'col-center', link: '/collections/marble-decor' },
    { title: 'Cristallo Quartzite Slabs', subtitle: 'Rare & Exclusive', desc: 'Ultra-rare quartzite varieties in highly limited quantities', img: '/images/black_marble.png', tag: '12 Left', class: 'col-right', link: '/collections/cristallo-quartzite-slabs' },
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
          <p className="section-desc">Each collection tells a unique story of geological wonder transformed by human artistry</p>
        </div>
        <div className="collections__grid collections__grid--asymmetrical">
          {collections.map((c, i) => (
            <div key={c.title} className={`collection-card collection-card--${c.class} reveal reveal-delay-${i + 1}`}>
              <Link href={c.link} className="collection-card__img-wrap">
                <img src={c.img} alt={c.title} className="collection-card__img" />
                <div className="collection-card__overlay" />
                <div className="collection-card__tag">{c.tag}</div>
                <div className="collection-card__border" />
              </Link>
              <div className="collection-card__body">
                <div className="collection-card__subtitle">{c.subtitle}</div>
                <h3 className="collection-card__title">
                  <Link href={c.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {c.title}
                  </Link>
                </h3>
                <p className="collection-card__desc">{c.desc}</p>
                <Link href={c.link} className="collection-card__cta">
                  Explore <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Brand Story ─── */
function BrandStory() {
  return (
    <section className="brand-story" id="story">
      <div className="brand-story__marble-bg" />
      <div className="container">
        <div className="brand-story__grid">
          <div className="brand-story__image-overlap reveal">
            <div className="overlap-frame frame-1">
              <img src="/images/interior.png" alt="Luxury Marble Interior" className="overlap-img" />
              <div className="overlap-img-border" />
            </div>
            <div className="overlap-frame frame-2">
              <img src="/images/founder.png" alt="Atelier Craftsmanship" className="overlap-img" />
              <div className="overlap-img-border" />
              <div className="overlap-badge">
                <span className="overlap-badge-year">2019</span>
                <span className="overlap-badge-text">Est. Atelier</span>
              </div>
            </div>
          </div>
          <div className="brand-story__content reveal reveal-delay-2">
            <div className="section-label">Our Story</div>
            <div className="gold-line" />
            <h2 className="brand-story__title">
              Every Piece Begins With A<br />
              <em className="shimmer-text"> Rare Stone.</em>
            </h2>
            <p className="brand-story__text drop-cap">
              Born in the historic marble quarries of Rajasthan, Artistic Crafts was founded on one uncompromising belief: that the earth&apos;s most extraordinary geological materials deserve to be worn, displayed, and cherished — not hidden in museums.
            </p>
            <p className="brand-story__text">
              Our founder traveled to over 12 countries sourcing the world&apos;s rarest marble varieties — from Italian Calacatta Gold to translucent Turkish Onyx. Each stone is hand-selected for its unique veining, translucency, and individual character before our master artisans begin the meticulous process of hand-carving.
            </p>
            <div className="brand-story__pillars">
              {[['Handcrafted Signature', 'Every piece individually chiseled by hand'], ['Ethically Quarried', 'Responsibility to the earth and our communities'], ['Designed for Eternity', 'Crafted to endure through generations']].map(([t, d]) => (
                <div key={t} className="brand-story__pillar">
                  <div className="brand-story__pillar-icon">◈</div>
                  <div>
                    <div className="brand-story__pillar-title">{t}</div>
                    <div className="brand-story__pillar-desc">{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn-primary"><span>Read Our Full Story</span> <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Best Sellers ─── */
function BestSellers() {
  const [wishlist, setWishlist] = useState([]);
  const products = [
    { id: 1, name: 'Pink Crystal Beaded Bracelet', price: '₹14,500', img: 'https://i.pinimg.com/736x/c6/b9/9e/c6b99ef41938e6186d097d554b44c921.jpg', tag: 'Best Seller', rating: 5 },
    { id: 2, name: 'Black & White Marble Bracelet', price: '₹12,800', img: 'https://i.pinimg.com/736x/af/08/54/af08547deca93880bc23eb302ef60527.jpg', tag: 'New', rating: 5 },
    { id: 3, name: 'Boho Marble Stone Bracelet', price: '₹13,200', img: 'https://i.pinimg.com/736x/87/4d/7c/874d7ca0a362d0ddc5246f32ab4bd28d.jpg', tag: 'Trending', rating: 4 },
    { id: 4, name: 'Rose Quartz Connemara Bracelet', price: '₹11,500', img: 'https://i.pinimg.com/736x/b3/c8/34/b3c83472c84405efdd073a7a1b000fee.jpg', tag: 'Classic', rating: 5 },
    { id: 5, name: 'Gray & Tan Watercolor Bracelet', price: '₹15,400', img: 'https://i.pinimg.com/736x/50/52/02/5052028ef58a458f0a312ed6a3c4381c.jpg', tag: 'Staff Pick', rating: 5 },
    { id: 6, name: 'Rainbow Marble Bracelet', price: '₹16,800', img: 'https://i.pinimg.com/736x/b5/42/89/b54289333d78d91ef9e1a32d264ad1e6.jpg', tag: 'Exclusive', rating: 5 },
  ];

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

  return (
    <section className="best-sellers" id="shop" style={{ paddingBottom: '30px' }}>
      <div className="gold-glow-orb" style={{ top: '25%', right: '5%' }} />
      <div className="container">
        <div className="section-header reveal">
          <div className="section-label">Most Coveted</div>
          <h2 className="section-title">Best Sellers</h2>
          <div className="gold-line center" />
        </div>
      </div>
      <div className="best-sellers__scroll-wrap">
        <div className="best-sellers__track">
          {products.map(p => (
            <div key={p.id} className="product-card">
              <div className="product-card__img-wrap">
                <img src={p.img} alt={p.name} className="product-card__img" />
                <div className="product-card__tag">{p.tag}</div>
                <div className="product-card__actions">
                  <button className={`product-card__wish ${wishlist.includes(p.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(p.id)} aria-label="Add to wishlist">
                    <Heart size={16} fill={wishlist.includes(p.id) ? '#C9A96E' : 'none'} />
                  </button>
                  <button 
                    className="product-card__add" 
                    aria-label="Add to cart"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.addToCart) {
                        window.addToCart(p);
                      }
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span>Quick Add</span>
                  </button>
                </div>
                <div className="product-card__360">360°</div>
              </div>
              <div className="product-card__info">
                <div className="product-card__stars">
                  {Array.from({ length: p.rating }).map((_, i) => (
                    <Star key={i} size={10} fill="#C9A96E" stroke="none" />
                  ))}
                </div>
                <h4 className="product-card__name">{p.name}</h4>
                <div className="product-card__price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="best-sellers__cta reveal">
        <Link href="/collections/stone-jewelry" className="btn-primary"><span>View All Products</span> <ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}

/* ─── New Arrivals ─── */
function NewArrivals() {
  const [wishlist, setWishlist] = useState([]);
  const products = [
    { id: 101, name: 'Resin Coaster Set White & Gold', price: '₹12,400', img: 'https://i.pinimg.com/736x/0a/31/b0/0a31b0ce9c2fadd9b9e044540c593801.jpg', tag: 'New', rating: 5 },
    { id: 102, name: 'Cristallo Pink Quartzite Slab', price: '₹1,45,000', img: 'https://i.pinimg.com/736x/92/a7/c5/92a7c5e96bc731477d866887ddab0efe.jpg', tag: 'Luxury', rating: 5 },
    { id: 103, name: 'Concrete Resin Art Dish', price: '₹11,000', img: 'https://i.pinimg.com/736x/ec/04/84/ec04843094fd1fc9821d5092d4c0402b.jpg', tag: 'Artisan', rating: 5 },
    { id: 104, name: 'Terrazzo Ceramic Holder Set', price: '₹6,800', img: 'https://i.pinimg.com/736x/3f/84/02/3f84023138a190c8b5e06d8cfc4444f8.jpg', tag: 'Modern', rating: 4 },
    { id: 105, name: 'Gray & Tan Watercolor Bracelet', price: '₹15,400', img: 'https://i.pinimg.com/736x/50/52/02/5052028ef58a458f0a312ed6a3c4381c.jpg', tag: 'Popular', rating: 5 },
    { id: 106, name: 'Cristallo Rose Soft Touch Slab', price: '₹1,65,000', img: 'https://i.pinimg.com/736x/6b/50/ca/6b50cae255f42bdd1cc4ec34038d8594.jpg', tag: 'Exclusive', rating: 5 },
  ];

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

  return (
    <section className="best-sellers" id="new-arrivals" style={{ paddingTop: '40px', paddingBottom: '50px', borderTop: '1px solid rgba(201, 169, 110, 0.15)' }}>
      <div className="gold-glow-orb" style={{ bottom: '25%', left: '5%' }} />
      <div className="container">
        <div className="section-header reveal">
          <div className="section-label">Latest Concept Launches</div>
          <h2 className="section-title">New Arrivals</h2>
          <div className="gold-line center" />
        </div>
      </div>
      <div className="best-sellers__scroll-wrap">
        <div className="best-sellers__track">
          {products.map(p => (
            <div key={p.id} className="product-card">
              <div className="product-card__img-wrap">
                <img src={p.img} alt={p.name} className="product-card__img" />
                <div className="product-card__tag">{p.tag}</div>
                <div className="product-card__actions">
                  <button className={`product-card__wish ${wishlist.includes(p.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(p.id)} aria-label="Add to wishlist">
                    <Heart size={16} fill={wishlist.includes(p.id) ? '#C9A96E' : 'none'} />
                  </button>
                  <button 
                    className="product-card__add" 
                    aria-label="Add to cart"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.addToCart) {
                        window.addToCart(p);
                      }
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span>Quick Add</span>
                  </button>
                </div>
                <div className="product-card__360">360°</div>
              </div>
              <div className="product-card__info">
                <div className="product-card__stars">
                  {Array.from({ length: p.rating }).map((_, i) => (
                    <Star key={i} size={10} fill="#C9A96E" stroke="none" />
                  ))}
                </div>
                <h4 className="product-card__name">{p.name}</h4>
                <div className="product-card__price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="best-sellers__cta reveal">
        <Link href="/collections/stone-jewelry" className="btn-primary"><span>Explore All Collections</span> <ArrowRight size={16} /></Link>
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

/* ─── Custom Design Studio (Atelier Configurator) ─── */
export function CustomDesignStudio() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMarble, setSelectedMarble] = useState('Carrara White');
  const [engraving, setEngraving] = useState('');
  const [fontStyle, setFontStyle] = useState('Serif');
  const [uploadName, setUploadName] = useState('');
  const [userName, setUserName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [quoteRequested, setQuoteRequested] = useState(false);

  const getMarbleTexture = (name) => {
    switch(name) {
      case 'Carrara White': return 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600';
      case 'Nero Marquina': return 'https://images.unsplash.com/photo-1618220136852-87a41ec591ee?q=80&w=600';
      case 'Calacatta Gold': return 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600';
      case 'Turkish Onyx': return 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=600';
      case 'Breccia Viola': return 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=600';
      case 'Verde Alpi': return 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600';
      default: return 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600';
    }
  };

  const getFontFamily = (style) => {
    switch(style) {
      case 'Serif': return 'var(--font-serif), Georgia, serif';
      case 'Script': return 'cursive';
      case 'Modern': return 'var(--font-sans), system-ui, sans-serif';
      case 'Classic': return 'Times New Roman, Times, serif';
      default: return 'inherit';
    }
  };

  const steps = ['Upload Reference', 'Choose Marble', 'Add Engraving', 'Confirm details'];
  const marbles = [
    { name: 'Carrara White', origin: 'Italy', price: 'Standard' },
    { name: 'Nero Marquina', origin: 'Spain', price: 'Premium' },
    { name: 'Calacatta Gold', origin: 'Italy', price: 'Exclusive' },
    { name: 'Turkish Onyx', origin: 'Turkey', price: 'Exclusive' },
    { name: 'Breccia Viola', origin: 'Italy', price: 'Premium' },
    { name: 'Verde Alpi', origin: 'Greece', price: 'Standard' }
  ];
  const fonts = ['Serif', 'Script', 'Modern', 'Classic'];

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadName(e.target.files[0].name);
    }
  };

  return (
    <section className="custom-studio" id="custom">
      <div className="gold-glow-orb" style={{ top: '45%', left: '40%' }} />
      <div className="container">
        <div className="section-header reveal">
          <div className="section-label">Bespoke Atelier</div>
          <h2 className="section-title">Design A One-of-a-Kind Piece</h2>
          <div className="gold-line center" />
          <p className="section-desc">Collaborate with our master artisans to shape a bespoke creation suited to your space or style</p>
        </div>

        <div className="custom-studio__configurator-grid reveal">
          
          {/* Left: Interactive Configurator Panel */}
          <div className="configurator-panel">
            <div className="configurator-steps-nav">
              {steps.map((s, i) => (
                <button 
                  key={s} 
                  className={`configurator-step-btn ${activeStep === i ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}
                  onClick={() => setActiveStep(i)}
                >
                  <span className="step-num">{i < activeStep ? '✓' : `0${i + 1}`}</span>
                  <span className="step-label">{s}</span>
                </button>
              ))}
            </div>

            <div className="configurator-content-box">
              {activeStep === 0 && (
                <div className="config-slide">
                  <h3 className="config-slide-title">Upload Design Reference</h3>
                  <p className="config-slide-desc">Upload a sketch, drawing, or reference image of the jewelry or decor piece you want.</p>
                  
                  <label className="config-upload-area">
                    <input type="file" accept="image/*" className="hidden-input" onChange={handleFileUpload} />
                    <div className="upload-icon">⊕</div>
                    <span className="upload-text">{uploadName ? `Uploaded: ${uploadName}` : 'Click to Browse Files'}</span>
                    <span className="upload-sub">Supports JPG, PNG, PDF up to 10MB</span>
                  </label>
                </div>
              )}

              {activeStep === 1 && (
                <div className="config-slide">
                  <h3 className="config-slide-title">Select Rare Stone Variety</h3>
                  <p className="config-slide-desc">Choose the specific type of marble or onyx to carve your commission from.</p>
                  
                  <div className="marble-selector-grid">
                    {marbles.map(m => (
                      <button 
                        key={m.name} 
                        className={`marble-option-card ${selectedMarble === m.name ? 'active' : ''}`}
                        onClick={() => setSelectedMarble(m.name)}
                      >
                        <div className="marble-option-info">
                          <span className="marble-name">{m.name}</span>
                          <span className="marble-origin">{m.origin}</span>
                        </div>
                        <span className="marble-tier">{m.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="config-slide">
                  <h3 className="config-slide-title">Inscribe Personal Engraving</h3>
                  <p className="config-slide-desc">Personalize your artifact with initials, a date, or a statement (maximum 40 characters).</p>
                  
                  <input 
                    type="text" 
                    placeholder="Enter engraving text (e.g. 'ETERNITY')" 
                    className="config-text-input"
                    maxLength={40}
                    value={engraving}
                    onChange={e => setEngraving(e.target.value)}
                  />

                  <div className="font-selector-wrap">
                    <span className="selector-label-text">Select Typography Style:</span>
                    <div className="font-chips">
                      {fonts.map(f => (
                        <button 
                          key={f} 
                          className={`font-chip ${fontStyle === f ? 'active' : ''}`}
                          onClick={() => setFontStyle(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="config-slide">
                  <h3 className="config-slide-title">Atelier Quote Request</h3>
                  {quoteRequested ? (
                    <div className="quote-success-panel">
                      <div className="success-icon">◈</div>
                      <h4 className="success-title">Quote Requested Successfully</h4>
                      <p className="success-desc">Our design consultant will contact you on WhatsApp within 3 hours with a custom sketch and price quote.</p>
                    </div>
                  ) : (
                    <>
                      <p className="config-slide-desc">Enter your contact details to submit the commission request to our workshop.</p>
                      <div className="contact-form-inputs">
                        <input 
                          type="text" 
                          placeholder="Your Full Name" 
                          className="config-text-input" 
                          value={userName} 
                          onChange={e => setUserName(e.target.value)}
                          required
                        />
                        <input 
                          type="tel" 
                          placeholder="WhatsApp Number (for drawings preview)" 
                          className="config-text-input" 
                          value={whatsapp} 
                          onChange={e => setWhatsapp(e.target.value)}
                          required
                        />
                        <button 
                          className="btn-primary" 
                          style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                          onClick={() => {
                            if (userName && whatsapp) setQuoteRequested(true);
                          }}
                        >
                          <span>Submit Configurator Details</span> <ArrowRight size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="configurator-footer-nav">
              <button 
                className="btn-ghost" 
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
              >
                ← Back
              </button>
              {activeStep < 3 && (
                <button 
                  className="btn-primary" 
                  onClick={() => setActiveStep(prev => Math.min(3, prev + 1))}
                >
                  <span>Continue</span> <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Floating Quote Preview Receipt (Live Atelier Invoice Card) */}
          <div className="quote-preview-receipt">
            <div className="receipt-border-decor" />
            <div className="receipt-header">
              <span className="receipt-brand">ARTISTIC CRAFTS ATELIER</span>
              <span className="receipt-serial">INV-2025-BESPOKE</span>
            </div>
            
            {/* Live Configurator Preview */}
            <div style={{ 
              width: '100%', 
              height: '140px', 
              borderRadius: '4px', 
              position: 'relative', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(201, 169, 110, 0.2)',
              backgroundImage: `url(${getMarbleTexture(selectedMarble)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%)',
                pointerEvents: 'none'
              }} />
              
              {engraving ? (
                <div style={{
                  color: 'var(--gold)',
                  fontSize: '1.2rem',
                  letterSpacing: '0.15em',
                  fontWeight: '600',
                  textShadow: '1px 1px 0px rgba(0,0,0,0.7), -1px -1px 0px rgba(0,0,0,0.7), 2px 2px 8px rgba(0,0,0,0.5)',
                  fontFamily: getFontFamily(fontStyle),
                  padding: '6px 12px',
                  border: '1px solid rgba(201,169,110,0.4)',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  backdropFilter: 'blur(1px)',
                  textTransform: 'uppercase',
                  maxWidth: '90%',
                  textAlign: 'center',
                  wordBreak: 'break-all'
                }}>
                  {engraving}
                </div>
              ) : (
                <span style={{ color: '#fff', fontSize: '0.8rem', letterSpacing: '0.05em', backgroundColor: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '2px' }}>
                  Awaiting Engraving Text
                </span>
              )}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                fontSize: '0.55rem',
                color: '#fff',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '2px 6px',
                borderRadius: '2px',
                letterSpacing: '0.05em'
              }}>
                LIVE PREVIEW
              </div>
            </div>

            <div className="receipt-divider" />
            
            <h4 className="receipt-title">Commission Summary</h4>
            
            <div className="receipt-items">
              <div className="receipt-item">
                <span className="item-label">Design File</span>
                <span className="item-value">{uploadName ? uploadName : 'No file uploaded'}</span>
              </div>
              <div className="receipt-item">
                <span className="item-label">Stone Selection</span>
                <span className="item-value">{selectedMarble}</span>
              </div>
              <div className="receipt-item">
                <span className="item-label">Engraving Text</span>
                <span className="item-value">{engraving ? `"${engraving}"` : 'None'}</span>
              </div>
              <div className="receipt-item">
                <span className="item-label">Font Type</span>
                <span className="item-value">{fontStyle}</span>
              </div>
              <div className="receipt-item">
                <span className="item-label">Lead Time</span>
                <span className="item-value">14-21 Business Days</span>
              </div>
            </div>

            <div className="receipt-divider" />
            
            <div className="receipt-status-panel">
              <div className="status-bullet" />
              <div className="status-details">
                <span className="status-heading">Atelier Status</span>
                <span className="status-desc">
                  {quoteRequested ? 'Quote Pending Approval' : 'Awaiting Details Submission'}
                </span>
              </div>
            </div>

            <div className="receipt-footer">
              <div className="receipt-seal">◈ SIGNATURE COMMISSION</div>
              <p className="receipt-note">Estimates are non-binding. Final confirmation provided by our Rajasthani atelier craftsman.</p>
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
  const [active, setActive] = useState(0);
  const testimonials = [
    { name: 'Priya Sharma', title: 'Interior Designer, Mumbai', text: 'The Calacatta marble vase I commissioned for my client\'s penthouse is now the centerpiece of the entire space. The craftsmanship is absolutely unparalleled — it stopped three international guests in their tracks.', stars: 5, img: '/images/founder.png' },
    { name: 'Arjun Mehta', title: 'CEO, Delhi', text: 'I gifted my wife the Carrara Signet Ring for our anniversary. She still gets asked about it everywhere she goes. Artistic Crafts has created something genuinely extraordinary — jewelry that tells a geological story.', stars: 5, img: '/images/founder.png' },
    { name: 'Sofia Laurent', title: 'Luxury Hotel Director, Goa', text: 'We ordered a custom marble sculpture for our hotel lobby. The attention to detail, the communication throughout the process, and the final result exceeded every expectation. Worth every rupee.', stars: 5, img: '/images/founder.png' },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__marble-accent" />
      <div className="container">
        <div className="section-header reveal">
          <div className="section-label">Client Stories</div>
          <h2 className="section-title">Voices of Discerning Taste</h2>
          <div className="gold-line center" />
        </div>
        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="testimonial-card__stars">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={16} fill="#C9A96E" stroke="none" />
                ))}
              </div>
              <div className="testimonial-card__quote">&ldquo;</div>
              <p className="testimonial-card__text">{t.text}</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__author-img">
                  <img src={t.img} alt={t.name} />
                </div>
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
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
        <FeaturedCollections />
        <BestSellers />
        <NewArrivals />
        <CraftsmanshipTimeline />
        <CustomDesignStudio />
        <InspirationGallery />
        <Testimonials />
        <InstagramGallery />

      </main>
      <Footer />
    </>
  );
}
