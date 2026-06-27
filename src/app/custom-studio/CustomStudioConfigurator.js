'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Upload, Sparkles, Check, CheckCircle2, MessageCircle } from 'lucide-react';

export default function CustomStudioConfigurator() {
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

  const steps = ['Upload Reference', 'Choose Marble', 'Add Engraving', 'Confirm Details'];
  
  const marbles = [
    { name: 'Carrara White', origin: 'Italy', price: 'Standard', desc: 'Classic pure white with charcoal feathering.' },
    { name: 'Nero Marquina', origin: 'Spain', price: 'Premium', desc: 'Deep obsidian black with bright white lightning veins.' },
    { name: 'Calacatta Gold', origin: 'Italy', price: 'Exclusive', desc: 'Luxe warm gold and bronze veins on a creamy backdrop.' },
    { name: 'Turkish Onyx', origin: 'Turkey', price: 'Exclusive', desc: 'Translucent amber with concentric crystal rings.' },
    { name: 'Breccia Viola', origin: 'Italy', price: 'Premium', desc: 'Dramatic purple-wine brecciated patterns.' },
    { name: 'Verde Alpi', origin: 'Greece', price: 'Standard', desc: 'Rich jade and forest green with emerald structures.' }
  ];
  
  const fonts = ['Serif', 'Script', 'Modern', 'Classic'];

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadName(e.target.files[0].name);
    }
  };

  return (
    <section className="custom-studio" id="custom" style={{ padding: '60px 0', background: 'var(--black-deep)' }}>
      <div className="gold-glow-orb" style={{ top: '45%', left: '40%' }} />
      <div className="container">
        
        <div className="section-header reveal" style={{ opacity: 1, transform: 'none', marginBottom: '50px' }}>
          <div className="section-label">Bespoke Configurator</div>
          <h2 className="section-title">Design A One-of-a-Kind Piece</h2>
          <div className="gold-line center" />
          <p className="section-desc">
            Collaborate with our master artisans in our Rajasthan workshop. Let us sculpt your dreams from the world's most exclusive stones.
          </p>
        </div>

        <div className="custom-studio__configurator-grid reveal" style={{ opacity: 1, transform: 'none' }}>
          
          {/* Left: Interactive Configurator Panel */}
          <div className="configurator-panel">
            
            {/* Step Navigation Bar */}
            <div className="configurator-steps-nav">
              {steps.map((s, i) => (
                <button 
                  key={s} 
                  className={`configurator-step-btn ${activeStep === i ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}
                  onClick={() => setActiveStep(i)}
                  type="button"
                >
                  <span className="step-num">
                    {i < activeStep ? <Check size={14} strokeWidth={3} /> : `0${i + 1}`}
                  </span>
                  <span className="step-label">{s}</span>
                </button>
              ))}
            </div>

            {/* Slide Content Box */}
            <div className="configurator-content-box" style={{ minHeight: '320px' }}>
              
              {activeStep === 0 && (
                <div className="config-slide">
                  <h3 className="config-slide-title">Upload Design Reference</h3>
                  <p className="config-slide-desc">
                    Upload a rough sketch, photo, or moodboard of the jewelry, vanity, or decor piece you want.
                  </p>
                  
                  <label className="config-upload-area" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <input type="file" accept="image/*" className="hidden-input" onChange={handleFileUpload} style={{ display: 'none' }} />
                    <div className="upload-icon" style={{ fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '12px' }}>
                      <Upload size={32} />
                    </div>
                    <span className="upload-text" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--cream)' }}>
                      {uploadName ? `Selected: ${uploadName}` : 'Click to Upload Document'}
                    </span>
                    <span className="upload-sub" style={{ fontSize: '0.8rem', color: 'var(--warm-grey)', marginTop: '6px' }}>
                      Supports JPG, PNG, PDF up to 10MB
                    </span>
                  </label>
                </div>
              )}

              {activeStep === 1 && (
                <div className="config-slide">
                  <h3 className="config-slide-title">Select Rare Stone Variety</h3>
                  <p className="config-slide-desc">
                    Choose the specific geological block from our quarries. Each slab carries millions of years of earth history.
                  </p>
                  
                  <div className="marble-selector-grid">
                    {marbles.map(m => (
                      <button 
                        key={m.name} 
                        type="button"
                        className={`marble-option-card ${selectedMarble === m.name ? 'active' : ''}`}
                        onClick={() => setSelectedMarble(m.name)}
                        style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                      >
                        <div className="marble-option-info">
                          <span className="marble-name" style={{ fontWeight: '500', color: selectedMarble === m.name ? 'var(--gold)' : 'var(--cream)' }}>{m.name}</span>
                          <span className="marble-origin" style={{ fontSize: '0.75rem', color: 'var(--warm-grey)' }}>Origin: {m.origin}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--warm-grey)', margin: '6px 0 0 0', lineHeight: '1.3' }}>{m.desc}</p>
                        <span className="marble-tier" style={{ alignSelf: 'flex-end', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold)' }}>
                          {m.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="config-slide">
                  <h3 className="config-slide-title">Inscribe Personal Engraving</h3>
                  <p className="config-slide-desc">
                    Personalize your heirloom with custom initials, a family crest date, or coordinates carved directly.
                  </p>
                  
                  <input 
                    type="text" 
                    placeholder="Enter engraving text (e.g. 'ETERNITY')" 
                    className="config-text-input"
                    maxLength={40}
                    value={engraving}
                    onChange={e => setEngraving(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(28, 25, 23, 0.05)',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '4px',
                      color: 'var(--cream)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1rem',
                      marginBottom: '24px',
                      outline: 'none'
                    }}
                  />

                  <div className="font-selector-wrap">
                    <span className="selector-label-text" style={{ fontSize: '0.85rem', color: 'var(--warm-grey)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select Typography Style:</span>
                    <div className="font-chips" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      {fonts.map(f => (
                        <button 
                          key={f} 
                          type="button"
                          className={`font-chip ${fontStyle === f ? 'active' : ''}`}
                          onClick={() => setFontStyle(f)}
                          style={{
                            padding: '8px 16px',
                            border: '1px solid',
                            borderColor: fontStyle === f ? 'var(--gold)' : 'rgba(201, 169, 110, 0.2)',
                            background: fontStyle === f ? 'rgba(201, 169, 110, 0.1)' : 'transparent',
                            color: fontStyle === f ? 'var(--gold)' : 'var(--warm-grey)',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '0.85rem',
                            fontFamily: getFontFamily(f)
                          }}
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
                  <h3 className="config-slide-title">Atelier Commission Details</h3>
                  {quoteRequested ? (
                    <div className="quote-success-panel" style={{ textAlign: 'center', padding: '30px 10px' }}>
                      <div className="success-icon" style={{ display: 'inline-flex', background: 'rgba(201, 169, 110, 0.1)', color: 'var(--gold)', borderRadius: '50%', padding: '16px', marginBottom: '16px' }}>
                        <CheckCircle2 size={40} />
                      </div>
                      <h4 className="success-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--cream)', marginBottom: '8px' }}>
                        Commission Request Submitted
                      </h4>
                      <p className="success-desc" style={{ color: 'var(--warm-grey)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Our Rajasthan-based design consultant will connect with you on WhatsApp within 3 hours. We will share a complimentary custom sketch and stone options.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="config-slide-desc">
                        Provide your details to submit this configuration directly to our workshop manager.
                      </p>
                      
                      <div className="contact-form-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input 
                          type="text" 
                          placeholder="Your Full Name" 
                          className="config-text-input" 
                          value={userName} 
                          onChange={e => setUserName(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '14px',
                            background: 'rgba(28, 25, 23, 0.05)',
                            border: '1px solid rgba(201, 169, 110, 0.3)',
                            borderRadius: '4px',
                            color: 'var(--cream)',
                            outline: 'none'
                          }}
                        />
                        <input 
                          type="tel" 
                          placeholder="WhatsApp Number (for drawings preview)" 
                          className="config-text-input" 
                          value={whatsapp} 
                          onChange={e => setWhatsapp(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '14px',
                            background: 'rgba(28, 25, 23, 0.05)',
                            border: '1px solid rgba(201, 169, 110, 0.3)',
                            borderRadius: '4px',
                            color: 'var(--cream)',
                            outline: 'none'
                          }}
                        />
                        <button 
                          className="btn-primary" 
                          type="button"
                          style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '16px' }}
                          onClick={() => {
                            if (userName && whatsapp) setQuoteRequested(true);
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <MessageCircle size={16} /> Submit Commission to Rajasthan Atelier
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="configurator-footer-nav" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(201,169,110,0.15)', paddingTop: '20px' }}>
              <button 
                type="button"
                className="btn-ghost" 
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                style={{ opacity: activeStep === 0 ? 0.3 : 1 }}
              >
                ← Back
              </button>
              {activeStep < 3 && (
                <button 
                  type="button"
                  className="btn-primary" 
                  onClick={() => setActiveStep(prev => Math.min(3, prev + 1))}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Continue <ChevronRight size={16} />
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Floating Quote Preview Receipt (Live Atelier Invoice Card) */}
          <div className="quote-preview-receipt" style={{ background: '#fff', border: '1px solid rgba(201, 169, 110, 0.2)', padding: '24px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div className="receipt-border-decor" style={{ height: '3px', background: 'var(--gold)', marginBottom: '16px' }} />
            <div className="receipt-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--warm-grey)', marginBottom: '20px' }}>
              <span className="receipt-brand" style={{ fontWeight: '600' }}>ARTISTIC CRAFTS ATELIER</span>
              <span className="receipt-serial">INV-{new Date().getFullYear()}-BESPOKE</span>
            </div>
            
            {/* Live Configurator Texture Preview Box */}
            <div style={{ 
              width: '100%', 
              height: '180px', 
              borderRadius: '6px', 
              position: 'relative', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              backgroundImage: `url(${getMarbleTexture(selectedMarble)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4)',
              transition: 'background-image 0.5s ease'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.25) 100%)',
                pointerEvents: 'none'
              }} />
              
              {engraving ? (
                <div style={{
                  color: '#C9A96E',
                  fontSize: '1.25rem',
                  letterSpacing: '0.2em',
                  fontWeight: '600',
                  textShadow: '1px 1px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 2px 2px 8px rgba(0,0,0,0.6)',
                  fontFamily: getFontFamily(fontStyle),
                  padding: '8px 16px',
                  border: '1px solid rgba(201,169,110,0.5)',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(2px)',
                  textTransform: 'uppercase',
                  maxWidth: '90%',
                  textAlign: 'center',
                  wordBreak: 'break-all'
                }}>
                  {engraving}
                </div>
              ) : (
                <span style={{ 
                  color: '#fff', 
                  fontSize: '0.85rem', 
                  letterSpacing: '0.08em', 
                  backgroundColor: 'rgba(0,0,0,0.5)', 
                  padding: '6px 14px', 
                  borderRadius: '2px',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles size={12} className="gold-text" /> Awaiting Custom Inscription
                </span>
              )}
              
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '0.6rem',
                color: '#fff',
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: '3px 8px',
                borderRadius: '3px',
                letterSpacing: '0.08em',
                fontWeight: '600'
              }}>
                ATELIER SIMULATOR
              </div>
            </div>

            <div className="receipt-divider" style={{ borderBottom: '1px dashed rgba(201, 169, 110, 0.3)', margin: '20px 0' }} />
            
            <h4 className="receipt-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--cream)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Commission Specifications
            </h4>
            
            <div className="receipt-items" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="receipt-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="item-label" style={{ color: 'var(--warm-grey)' }}>Design Concept</span>
                <span className="item-value" style={{ fontWeight: '500', color: 'var(--cream)' }}>{uploadName ? uploadName : 'No file uploaded'}</span>
              </div>
              <div className="receipt-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="item-label" style={{ color: 'var(--warm-grey)' }}>Geological Block</span>
                <span className="item-value" style={{ fontWeight: '500', color: 'var(--cream)' }}>{selectedMarble}</span>
              </div>
              <div className="receipt-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="item-label" style={{ color: 'var(--warm-grey)' }}>Carved Inscription</span>
                <span className="item-value" style={{ fontWeight: '500', color: 'var(--cream)' }}>{engraving ? `"${engraving}"` : 'None'}</span>
              </div>
              <div className="receipt-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="item-label" style={{ color: 'var(--warm-grey)' }}>Inlay Font Face</span>
                <span className="item-value" style={{ fontWeight: '500', color: 'var(--cream)' }}>{fontStyle}</span>
              </div>
              <div className="receipt-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="item-label" style={{ color: 'var(--warm-grey)' }}>Artisan Lead Time</span>
                <span className="item-value" style={{ fontWeight: '500', color: 'var(--gold-dark)' }}>14-21 Business Days</span>
              </div>
            </div>

            <div className="receipt-divider" style={{ borderBottom: '1px dashed rgba(201, 169, 110, 0.3)', margin: '20px 0' }} />
            
            <div className="receipt-status-panel" style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(201,169,110,0.05)', padding: '12px', borderRadius: '4px' }}>
              <div className="status-bullet animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: quoteRequested ? '#10B981' : 'var(--gold)' }} />
              <div className="status-details">
                <span className="status-heading" style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--warm-grey)', letterSpacing: '0.05em' }}>Atelier Order Status</span>
                <span className="status-desc" style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--cream)' }}>
                  {quoteRequested ? 'Quote Pending Rajasthan Review' : 'Awaiting Commission Details'}
                </span>
              </div>
            </div>

            <div className="receipt-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
              <div className="receipt-seal" style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gold)', letterSpacing: '0.1em' }}>◈ SECURE SIGNATURE COMMISSION</div>
              <p className="receipt-note" style={{ fontSize: '0.65rem', color: 'var(--warm-grey)', marginTop: '8px', lineHeight: '1.4' }}>
                All commissions are bespoke and sculpted using traditional chisels. Final confirmation of sketch design will be aligned over WhatsApp.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
