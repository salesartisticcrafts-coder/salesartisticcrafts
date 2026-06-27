'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import '../App.css'; 
import { Navbar, Footer, useScrollReveal } from '../page';
import CustomStudioConfigurator from './CustomStudioConfigurator';

export default function CustomStudioPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      
      <main style={{ backgroundColor: 'var(--black-deep)', paddingBottom: '80px' }}>
        <div style={{ height: '120px', backgroundColor: 'var(--black-deep)' }}></div> {/* Spacer for Navbar */}
        
        {/* Dedicated interactive configurator */}
        <CustomStudioConfigurator />
      </main>

      <Footer />
    </>
  );
}
