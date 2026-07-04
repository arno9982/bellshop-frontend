'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 flex flex-col justify-between">
      {/* NAVBAR */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif tracking-widest font-bold text-amber-900 hover:text-amber-700 transition">
            BELLSHOP
          </Link>
          <nav className="hidden md:flex space-x-8 font-medium text-sm tracking-wide text-stone-600">
            <Link 
              href="/" 
              className={`transition ${isActive('/') && pathname === '/' ? 'text-amber-900 font-semibold' : 'hover:text-amber-800'}`}
            >
              Accueil
            </Link>
            <Link 
              href="/catalogue" 
              className={`transition ${isActive('/catalogue') ? 'text-amber-900 font-semibold' : 'hover:text-amber-800'}`}
            >
              Nos Tricots
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            
          </div>
        </div>
      </header>

      {/* CONTENU DE LA PAGE */}
      <main className="flex-grow">{children}</main>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p className="font-serif text-white text-lg mb-4">Bellshop — Mailles & Douceur</p>
          <p>© 2026 Creations fait main. Tous droits reserves.</p>
          <p className="mt-4 text-stone-300">Tel: +1 (506) 226-2614</p>
        </div>
      </footer>
    </div>
  );
}