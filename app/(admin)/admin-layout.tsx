'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ne pas afficher la navbar sur la page de login
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem('bellshop_token');
    document.cookie = 'bellshop_token=; path=/; max-age=0'; // Effacer le cookie
    router.push('/login');
  };

  const menuItems = [
    { label: 'Commandes', href: '/dashboard/orders' },
    { label: 'Produits', href: '/dashboard/products' },
  ];

  const getPageTitle = () => {
    if (pathname.includes('orders')) return 'Commandes';
    if (pathname.includes('products')) return 'Produits';
    if (pathname.includes('dashboard')) return 'Tableau de Bord';
    return 'BellShop';
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Sidebar Navigation */}
      <motion.aside 
        className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-amber-900 to-amber-950 text-white shadow-2xl z-40 hidden md:flex flex-col"
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Logo + Page Title */}
        <div className="p-6 border-b border-amber-800">
          <h1 className="text-2xl font-serif font-bold tracking-widest">BELLSHOP</h1>
          <p className="text-amber-200 text-xs mt-1">{getPageTitle()}</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <motion.div key={item.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group ${
                  pathname.includes(item.href.split('/').pop() || '')
                    ? 'bg-amber-800 text-white'
                    : 'text-amber-100 hover:bg-amber-800'
                }`}
              >
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-amber-800">
          <motion.button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-medium text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Deconnexion
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 z-30">
        <div>
          <h1 className="text-lg font-serif font-bold text-amber-900">BELLSHOP</h1>
          <p className="text-xs text-stone-500">{getPageTitle()}</p>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-2xl text-amber-900"
        >
          ≡
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.nav
          className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-stone-200 p-4 space-y-2 z-20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm"
          >
            Deconnexion
          </button>
        </motion.nav>
      )}

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
