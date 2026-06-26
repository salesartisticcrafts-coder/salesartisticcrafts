'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Phone, Mail } from 'lucide-react';
import '../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../page';

// Custom social icons as inline SVGs matching home page
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

export default function ContactPage() {
  useScrollReveal();
  const title = "Contact Us";
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', interest: 'Stone Jewelry', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.email) {
      setSubmitted(true);
    }
  };

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
                Whether you&apos;re looking for a bespoke marble commission, interested in our slabs, or need help with a current order, our atelier concierge is here to assist.
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
                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                      {[
                        { Icon: Instagram, href: '#' },
                        { Icon: Facebook, href: '#' },
                        { Icon: Twitter, href: '#' },
                        { Icon: Phone, href: 'https://wa.me/' }
                      ].map(({ Icon, href }, i) => (
                        <a 
                          key={i} 
                          href={href} 
                          style={{
                            width: '36px',
                            height: '36px',
                            border: '1px solid rgba(201, 169, 110, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1a1a1a',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--gold)';
                            e.currentTarget.style.color = 'var(--gold)';
                            e.currentTarget.style.background = 'rgba(201, 169, 110, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.3)';
                            e.currentTarget.style.color = '#1a1a1a';
                            e.currentTarget.style.background = 'transparent';
                          }}
                          aria-label="Social Link"
                        >
                          <Icon size={16} />
                        </a>
                      ))}
                    </div>
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
            <div className="reveal" style={{ transitionDelay: '0.2s', background: '#faf9f8', padding: '40px', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201, 169, 110, 0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '1px solid var(--gold)' }}>◈</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '450', color: '#1a1a1a', margin: 0, fontFamily: 'var(--font-serif)' }}>Inquiry Submitted</h3>
                  <p style={{ color: '#666', lineHeight: 1.6, margin: 0, fontSize: '0.95rem', maxWidth: '320px' }}>
                    Thank you for contacting the Artistic Crafts Atelier. A dedicated concierge consultant will review your request and contact you within 24 hours.
                  </p>
                  <button onClick={() => { setSubmitted(false); setFormData({ firstName: '', lastName: '', email: '', interest: 'Stone Jewelry', message: '' }); }} style={{ background: 'none', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '12px 28px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s ease', marginTop: '10px' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: '400', color: '#1a1a1a', margin: 0, fontFamily: 'var(--font-serif)' }}>Send an Inquiry</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>First Name</label>
                      <input type="text" required placeholder="Jane" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>Last Name</label>
                      <input type="text" placeholder="Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>Email Address</label>
                    <input type="email" required placeholder="jane@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>Area of Interest</label>
                    <select value={formData.interest} onChange={e => setFormData({...formData, interest: e.target.value})} style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit', color: '#1a1a1a', appearance: 'none', cursor: 'pointer' }}>
                      <option>Stone Jewelry</option>
                      <option>Marble Decor</option>
                      <option>Cristallo Quartzite Slabs</option>
                      <option>Custom Commission</option>
                      <option>Press / Collaboration</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>Message</label>
                    <textarea rows="5" placeholder="How can we help you?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ padding: '16px', border: '1px solid #eae5df', background: '#fff', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                  </div>
                  
                  <button type="submit" className="btn-primary" style={{ padding: '20px', fontSize: '1rem', marginTop: '8px', width: '100%', borderRadius: 0, textTransform: 'uppercase', letterSpacing: '0.1em', justifyContent: 'center' }}>Submit Inquiry</button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
