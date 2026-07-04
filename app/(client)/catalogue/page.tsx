'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
  createdAt: string;
}

interface OrderForm {
  clientName: string;
  clientPhone: string;
  deliveryAddress: string;
  isCustom: boolean;
  customDescription: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
  },
};

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderMode, setOrderMode] = useState<'quick' | 'custom'>('quick');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<OrderForm>({
    clientName: '',
    clientPhone: '',
    deliveryAddress: '',
    isCustom: false,
    customDescription: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    try {
      const response = await fetch(`${apiUrl}/products`);
      if (!response.ok) throw new Error('Impossible de charger les produits');
      const data = await response.json();
      setProducts(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort();

  const produitsFiltres = filtreCategorie
    ? products.filter((p) => p.category === filtreCategorie && p.available)
    : products.filter((p) => p.available);

  const handleQuickOrder = (product: Product) => {
    setSelectedProduct(product);
    setOrderMode('quick');
    setFormData({ ...formData, isCustom: false });
    setShowOrderForm(true);
  };

  const handleCustomOrder = () => {
    setSelectedProduct(null);
    setOrderMode('custom');
    setFormData({ ...formData, isCustom: true });
    setShowOrderForm(true);
  };

  const handleSubmitOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

    try {
      const payload: any = {
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        deliveryAddress: formData.deliveryAddress,
        isCustom: formData.isCustom,
      };

      if (orderMode === 'quick' && selectedProduct) {
        payload.product = { id: selectedProduct.id };
      } else {
        payload.customDescription = formData.customDescription;
      }

      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erreur lors de la commande');

      setSuccessMessage('Votre commande a ete recu avec succes !');
      setFormData({
        clientName: '',
        clientPhone: '',
        deliveryAddress: '',
        isCustom: false,
        customDescription: '',
      });
      setShowOrderForm(false);

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-stone-600">Chargement du catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <motion.section
        className="relative bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/"
              className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-6 transition-colors"
            >
              Retour a l'accueil
            </Link>
            <h1 className="text-5xl font-serif font-bold text-stone-900 mb-4">Notre Catalogue</h1>
            <p className="text-stone-600 text-lg font-light">Decouvrez toutes nos creations artisanales</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg shadow-lg"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-300 text-red-800 px-6 py-3 m-4 rounded-lg"
        >
          Erreur : {error}
        </motion.div>
      )}

      {/* Filters */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={() => setFiltreCategorie('')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filtreCategorie === ''
                  ? 'bg-amber-900 text-white shadow-lg'
                  : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Tous les produits
            </motion.button>

            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setFiltreCategorie(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filtreCategorie === cat
                    ? 'bg-amber-900 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
          <p className="mt-6 text-stone-500 text-sm">
            {produitsFiltres.length} article{produitsFiltres.length > 1 ? 's' : ''} trouve
            {produitsFiltres.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Produits Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {produitsFiltres.length === 0 ? (
              <motion.div variants={item} className="col-span-full text-center py-12">
                <p className="text-stone-600">Aucun produit disponible dans cette categorie</p>
              </motion.div>
            ) : (
              produitsFiltres.map((produit) => (
                <motion.div
                  key={produit.id}
                  variants={item}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ y: -4 }}
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                    <motion.img
                      src={produit.imageUrl || 'https://via.placeholder.com/300'}
                      alt={produit.title}
                      className="h-full w-full object-cover object-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300';
                      }}
                    />

                    {/* Badge Prix */}
                    <motion.div
                      className="absolute top-4 right-4 bg-amber-900 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      ${produit.price}
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-stone-900 font-serif">
                      {produit.title}
                    </h3>
                    <p className="mt-1 text-xs text-stone-500 uppercase tracking-wide">{produit.category}</p>

                    <motion.button
                      onClick={() => handleQuickOrder(produit)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-3 py-2 bg-amber-900 text-white font-medium rounded-lg hover:bg-amber-800 transition-colors text-sm"
                    >
                      Commander maintenant
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-amber-900 to-amber-800 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl font-serif font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Pas trouve ce que vous cherchez ?
        </motion.h2>
        <motion.p
          className="text-white/80 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Nous creeons des tricots sur mesure selon vos envies. Chaque creation est unique et personnalisee.
        </motion.p>
        <motion.button
          onClick={handleCustomOrder}
          className="bg-white text-amber-900 px-10 py-4 rounded-lg font-semibold shadow-xl hover:shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Commander une creation personnalisee
        </motion.button>
      </motion.section>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOrderForm(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-amber-900 to-amber-950 text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold">
                  {orderMode === 'quick' ? 'Commander le produit' : 'Commande sur mesure'}
                </h2>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="text-2xl text-white/70 hover:text-white"
                >
                  X
                </button>
              </div>

              <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
                {orderMode === 'quick' && selectedProduct && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-sm text-stone-600 mb-2">Produit selectionne :</p>
                    <div className="flex gap-4">
                      <img
                        src={selectedProduct.imageUrl || 'https://via.placeholder.com/100'}
                        alt={selectedProduct.title}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/100';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-amber-900">{selectedProduct.title}</p>
                        <p className="text-amber-900 font-bold">${selectedProduct.price}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                      Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.clientPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, clientPhone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Adresse de livraison *
                  </label>
                  <textarea
                    required
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryAddress: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                    placeholder="123 Rue de la Paix, 75000 Paris"
                  />
                </div>

                {orderMode === 'custom' && (
                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                      Description de votre creation *
                    </label>
                    <textarea
                      required
                      value={formData.customDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customDescription: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                      placeholder="Decrivez votre tricot ideal : couleurs, matiere, taille, style..."
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-amber-900 text-white rounded-lg font-medium hover:bg-amber-800 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Envoi...' : 'Valider la commande'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 px-6 py-3 bg-stone-200 text-stone-900 rounded-lg font-medium hover:bg-stone-300 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
