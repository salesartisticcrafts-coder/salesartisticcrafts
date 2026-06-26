'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import '../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../page';

export default function AboutPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      
      <main style={{ backgroundColor: '#fff' }}>
        
        {/* Minimal Hero */}
        <header style={{ paddingTop: '180px', paddingBottom: '60px', textAlign: 'center', backgroundColor: '#faf9f8' }}>
          <div className="container reveal">
            <h1 className="hero__title" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', marginBottom: '24px', color: '#1a1a1a', fontWeight: '400', letterSpacing: '0.02em' }}>
              The House of Artistic Crafts
            </h1>
            <p style={{ fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', color: '#555', lineHeight: '1.8', letterSpacing: '0.02em' }}>
              For over three generations, our atelier has been sourcing the world's rarest natural stone, sculpting it into timeless masterpieces that blend heritage with avant-garde design.
            </p>
          </div>
        </header>



        {/* Section 1: Image Left, Content Right */}
        <section style={{ paddingBottom: '120px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'center' }}>
              
              <div className="reveal" style={{ position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1606722590583-6951b5ea92a3?q=80&w=1000&auto=format&fit=crop" 
                  alt="Raw Stone" 
                  style={{ width: '100%', height: '650px', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#faf9f8', padding: '20px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
                  01. The Source
                </div>
              </div>

              <div className="reveal" style={{ transitionDelay: '0.2s' }}>
                <div className="section-line" style={{ marginBottom: '32px' }}></div>
                <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '24px' }}>The Art of Selection</h2>
                <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '24px', fontSize: '1.05rem' }}>
                  Our journey begins deep within the earth. From the pristine white quarries of Carrara, Italy, to the rich, dramatic landscapes of Rajasthan, India, we personally select only the top 1% of semi-precious marble, agate, and quartzite blocks.
                </p>
                <p style={{ color: '#666', lineHeight: 1.8, fontSize: '1.05rem' }}>
                  Every vein, every flaw, and every color variation tells a story of millions of years of geological pressure. We believe that true luxury cannot be mass-produced; it must be unearthed, studied, and carefully revealed.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Dark Philosophy Banner */}
        <section className="reveal" style={{ backgroundColor: '#0a0a0a', padding: '120px 0', color: '#fff', textAlign: 'center', margin: '0 40px 120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="gold-glow-orb" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.3 }}></div>
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '300', fontStyle: 'italic', marginBottom: '32px', color: 'var(--gold)' }}>
              "Perfection is not created, it is uncovered."
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              The Artistic Crafts Philosophy
            </p>
          </div>
        </section>

        {/* Section 2: Content Left, Image Right */}
        <section style={{ paddingBottom: '120px' }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '80px', alignItems: 'center', flexDirection: 'row-reverse' }}>
              
              <div className="reveal" style={{ flex: '1 1 400px', position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1598587635398-0c3eb1a60cc6?q=80&w=1000&auto=format&fit=crop" 
                  alt="Craftsmanship" 
                  style={{ width: '100%', height: '650px', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: '#faf9f8', padding: '20px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
                  02. The Craft
                </div>
              </div>

              <div className="reveal" style={{ flex: '1 1 400px', transitionDelay: '0.2s' }}>
                <div className="section-line" style={{ marginBottom: '32px' }}></div>
                <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '24px' }}>Mastery in Every Detail</h2>
                <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '24px', fontSize: '1.05rem' }}>
                  At our central Atelier in Udaipur, Rajasthan, master sculptors use techniques passed down through generations alongside cutting-edge precision waterjet technology. This harmony of heritage and modern innovation allows us to create both monumental slabs and intricate wearable jewelry with zero compromise.
                </p>
                <p style={{ color: '#666', lineHeight: 1.8, fontSize: '1.05rem' }}>
                  A commitment to sustainability drives our operations. We utilize a closed-loop water system and transform our precious offcuts into beautiful terrazzo objects, ensuring zero waste in our pursuit of perfection.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
