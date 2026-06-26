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

  const defaultProducts = [
    { id: 1, name: `${title} Signature Piece`, price: '₹18,500', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop', material: 'Carrara Marble', tag: 'Best Seller', rating: 5 },
    { id: 2, name: `${title} Classic Design`, price: '₹12,800', img: 'https://images.unsplash.com/photo-1573408301145-b98c4af05b8b?q=80&w=800&auto=format&fit=crop', material: 'Onyx Stone', tag: 'New', rating: 5 },
    { id: 3, name: `${title} Modern Edition`, price: '₹24,000', img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop', material: 'Black Marble', tag: '', rating: 4 },
    { id: 4, name: `${title} Essential`, price: '₹9,500', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop', material: 'White Quartz', tag: '', rating: 5 },
    { id: 5, name: `${title} Luxe Item`, price: '₹29,000', img: 'https://images.unsplash.com/photo-1573408301145-b98c4af05b8b?q=80&w=800&auto=format&fit=crop', material: 'Green Agate', tag: 'Exclusive', rating: 5 },
    { id: 6, name: `${title} Artisan Core`, price: '₹16,400', img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop', material: 'Carrara Marble', tag: '', rating: 5 },
    { id: 7, name: `${title} Limited Set`, price: '₹34,500', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop', material: 'Nero Marquina', tag: 'Limited', rating: 5 },
    { id: 8, name: `${title} Bespoke Core`, price: '₹21,800', img: 'https://images.unsplash.com/photo-1573408301145-b98c4af05b8b?q=80&w=800&auto=format&fit=crop', material: 'Onyx Stone', tag: '', rating: 5 },
  ];

  const jewelryProducts = [
    { id: 1, name: 'Pink Crystal Beaded Bracelet', material: 'Pink Crystal', price: '₹14,500', img: 'https://i.pinimg.com/736x/c6/b9/9e/c6b99ef41938e6186d097d554b44c921.jpg', tag: 'Best Seller', rating: 5 },
    { id: 2, name: 'Black & White Marble Bracelet', material: 'Marble', price: '₹12,800', img: 'https://i.pinimg.com/736x/af/08/54/af08547deca93880bc23eb302ef60527.jpg', tag: 'New', rating: 5 },
    { id: 3, name: 'Boho Marble Stone Bracelet', material: 'Stone', price: '₹13,200', img: 'https://i.pinimg.com/736x/87/4d/7c/874d7ca0a362d0ddc5246f32ab4bd28d.jpg', tag: 'Trending', rating: 4 },
    { id: 4, name: 'Rose Quartz Connemara Bracelet', material: 'Rose Quartz', price: '₹11,500', img: 'https://i.pinimg.com/736x/b3/c8/34/b3c83472c84405efdd073a7a1b000fee.jpg', tag: 'Classic', rating: 5 },
    { id: 5, name: 'Gray & Tan Watercolor Bracelet', material: 'Watercolor Stone', price: '₹15,400', img: 'https://i.pinimg.com/736x/50/52/02/5052028ef58a458f0a312ed6a3c4381c.jpg', tag: 'Staff Pick', rating: 5 },
    { id: 6, name: 'Rainbow Marble Bracelet', material: 'Rainbow Marble', price: '₹16,800', img: 'https://i.pinimg.com/736x/b5/42/89/b54289333d78d91ef9e1a32d264ad1e6.jpg', tag: 'Exclusive', rating: 5 }
  ];

  const decorProducts = [
    { id: 1, name: 'Hand-crafted White Coasters Set', material: 'White Onyx Stone', price: '₹8,500', img: 'https://i.pinimg.com/736x/7b/26/39/7b263947af5bd40437e1d77abf879878.jpg', tag: 'Best Seller', rating: 5 },
    { id: 2, name: 'Resin Coaster Set White & Gold', material: 'Agate Epoxy Resin', price: '₹12,400', img: 'https://i.pinimg.com/736x/0a/31/b0/0a31b0ce9c2fadd9b9e044540c593801.jpg', tag: 'New', rating: 5 },
    { id: 3, name: 'Beige Marble Style Coasters', material: 'Beige Ceramic Marble', price: '₹6,000', img: 'https://i.pinimg.com/736x/eb/15/b0/eb15b0872accf63e598cae0af89b71e6.jpg', tag: '', rating: 4 },
    { id: 4, name: 'DIY Green and Gold Coasters', material: 'Green Epoxy Resin Art', price: '₹9,200', img: 'https://i.pinimg.com/736x/51/0c/a5/510ca5da102bcc3d7aa8bf40809d13f7.jpg', tag: '', rating: 5 },
    { id: 5, name: 'Terrazzo Ceramic Holder Set', material: 'Ceramic & Terrazzo', price: '₹6,800', img: 'https://i.pinimg.com/736x/3f/84/02/3f84023138a190c8b5e06d8cfc4444f8.jpg', tag: 'Trending', rating: 5 },
    { id: 6, name: 'Concrete Resin Art Dish', material: 'Jesmonite & Concrete', price: '₹11,000', img: 'https://i.pinimg.com/736x/ec/04/84/ec04843094fd1fc9821d5092d4c0402b.jpg', tag: '', rating: 5 },
    { id: 7, name: 'Callum Marble Coaster Base', material: 'White Polished Marble', price: '₹7,500', img: 'https://i.pinimg.com/736x/81/c3/aa/81c3aab7a341c91123e9001e7ec79a7a.jpg', tag: 'Classic', rating: 5 },
    { id: 8, name: 'Ceramic Drink Coasters w/ Holder', material: 'Red Marble Ceramic', price: '₹5,500', img: 'https://i.pinimg.com/736x/9d/7e/7c/9d7e7c4b012667ee4908bf615dff69d4.jpg', tag: 'Exclusive', rating: 5 },
    { id: 9, name: 'Marble Vases', material: 'Solid Carrara Marble', price: '₹14,000', img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800', tag: 'New', rating: 5 },
    { id: 10, name: 'Marble Candle Holders', material: 'Green Onyx', price: '₹6,500', img: 'https://images.unsplash.com/photo-1534098687799-73e4b7520eec?q=80&w=800', tag: '', rating: 4 },
    { id: 11, name: 'Marble Table Tops', material: 'Calacatta Gold', price: '₹45,000', img: 'https://images.unsplash.com/photo-1558000143-a602167d4fdf?q=80&w=800', tag: 'Bespoke', rating: 5 },
    { id: 12, name: 'Marble Coffee Tables', material: 'Nero Marquina', price: '₹65,000', img: 'https://images.unsplash.com/photo-1594904578869-c011783103c7?q=80&w=800', tag: 'Premium', rating: 5 },
    { id: 13, name: 'Marble Side Tables', material: 'White Quartzite', price: '₹32,000', img: 'https://images.unsplash.com/photo-1601666878345-021c32759e68?q=80&w=800', tag: '', rating: 4 },
    { id: 14, name: 'Marble Clocks', material: 'Agate Stone', price: '₹11,500', img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=800', tag: '', rating: 5 },
    { id: 15, name: 'Marble Wall Panels', material: 'Grey Marble', price: '₹55,000', img: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=800', tag: 'Trending', rating: 5 },
    { id: 16, name: 'Marble Wall Art', material: 'Mixed Stone Mosaic', price: '₹28,000', img: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=800', tag: 'Exclusive', rating: 5 },
    { id: 17, name: 'Marble Name Plates', material: 'Black Granite & Brass', price: '₹9,800', img: 'https://images.unsplash.com/photo-1588691523429-373b5df58c67?q=80&w=800', tag: 'Custom', rating: 5 },
    { id: 18, name: 'Marble Temple (Mandir)', material: 'Makarana White Marble', price: '₹1,25,000', img: 'https://images.unsplash.com/photo-1565507563507-686bdbaeb8ee?q=80&w=800', tag: 'Masterpiece', rating: 5 },
    { id: 19, name: 'Marble Statues & Sculptures', material: 'Hand-carved Sandstone', price: '₹85,000', img: 'https://images.unsplash.com/photo-1549488344-c715975d691c?q=80&w=800', tag: 'Artisan', rating: 5 },
    { id: 20, name: 'Marble Fountains', material: 'Textured Grey Stone', price: '₹95,000', img: 'https://images.unsplash.com/photo-1582201943021-e8e5b614afdb?q=80&w=800', tag: 'Outdoor', rating: 4 },
    { id: 21, name: 'Marble Planters', material: 'White Onyx', price: '₹15,000', img: 'https://images.unsplash.com/photo-1596547609652-9fc5b8cb4282?q=80&w=800', tag: '', rating: 5 },
    { id: 22, name: 'Marble Bowls', material: 'Rose Quartz', price: '₹7,500', img: 'https://images.unsplash.com/photo-1556611382-b7e1939dd118?q=80&w=800', tag: '', rating: 5 },
    { id: 23, name: 'Marble Trays', material: 'Carrara & Brass', price: '₹12,000', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800', tag: 'Best Seller', rating: 5 },
    { id: 24, name: 'Marble Coasters', material: 'Mixed Agate Slices', price: '₹4,500', img: 'https://images.unsplash.com/photo-1573408301145-b98c4af05b8b?q=80&w=800', tag: '', rating: 4 },
    { id: 25, name: 'Marble Tissue Holders', material: 'Black Marquina', price: '₹8,200', img: 'https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?q=80&w=800', tag: '', rating: 5 },
    { id: 26, name: 'Marble Pen Stands', material: 'Green Onyx', price: '₹5,800', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800', tag: 'Office', rating: 5 },
    { id: 27, name: 'Marble Photo Frames', material: 'White Quartz', price: '₹6,400', img: 'https://images.unsplash.com/photo-1583095368305-64f5ebf2f81a?q=80&w=800', tag: 'Gift', rating: 5 },
    { id: 28, name: 'Marble Lamps & Lamp Bases', material: 'Alabaster Stone', price: '₹22,000', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800', tag: 'Premium', rating: 5 },
  ];

  const cristalloProducts = [
    { id: 1, name: 'Crystallo Lumix Extra', material: 'Honed Quartzite Slab', price: '₹1,20,000', img: 'https://i.pinimg.com/736x/ae/c0/98/aec09828ee3fb855d8f33b93edf24ff9.jpg', tag: 'Best Seller', rating: 5 },
    { id: 2, name: 'Cristallo Pink Quartzite', material: 'Polished Luxury Stone', price: '₹1,45,000', img: 'https://i.pinimg.com/736x/92/a7/c5/92a7c5e96bc731477d866887ddab0efe.jpg', tag: 'Exclusive', rating: 5 },
    { id: 3, name: 'Cristallo Raw Slab', material: 'Light Marbled Quartzite', price: '₹1,15,000', img: 'https://i.pinimg.com/736x/d9/6d/ff/d96dffb96118285fab7f3e9fa4bef486.jpg', tag: '', rating: 4 },
    { id: 4, name: 'Cristallo Double Island Slab', material: 'White & Gold Quartzite', price: '₹1,80,000', img: 'https://i.pinimg.com/736x/84/cc/fc/84ccfc58b1adbe671b35ed791c431bfc.jpg', tag: 'Premium', rating: 5 },
    { id: 5, name: 'Cristallo 3CM White Slab', material: 'Patagonia White Quartzite', price: '₹1,35,000', img: 'https://i.pinimg.com/736x/25/3f/6f/253f6f13f7d9551cd05b85eb394f5e79.jpg', tag: 'Trending', rating: 5 },
    { id: 6, name: 'Cristallo Countertop Slab', material: 'Crystal Quartzite', price: '₹1,55,000', img: 'https://i.pinimg.com/736x/36/0b/ce/360bce0db562af6acad905d46c3c3c9b.jpg', tag: '', rating: 5 },
    { id: 7, name: 'Cristallo Rose Soft Touch', material: 'Rose Quartz Granite Slab', price: '₹1,65,000', img: 'https://i.pinimg.com/736x/6b/50/ca/6b50cae255f42bdd1cc4ec34038d8594.jpg', tag: 'New', rating: 5 },
  ];

  let products = defaultProducts;
  if (slug === 'marble-jewelry' || slug === 'stone-jewelry') products = jewelryProducts;
  else if (slug === 'marble-decor') products = decorProducts;
  else if (slug === 'cristallo-quartzite-slabs') products = cristalloProducts;

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
                {products.map((product, i) => {
                  const productSlug = product.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                  return (
                    <div key={product.id} className="product-card reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s`, margin: 0 }}>
                      <div className="product-card__image-wrap" style={{ aspectRatio: '4/5', background: '#faf9f8' }}>
                        {product.tag && <span className="product-card__tag" style={{ zIndex: 2 }}>{product.tag}</span>}
                        <Link href={`/shop/${productSlug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                          <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Link>
                        <div className="product-card__actions">
                          <button className="btn-icon" onClick={() => alert(`${product.name} has been added to your wishlist.`)}>♥</button>
                        </div>
                      </div>
                      <div style={{ padding: '20px 0' }}>
                        <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{product.material}</div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '400', margin: '0 0 8px', color: '#1a1a1a' }}>
                          <Link href={`/shop/${productSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {product.name}
                          </Link>
                        </h3>
                        <div style={{ fontSize: '0.95rem', color: '#666' }}>{product.price}</div>
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
