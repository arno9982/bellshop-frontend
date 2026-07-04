'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  id: number;
  clientName: string;
  clientPhone: string;
  deliveryAddress: string;
  status: string;
  isCustom: boolean;
  customDescription: string | null;
  product?: {
    title: string;
    price: number;
  } | null;
  createdAt: string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  NOUVELLE: { bg: 'bg-red-100', text: 'text-red-800', label: 'Nouvelle' },
  VALIDEE: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Validee' },
  EN_COURS_DE_PRODUCTION: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En cours de production' },
  PRETE: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Prete' },
  EXPEDIEE: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Expediee' },
  LIVREE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Livree' },
  ANNULEE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Annulee' },
};

const statuses = ['NOUVELLE', 'VALIDEE', 'EN_COURS_DE_PRODUCTION', 'PRETE', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('bellshop_token');
    if (token) {
      fetchOrders(token);
    }
  }, []);

  const fetchOrders = async (token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('bellshop_token');
        router.push('/login');
        return;
      }

      if (!response.ok) throw new Error('Impossible de charger les commandes.');

      const data = await response.json();
      setOrders(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const token = localStorage.getItem('bellshop_token');
    if (!token) return;

    setUpdatingOrder(orderId);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

    try {
      const response = await fetch(`${apiUrl}/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
        setEditingOrderId(null);
        setSelectedNewStatus('');
      }
    } catch (err) {
      console.error('Erreur lors de la mise a jour:', err);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-stone-600">Chargement des commandes...</p>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-amber-900">Commandes</h1>
            <p className="text-stone-600 mt-1">{orders.length} commande{orders.length !== 1 ? 's' : ''} au total</p>
          </div>
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
            placeholder="Rechercher une commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-900"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filterStatus === ''
                ? 'bg-amber-900 text-white'
                : 'bg-stone-200 text-stone-900 hover:bg-stone-300'
            }`}
          >
            Tous
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === status
                  ? statusConfig[status].bg + ' ' + statusConfig[status].text
                  : 'bg-stone-200 text-stone-900 hover:bg-stone-300'
              }`}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        {orders.length === 0 ? (
          <motion.div variants={item} className="text-center py-12 bg-white rounded-lg border border-stone-200">
            <p className="text-stone-600">Aucune commande pour le moment</p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Client</th>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Details</th>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Statut</th>
                    <th className="px-6 py-4 text-left font-semibold text-stone-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {orders
                    .filter((order) => {
                      const matchesSearch = order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                          order.clientPhone.includes(searchQuery);
                      const matchesStatus = !filterStatus || order.status === filterStatus;
                      return matchesSearch && matchesStatus;
                    })
                    .map((order) => {
                      const config = statusConfig[order.status] || statusConfig.NOUVELLE;
                      return (
                        <motion.tr key={order.id} variants={item} className="hover:bg-stone-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-stone-900">{order.clientName}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-stone-600">
                            <div>Tel: {order.clientPhone}</div>
                            <div className="text-xs mt-1">Adresse: {order.deliveryAddress.substring(0, 40)}...</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-stone-600">
                            {order.isCustom ? (
                              <p className="italic text-stone-700 max-w-xs">"{order.customDescription}"</p>
                            ) : (
                              <div>
                                <div className="font-medium text-stone-900">{order.product?.title}</div>
                                <div className="text-amber-900 font-semibold">${order.product?.price}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                              {config.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <motion.button
                              onClick={() => {
                                setEditingOrderId(order.id);
                                setSelectedNewStatus(order.status);
                              }}
                              disabled={updatingOrder === order.id}
                              className="px-4 py-2 bg-amber-100 text-amber-900 rounded font-medium text-sm hover:bg-amber-200 disabled:opacity-50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Modifier
                            </motion.button>
                          </td>
                        </motion.tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {editingOrderId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setEditingOrderId(null);
              setSelectedNewStatus('');
            }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Modifier le statut</h2>
              </div>

              <div className="p-6">
                <p className="text-stone-600 mb-4">Selectionnez le nouveau statut :</p>

                <div className="space-y-2 mb-6">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedNewStatus(status)}
                      className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors ${
                        selectedNewStatus === status
                          ? statusConfig[status].bg + ' ' + statusConfig[status].text
                          : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
                      }`}
                    >
                      {statusConfig[status].label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusChange(editingOrderId, selectedNewStatus)}
                    disabled={updatingOrder === editingOrderId}
                    className="flex-1 px-4 py-2 bg-amber-900 text-white rounded-lg font-medium hover:bg-amber-800 disabled:opacity-50 transition-colors"
                  >
                    {updatingOrder === editingOrderId ? 'Sauvegarde...' : 'Valider'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingOrderId(null);
                      setSelectedNewStatus('');
                    }}
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
    </div>
  );
}
