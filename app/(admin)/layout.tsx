'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminLayout from './admin-layout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('bellshop_token');
    
    // Si on est sur la page login, pas besoin de vérifier
    if (pathname === '/login') {
      setIsVerifying(false);
      setIsAuthenticated(false);
      return;
    }

    // Vérifier le token
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setIsVerifying(false);
    }
  }, [pathname, router]);

  // Pendant la vérification, afficher une page de chargement
  if (isVerifying && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-stone-600">Verification en cours...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié et pas sur login, redirection en cours
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  // Page login ou authentifié
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
