'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    available: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('bellshop_token');
    if (token) {
      fetchProducts(token);
    }
  }, []);

  const fetchProducts = async (token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

    try {
      const response = await fetch(`${apiUrl}/products/admin/all`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('bellshop_token');
        router.push('/login');
        return;
      }

      if (!response.ok) throw new Error('Impossible de charger les produits.');

      const data = await response.json();
      setProducts(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('bellshop_token');
    if (!token) return;

    setSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        category: formData.category,
        available: formData.available,
      };

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${apiUrl}/products/${editingId}` : `${apiUrl}/products`;

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde.');

      const result = await response.json();

      if (editingId) {
        setProducts((prev) => prev.map((p) => (p.id === editingId ? result : p)));
      } else {
        setProducts((prev) => [result, ...prev]);
      }

      resetForm();
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('bellshop_token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

    try {
      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression.');

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeletingProductId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      available: product.available,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', imageUrl: '', category: '', available: true });
    setEditingId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'bellshop_preset');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Lypydquk';
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Erreur lors du chargement de l\'image');

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        imageUrl: data.secure_url,
      }));
    } catch (err) {
      console.error('Erreur upload Cloudinary:', err);
      setError('Erreur lors de l\'upload de l\'image vers Cloudinary');
    } finally {
      setUploadingImage(false);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort();

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-stone-600">Chargement des produits...</p>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-amber-900">Produits</h1>
            <p className="text-stone-600 mt-1">{products.length} produit{products.length !== 1 ? 's' : ''} au total</p>
          </div>
          <motion.button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-amber-900 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
          >
            Ajouter un produit
          </motion.button>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800"
        >
          Erreur : {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 space-y-4"
      >
        <div>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filterCategory === ''
                ? 'bg-amber-900 text-white'
                : 'bg-stone-200 text-stone-900 hover:bg-stone-300'
            }`}
          >
            Toutes les categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterCategory === cat
                  ? 'bg-amber-900 text-white'
                  : 'bg-stone-200 text-stone-900 hover:bg-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-amber-900">
                  {editingId ? 'Modifier le produit' : 'Ajouter un produit'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-2xl text-stone-400 hover:text-stone-600"
                >
                  X
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">Titre *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                      placeholder="Ex: Pull Laine Merinos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">Categorie *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                      placeholder="Ex: PULL, TSHIRT, ACCESSOIRE"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">Prix (EUR) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                      placeholder="49.99"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">Disponible</label>
                    <select
                      value={formData.available ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                    >
                      <option value="true">Disponible</option>
                      <option value="false">Indisponible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">Image du produit</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {uploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                          <div className="text-center">
                            <div className="inline-block animate-spin">
                              <div className="w-5 h-5 border-2 border-amber-900 border-t-transparent rounded-full"></div>
                            </div>
                            <p className="text-xs text-stone-600 mt-1">Upload...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {formData.imageUrl && (
                      <div className="mt-3 flex justify-center relative">
                        <img src={formData.imageUrl} alt="Preview" className="max-h-48 rounded-lg shadow-md" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          X
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-stone-500">ou entrez une URL directement :</p>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
                    placeholder="Description detaillee du produit..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-amber-900 text-white rounded-lg font-medium hover:bg-amber-800 disabled:opacity-50"
                  >
                    {submitting ? 'Sauvegarde...' : editingId ? 'Modifier' : 'Creer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-6 py-3 bg-stone-200 text-stone-900 rounded-lg font-medium hover:bg-stone-300"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingProductId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletingProductId(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Confirmer la suppression</h2>
              </div>

              <div className="p-6">
                <p className="text-stone-700 mb-6">Etes-vous certain de vouloir supprimer ce produit ? Cette action est irreversible.</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(deletingProductId)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => setDeletingProductId(null)}
                    className="flex-1 px-4 py-2 bg-stone-200 text-stone-900 rounded-lg font-medium hover:bg-stone-300 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        {filteredProducts.length === 0 ? (
          <motion.div variants={item} className="text-center py-12 bg-white rounded-lg border border-stone-200">
            <p className="text-stone-600">Aucun produit correspondant</p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Titre</th>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Categorie</th>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Prix</th>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Statut</th>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredProducts.map((product) => (
                    <motion.tr key={product.id} variants={item} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-stone-900">{product.title}</div>
                        <div className="text-xs text-stone-500 line-clamp-1">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600">{product.category}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-amber-900">{product.price} EUR</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${product.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {product.available ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleEdit(product)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-blue-100 text-blue-900 rounded font-medium text-xs hover:bg-blue-200 transition-colors"
                          >
                            Modifier
                          </motion.button>
                          <motion.button
                            onClick={() => setDeletingProductId(product.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-red-100 text-red-900 rounded font-medium text-xs hover:bg-red-200 transition-colors"
                          >
                            Supprimer
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
