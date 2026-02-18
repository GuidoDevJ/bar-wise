'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SupabaseService from '@/lib/supabase/service';
import { Database } from '@/lib/supabase/database';

type Comment = Database['public']['Tables']['comments']['Row'];

interface Stats {
  totalFoods: number;
  totalSuggestions: number;
  totalComments: number;
  avgCalification: number;
}

const statCards = [
  { key: 'totalFoods', label: 'Comidas', href: '/admin/foods', color: 'bg-primary-100 text-primary-700' },
  { key: 'totalSuggestions', label: 'Sugerencias', href: '/admin/suggestions', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'totalComments', label: 'Resenas', href: '/admin/comments', color: 'bg-blue-100 text-blue-700' },
  { key: 'avgCalification', label: 'Calificacion Promedio', href: '/admin/comments', color: 'bg-green-100 text-green-700' },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalFoods: 0,
    totalSuggestions: 0,
    totalComments: 0,
    avgCalification: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [foods, suggestions, comments] = await Promise.all([
          SupabaseService.getAll('foods'),
          SupabaseService.getAllSuggestions(),
          SupabaseService.getAllComments() as Promise<Comment[]>,
        ]);

        const ratings = comments
          .map((c) => c.calification)
          .filter((r): r is number => r !== null);
        const avg =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

        setStats({
          totalFoods: foods.length,
          totalSuggestions: suggestions.length,
          totalComments: comments.length,
          avgCalification: Math.round(avg * 10) / 10,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              Gestionar Resenas
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
