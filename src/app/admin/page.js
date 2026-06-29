'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, Landmark, DollarSign, ListOrdered, Calendar, RefreshCw, Trash2 } from 'lucide-react';
import '../App.css';
import { Navbar, Footer } from '../page';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'bank'

  // Load orders from localStorage
  const loadOrders = () => {
    const stored = localStorage.getItem('atelier_orders');
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch (e) {
        console.error(e);
        setOrders([]);
      }
    } else {
      // Default mock orders for demo
      const mockOrders = [
        {
          orderId: 'AC-2026-94817',
          clientName: 'Rahul Verma',
          email: 'rahul@verma.com',
          phone: '+91 94817 26491',
          address: 'Apartment 402, Signature Residency, Malviya Nagar, Jaipur, Rajasthan - 302017',
          payment: 'UPI (Scan & Pay)',
          amount: 28800,
          deliveryPartner: 'Blue Dart Premium Air',
          trackingNumber: 'BD-84729104',
          date: '29/06/2026, 11:20:45 AM',
          isOneClick: false
        },
        {
          orderId: 'AC-1CLICK-82649',
          clientName: 'Shreya Sen',
          email: 'shreya.sen@gmail.com',
          phone: '+91 98305 72619',
          address: 'Block C, Flat 12, Regency Heights, Gurgaon, Haryana - 122002',
          payment: 'Credit Card (1-Click)',
          amount: 14500,
          deliveryPartner: 'Delhivery Express',
          trackingNumber: 'DEL-93750174',
          date: '29/06/2026, 09:14:12 AM',
          isOneClick: true
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('atelier_orders', JSON.stringify(mockOrders));
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleClearOrders = () => {
    if (confirm('Are you sure you want to clear all transaction and order registry logs?')) {
      localStorage.removeItem('atelier_orders');
      setOrders([]);
    }
  };

  const handleAddMockOrder = () => {
    const randomNames = ['Amit Sharma', 'Nisha Gupta', 'Vikram Rathore', 'Karan Johar', 'Priyanka Chopra'];
    const randomAddress = [
      '12, Park Street, Kolkata, West Bengal - 700016',
      'Flat 101, Sea Breeze Apartments, Bandra West, Mumbai - 400050',
      'Sector 15, House 482, Noida, Uttar Pradesh - 201301',
      'No. 40, 100 Feet Road, Indiranagar, Bangalore, Karnataka - 560038'
    ];
    const partners = ['Delhivery Express', 'Blue Dart Premium Air', 'DHL International'];
    const selectedPartner = partners[Math.floor(Math.random() * partners.length)];
    const awbPrefix = selectedPartner.includes('Blue') ? 'BD-' : selectedPartner.includes('DHL') ? 'DHL-' : 'DEL-';

    const mockOrder = {
      orderId: 'AC-MOCK-' + Math.floor(10000 + Math.random() * 90000),
      clientName: randomNames[Math.floor(Math.random() * randomNames.length)],
      email: 'client.' + Math.floor(100 + Math.random() * 900) + '@example.com',
      phone: '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
      address: randomAddress[Math.floor(Math.random() * randomAddress.length)],
      payment: Math.random() > 0.5 ? 'UPI (1-Click)' : 'Credit Card (1-Click)',
      amount: Math.floor(8000 + Math.random() * 40000),
      deliveryPartner: selectedPartner,
      trackingNumber: awbPrefix + Math.floor(10000000 + Math.random() * 90000000),
      date: new Date().toLocaleString(),
      isOneClick: true
    };

    const updated = [mockOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('atelier_orders', JSON.stringify(updated));
  };

  // Calculations
  const totalSales = orders.reduce((acc, o) => acc + o.amount, 0);
  const oneClickCount = orders.filter(o => o.isOneClick).length;

  return (
    <>
      <Navbar />

      <main style={{ backgroundColor: '#FAF8F5', paddingTop: '80px', minHeight: '85vh' }}>
        <div className="container" style={{ padding: '60px 0 100px' }}>
          
          {/* Dashboard Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px', borderBottom: '1px solid rgba(201,169,110,0.25)', paddingBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>Atelier Admin Secured Portal</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#1a1a1a', fontWeight: '400', fontFamily: 'var(--font-serif)', marginTop: '8px', marginBottom: 0 }}>
                Atelier Owner Dashboard
              </h1>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleAddMockOrder} className="btn-primary" style={{ fontSize: '0.75rem', height: '44px' }}>
                <RefreshCw size={14} />
                <span>Add Mock Transaction</span>
              </button>
              <button onClick={handleClearOrders} className="btn-primary" style={{ background: 'transparent', border: '1px solid #c0392b', color: '#c0392b', fontSize: '0.75rem', height: '44px' }}>
                <Trash2 size={14} />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: '#fff', border: '1px solid #eae5df', padding: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(201,169,110,0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenues</span>
                <h3 style={{ fontSize: '1.4rem', color: '#1a1a1a', margin: '4px 0 0', fontWeight: 500 }}>₹{totalSales.toLocaleString('en-IN')}</h3>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #eae5df', padding: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(201,169,110,0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                <ListOrdered size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Consignments</span>
                <h3 style={{ fontSize: '1.4rem', color: '#1a1a1a', margin: '4px 0 0', fontWeight: 500 }}>{orders.length} Booked</h3>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #eae5df', padding: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(201,169,110,0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1-Click Checkout Sales</span>
                <h3 style={{ fontSize: '1.4rem', color: '#1a1a1a', margin: '4px 0 0', fontWeight: 500 }}>{oneClickCount} Sales ({orders.length ? Math.round((oneClickCount/orders.length)*100) : 0}%)</h3>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #eae5df', marginBottom: '30px' }}>
            <button onClick={() => setActiveTab('orders')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'orders' ? '2px solid var(--gold)' : 'none', color: activeTab === 'orders' ? '#1a1a1a' : '#888', fontWeight: activeTab === 'orders' ? 600 : 400, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}>
              Order & Transaction Registry ({orders.length})
            </button>
            <button onClick={() => setActiveTab('bank')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'bank' ? '2px solid var(--gold)' : 'none', color: activeTab === 'bank' ? '#1a1a1a' : '#888', fontWeight: activeTab === 'bank' ? 600 : 400, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}>
              Payout Settlement Account
            </button>
          </div>

          {activeTab === 'orders' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #eae5df', padding: '40px', textAlign: 'center', color: '#888' }}>
                  No transactions registered in current registry logs. Click "Add Mock Transaction" above to test.
                </div>
              ) : (
                orders.map((o, idx) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #eae5df', padding: '24px', borderRadius: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f4f1ee', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ color: '#1a1a1a', fontSize: '0.95rem' }}>{o.orderId}</strong>
                        {o.isOneClick && (
                          <span style={{ background: 'rgba(201,169,110,0.15)', color: 'var(--gold)', fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            1-Click Buy
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#888', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} /> {o.date}
                        </span>
                        <span style={{ color: '#2ecc71', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ✓ SUCCESS
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                      <div style={{ fontSize: '0.85rem' }}>
                        <h4 style={{ color: '#888', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Client Profile</h4>
                        <div style={{ color: '#1a1a1a', fontWeight: 500 }}>{o.clientName}</div>
                        <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>{o.email} | {o.phone}</div>
                        <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '4px', maxWidth: '280px', lineHeight: 1.4 }}>{o.address}</div>
                      </div>

                      <div style={{ fontSize: '0.85rem' }}>
                        <h4 style={{ color: '#888', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Consignment Logistics</h4>
                        <div style={{ color: '#1a1a1a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Truck size={14} color="var(--gold)" /> {o.deliveryPartner}
                        </div>
                        <div style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>
                          AWB: {o.trackingNumber}
                        </div>
                        <div style={{ color: '#888', fontSize: '0.75rem', marginTop: '2px' }}>
                          Status: Consignment Registered, Awaiting Dispatch
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', textAlign: 'right' }}>
                        <h4 style={{ color: '#888', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Financial settlement</h4>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}>Settled to HDFC Current Account</div>
                        <div style={{ color: '#1a1a1a', fontSize: '0.8rem', marginTop: '2px' }}>Method: {o.payment}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--gold)', marginTop: '8px' }}>
                          ₹{o.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          ) : (
            /* Bank Settlement Section */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              {/* Bank account details card */}
              <div style={{ background: '#fff', border: '1px solid #eae5df', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#1c1917', color: '#FAF8F5', padding: '24px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Landmark size={20} color="var(--gold)" />
                      <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 500 }}>SETTLEMENT GATEWAY</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#2ecc71', background: 'rgba(46,204,113,0.15)', padding: '2px 8px', borderRadius: '2px', border: '1px solid #2ecc71' }}>ACTIVE</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', margin: '0 0 4px', fontWeight: 400 }}>HDFC BANK INDIA</h3>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>Atelier Business Current Account</span>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f4f1ee', paddingBottom: '10px' }}>
                    <span style={{ color: '#888' }}>Account Name</span>
                    <strong style={{ color: '#1a1a1a' }}>ARTISTIC CRAFTS UDAIPUR LTD</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f4f1ee', paddingBottom: '10px' }}>
                    <span style={{ color: '#888' }}>Account Number</span>
                    <strong style={{ color: '#1a1a1a' }}>XXXX XXXX 5678</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f4f1ee', paddingBottom: '10px' }}>
                    <span style={{ color: '#888' }}>IFSC Code</span>
                    <strong style={{ color: '#1a1a1a' }}>HDFC0000123</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f4f1ee', paddingBottom: '10px' }}>
                    <span style={{ color: '#888' }}>Branch Office</span>
                    <span style={{ color: '#1a1a1a', fontWeight: 500 }}>Udaipur Central Branch, Udaipur</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px' }}>
                    <span style={{ color: '#888' }}>Total Payouts Settled</span>
                    <strong style={{ color: 'var(--gold)', fontSize: '1.05rem' }}>₹{totalSales.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* Settlement summary details */}
              <div style={{ background: '#fff', border: '1px solid #eae5df', padding: '30px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#1a1a1a', margin: 0 }}>Settlement Ledger</h4>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, margin: 0 }}>
                  Funds captured via Razorpay UPI & Card gateway routes are automatically pooled and settled to the linked HDFC bank payout destination inside <strong>T+1 business days</strong>.
                </p>
                <div style={{ background: '#faf9f8', border: '1px solid #eae5df', padding: '16px', borderRadius: '4px', fontSize: '0.8rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                    <span>Pending Settlement (T+1):</span>
                    <strong>₹0 (All Settled)</strong>
                  </div>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderTop: '1px solid #eae5df', paddingTop: '8px' }}>
                    <span>Last Payout Settled Date:</span>
                    <strong>Today (Automatic)</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', color: '#666' }}>
                  <ShieldCheck size={16} color="#2ecc71" />
                  <span>Settlements are processed via secure Razorpay Payouts networks.</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
