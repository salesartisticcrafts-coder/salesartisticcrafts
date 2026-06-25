'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import '../App.css'; 
import { Navbar, Footer, useScrollReveal, CustomDesignStudio } from '../page';

export default function CustomStudioPage() {
  useScrollReveal();
  const title = "Custom Studio";

  return (
    <>
      <Navbar />
      
      <main style={{ backgroundColor: '#0a0a0a', paddingBottom: '80px' }}>
        <div style={{ height: '80px', backgroundColor: '#fff' }}></div> {/* Spacer for Navbar */}
        
        {/* The exact interactive component from the Home Page */}
        <CustomDesignStudio />
      </main>

      <Footer />
    </>
  );
}
