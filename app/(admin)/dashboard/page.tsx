'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Stats {
  ordersCount: number;
  productsCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ ordersCount: 0, productsCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bellshop_token');
    if (token) {
      const fetchStats = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        try {
          const [ordersRes, productsRes] = await Promise.all([
            fetch(`${apiUrl}/orders`, {
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            }),
            fetch(`${apiUrl}/products/admin/all`, {
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            }),
          ]);

          if (ordersRes.ok && productsRes.ok) {
            const orders = await ordersRes.json();
            const products = await productsRes.json();
            setStats({ ordersCount: orders.length, productsCount: products.length });
          }
        } catch (err) {
          console.error('Erreur chargement stats:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [router]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">Tableau de Bord</h1>
        <p className="text-stone-600">Bienvenue dans l'administration de BellShop</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Link href="/dashboard/orders">
          <motion.div
            variants={item}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(217 119 6 / 0.1)' }}
            className="bg-white rounded-2xl p-8 border border-stone-200 cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-stone-600 text-sm font-medium mb-2">Total Commandes</p>
                <h2 className="text-5xl font-bold text-amber-900">{loading ? '-' : stats.ordersCount}</h2>
              </div>
            </div>
            <p className="mt-4 text-stone-500 text-sm flex items-center gap-2 group">
              Gerer les commandes <span className="group-hover:translate-x-1 transition-transform">→</span>
            </p>
          </motion.div>
        </Link>

        <Link href="/dashboard/products">
          <motion.div
            variants={item}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(217 119 6 / 0.1)' }}
            className="bg-white rounded-2xl p-8 border border-stone-200 cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-stone-600 text-sm font-medium mb-2">Total Produits</p>
                <h2 className="text-5xl font-bold text-amber-900">{loading ? '-' : stats.productsCount}</h2>
              </div>
            </div>
            <p className="mt-4 text-stone-500 text-sm flex items-center gap-2 group">
              Gerer le catalogue <span className="group-hover:translate-x-1 transition-transform">→</span>
            </p>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12"
      >
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/products?action=new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-amber-900 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
            >
              Ajouter un produit
            </motion.button>
          </Link>
          <Link href="/dashboard/orders">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-stone-200 text-stone-900 rounded-lg font-medium hover:bg-stone-300 transition-colors"
            >
              Voir les commandes
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
