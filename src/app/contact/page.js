'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Phone, Mail } from 'lucide-react';
import '../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../page';

export default function ContactPage() {
  useScrollReveal();
  const title = "Contact Us";

  return (
    <>
      <Navbar />
      
      <main>
        {/* Luxury Hero specific to dynamic pages */}
        <header className="hero" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', background: '#faf9f8' }}>
          <div className="container hero__content reveal" style={{ marginTop: '120px', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
              <ChevronRight size={14} />
              <span>{title}</span>
            </div>
            <h1 className="hero__title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', color: '#1a1a1a' }}>
              Atelier Concierge
            </h1>
          </div>
        </header>

        <section style={{ padding: '80px 0', backgroundColor: '#fff' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'flex-start' }}>
            
            {/* Left Side: Contact Info */}
            <div className="reveal" style={{ position: 'sticky', top: '100px' }}>
              <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Get in Touch</h2>
              <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '40px', maxWidth: '400px' }}>
                Whether you're looking for a bespoke marble commission, interested in our slabs, or need help with a current order, our atelier concierge is here to assist.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <MapPin size={24} strokeWidth={1.5} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '4px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a' }}>The Showroom</h3>
                    <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                      Shop No.4, 6 Block<br />
                      A Central Area Extension<br />
                      Udaipur, Rajasthan (Code: 08)
                    </p>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '8px', margin: 0 }}>
                      <span style={{ color: 'var(--gold)', fontWeight: 500 }}>GSTIN:</span> 08CPEPJ3517C1Z9
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <Phone size={24} strokeWidth={1.5} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '4px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a' }}>Private Client</h3>
                    <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>Speak directly with a dedicated jewelry or slab consultant.</p>
                    <a href="tel:+919876543210" style={{ display: 'inline-block', marginTop: '8px', color: '#1a1a1a', textDecoration: 'none', fontWeight: '500' }}>+91 98765 43210</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <Mail size={24} strokeWidth={1.5} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '4px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a' }}>Digital Inquiries</h3>
                    <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>For press, collaborations, and general customer service.</p>
                    <a href="mailto:atelier@artisticcrafts.com" style={{ display: 'inline-block', marginTop: '8px', color: '#1a1a1a', textDecoration: 'none', fontWeight: '500' }}>atelier@artisticcrafts.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="reveal" style={{ transitionDelay: '0.2s', background: '#faf9f8', padding: '40px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', fontWeight: '400', color: '#1a1a1a' }}>Send an Inquiry</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>First Name</label>
                    <input type="text" placeholder="Jane" style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>Last Name</label>
                    <input type="text" placeholder="Doe" style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>Email Address</label>
                  <input type="email" placeholder="jane@example.com" style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>Area of Interest</label>
                  <select style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit', color: '#1a1a1a', appearance: 'none', cursor: 'pointer' }}>
                    <option>Stone Jewelry</option>
                    <option>Marble Decor</option>
                    <option>Cristallo Quartzite Slabs</option>
                    <option>Custom Commission</option>
                    <option>Press / Collaboration</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>Message</label>
                  <textarea rows="5" placeholder="How can we help you?" style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                </div>
                
                <button type="button" className="btn-primary" style={{ padding: '20px', fontSize: '1rem', marginTop: '8px', width: '100%', borderRadius: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Submit Inquiry</button>
              </form>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
