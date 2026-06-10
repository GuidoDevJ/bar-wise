'use client';

import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/lib/supabase/database';
import SupabaseService from '@/lib/supabase/service';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Comment = Database['public']['Tables']['comments']['Row'];

interface Stats {
  totalFoods: number;
  totalSuggestions: number;
  totalComments: number;
  avgCalification: number;
  pendingOrders: number;
}

const statCards = [
  { key: 'totalFoods', label: 'Comidas', href: '/admin/foods', color: 'bg-primary-100 text-primary-700' },
  { key: 'totalSuggestions', label: 'Sugerencias', href: '/admin/suggestions', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'totalComments', label: 'Reseñas', href: '/admin/comments', color: 'bg-blue-100 text-blue-700' },
  { key: 'avgCalification', label: 'Calificacion Promedio', href: '/admin/comments', color: 'bg-green-100 text-green-700' },
  { key: 'pendingOrders', label: 'Pedidos Pendientes', href: '/admin/orders', color: 'bg-orange-100 text-orange-700' },
] as const;

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalFoods: 0,
    totalSuggestions: 0,
    totalComments: 0,
    avgCalification: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [embedStatus, setEmbedStatus] = useState<{
    state: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ state: 'idle' });

  const handleReEmbed = async () => {
    if (!user) return;
    setEmbedStatus({ state: 'loading' });
    try {
      const { data: { session } } = await SupabaseService.client.auth.getSession();
      if (!session) throw new Error('Sin sesion activa');

      const res = await fetch('/api/admin/re-embed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Error desconocido');
      setEmbedStatus({ state: 'success', message: json.message });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setEmbedStatus({ state: 'error', message: msg });
    } finally {
      setTimeout(() => setEmbedStatus({ state: 'idle' }), 4000);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await SupabaseService.client.auth.getSession();

        const [foods, suggestions, comments, ordersRes] = await Promise.all([
          SupabaseService.getAll('foods'),
          SupabaseService.getAllSuggestions(),
          SupabaseService.getAllComments() as Promise<Comment[]>,
          session
            ? fetch('/api/admin/orders', {
                headers: { Authorization: `Bearer ${session.access_token}` },
              }).then((r) => r.json())
            : Promise.resolve([]),
        ]);

        const ratings = comments
          .map((c) => c.calification)
          .filter((r): r is number => r !== null);
        const avg =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

        const pending = Array.isArray(ordersRes)
          ? ordersRes.filter(
              (o: { status: string }) => o.status === 'pending' || o.status === 'confirmed'
            ).length
          : 0;

        setStats({
          totalFoods: foods.length,
          totalSuggestions: suggestions.length,
          totalComments: comments.length,
          avgCalification: Math.round(avg * 10) / 10,
          pendingOrders: pending,
        });
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatValue = (key: string, value: number) => {
    if (key === 'avgCalification') {
      return value > 0 ? `${value} / 5 ★` : 'Sin datos';
    }
    if (key === 'pendingOrders') {
      return value > 0 ? `${value} activos` : 'Sin pedidos';
    }
    return value.toString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen general del contenido de Bar Wise
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="block p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div
                className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${card.color} mb-3`}
              >
                {card.label}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {formatValue(card.key, stats[card.key])}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Acciones rapidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin/orders"
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center"
          >
            <span className="text-sm font-medium text-gray-700">
              Ver Pedidos
            </span>
          </Link>
          <Link
            href="/admin/foods"
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center"
          >
            <span className="text-sm font-medium text-gray-700">
              Gestionar Comidas
            </span>
          </Link>
          <Link
            href="/admin/suggestions"
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center"
          >
            <span className="text-sm font-medium text-gray-700">
              Gestionar Sugerencias
            </span>
          </Link>
          <Link
            href="/admin/comments"
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center"
          >
            <span className="text-sm font-medium text-gray-700">
              Gestionar Reseñas
            </span>
          </Link>
        </div>
      </div>

      {/* Sincronizacion del agente RAG */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Agente de IA — Sincronizacion
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cada vez que agregues, edites o elimines comidas o sugerencias,
              resincroniza para que el asistente virtual use los datos actualizados.
            </p>
          </div>
          <button
            onClick={handleReEmbed}
            disabled={embedStatus.state === 'loading'}
            className="flex-shrink-0 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 flex items-center gap-2"
          >
            {embedStatus.state === 'loading' ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              'Resincronizar embeddings'
            )}
          </button>
        </div>

        {embedStatus.state === 'success' && (
          <p className="mt-3 text-sm text-green-600 font-medium">
            ✓ {embedStatus.message}
          </p>
        )}
        {embedStatus.state === 'error' && (
          <p className="mt-3 text-sm text-red-600 font-medium">
            ✗ {embedStatus.message}
          </p>
        )}
      </div>
    </div>
  );
}
