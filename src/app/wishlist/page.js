'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import '../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../page';

export default function WishlistPage() {
  useScrollReveal();

  const [wishlist, setWishlist] = useState([]);

  // All catalog products across the site with consistent IDs
  const allCatalogProducts = [
    { id: 1, name: 'Pink Crystal Beaded Bracelet', price: 14500, img: 'https://i.pinimg.com/736x/c6/b9/9e/c6b99ef41938e6186d097d554b44c921.jpg', tag: 'Best Seller', material: 'Pink Crystal' },
    { id: 2, name: 'Black & White Marble Bracelet', price: 12800, img: 'https://i.pinimg.com/736x/af/08/54/af08547deca93880bc23eb302ef60527.jpg', tag: 'New', material: 'Marble' },
    { id: 3, name: 'Boho Marble Stone Bracelet', price: 13200, img: 'https://i.pinimg.com/736x/87/4d/7c/874d7ca0a362d0ddc5246f32ab4bd28d.jpg', tag: 'Trending', material: 'Stone' },
    { id: 4, name: 'Rose Quartz Connemara Bracelet', price: 11500, img: 'https://i.pinimg.com/736x/b3/c8/34/b3c83472c84405efdd073a7a1b000fee.jpg', tag: 'Classic', material: 'Rose Quartz' },
    { id: 5, name: 'Gray & Tan Watercolor Bracelet', price: 15400, img: 'https://i.pinimg.com/736x/50/52/02/5052028ef58a458f0a312ed6a3c4381c.jpg', tag: 'Staff Pick', material: 'Watercolor Stone' },
    { id: 6, name: 'Rainbow Marble Bracelet', price: 16800, img: 'https://i.pinimg.com/736x/b5/42/89/b54289333d78d91ef9e1a32d264ad1e6.jpg', tag: 'Exclusive', material: 'Rainbow Marble' },
    { id: 7, name: 'Hand-crafted Coasters Set', price: 8500, img: 'https://i.pinimg.com/736x/7b/26/39/7b263947af5bd40437e1d77abf879878.jpg', tag: 'Best Seller', material: 'White Onyx Stone' },
    { id: 8, name: 'Cristallo Pink Quartzite Slab', price: 145000, img: 'https://i.pinimg.com/736x/92/a7/c5/92a7c5e96bc731477d866887ddab0efe.jpg', tag: 'Exclusive', material: 'Pink Quartzite' }
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

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(w => w !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  // Filter out the liked products based on ID array
  const likedProducts = allCatalogProducts.filter(product => wishlist.includes(product.id));

  return (
    <>
      <Navbar />
      
      <main style={{ backgroundColor: '#fff', paddingTop: '80px' }}>
        <div className="container" style={{ padding: '60px 0 100px' }}>
          
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#1a1a1a' }}>My Wishlist</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a', fontWeight: '400', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
            My Wishlist
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '700px', lineHeight: '1.6', marginBottom: '48px' }}>
            Your curated collection of rare natural stone statement jewelry and high-end atelier home decor objects.
          </p>

          {likedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }} className="reveal">
              <h2 style={{ fontSize: '1.8rem', color: '#666', fontWeight: '300', marginBottom: '24px' }}>Your wishlist is empty</h2>
              <p style={{ color: '#888', marginBottom: '32px' }}>Browse our signature collections and tap the heart icon to save items here.</p>
              <Link href="/collections/stone-jewelry" className="btn-primary">
                <span>Shop Collections</span> <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }} className="reveal">
              {likedProducts.map((product) => {
                const productSlug = product.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                return (
                  <div key={product.id} className="product-card" style={{ margin: 0 }}>
                    <div className="product-card__img-wrap" style={{ aspectRatio: '4/5', background: '#faf9f8' }}>
                      {product.tag && <span className="product-card__tag" style={{ zIndex: 2 }}>{product.tag}</span>}
                      <Link href={`/shop/${productSlug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img src={product.img} alt={product.name} className="product-card__img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Link>
                      <div className="product-card__actions">
                        <button 
                          className="product-card__wish active" 
                          onClick={() => removeFromWishlist(product.id)}
                          aria-label="Remove from wishlist"
                        >
                          <Heart size={16} fill="#C9A96E" />
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
                    <div style={{ padding: '20px 0' }}>
                      <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{product.material}</div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '400', margin: '0 0 8px', color: '#1a1a1a' }}>
                        <Link href={`/shop/${productSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {product.name}
                        </Link>
                      </h3>
                      <div style={{ fontSize: '0.95rem', color: '#666' }}>₹{product.price.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
