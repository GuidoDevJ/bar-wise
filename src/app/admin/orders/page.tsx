'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SupabaseService from '@/lib/supabase/service';
import { Database } from '@/lib/supabase/database';

type OrderStatus = Database['public']['Enums']['OrderStatus'];

interface OrderItem {
  id: number;
  food_title: string;
  quantity: number;
  unit_price: number | null;
  notes: string | null;
}

interface Order {
  id: string;
  session_id: string;
  table_number: string;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; next: OrderStatus | null }
> = {
  pending:    { label: 'Pendiente',    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', next: 'confirmed' },
  confirmed:  { label: 'Confirmado',   color: 'bg-blue-100 text-blue-800 border-blue-200',       next: 'in_progress' },
  in_progress:{ label: 'En preparación', color: 'bg-purple-100 text-purple-800 border-purple-200', next: 'done' },
  done:       { label: 'Listo',        color: 'bg-green-100 text-green-800 border-green-200',    next: null },
  cancelled:  { label: 'Cancelado',    color: 'bg-gray-100 text-gray-500 border-gray-200',       next: null },
};

const FILTER_OPTIONS: Array<{ value: OrderStatus | 'all'; label: string }> = [
  { value: 'all',        label: 'Todos' },
  { value: 'pending',    label: 'Pendientes' },
  { value: 'confirmed',  label: 'Confirmados' },
  { value: 'in_progress', label: 'En preparación' },
  { value: 'done',       label: 'Listos' },
  { value: 'cancelled',  label: 'Cancelados' },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── Fetch inicial ────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      const { data: { session } } = await SupabaseService.client.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error('Error al cargar pedidos');
      const data = await res.json();
      setOrders(data);
    } catch {
      /* silent — realtime compensará */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Supabase Realtime ────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = SupabaseService.client
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => { fetchOrders(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        () => { fetchOrders(); }
      )
      .subscribe();

    return () => { SupabaseService.client.removeChannel(channel); };
  }, [fetchOrders]);

  // ── Cambiar status ───────────────────────────────────────────────────────────
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const { data: { session } } = await SupabaseService.client.auth.getSession();
      if (!session) return;

      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      // Realtime actualizará la lista automáticamente
    } catch {
      /* silent */
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = (orderId: string) => handleStatusChange(orderId, 'cancelled');

  // ── Filtrado ─────────────────────────────────────────────────────────────────
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const counts = orders.reduce(
    (acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">Vista en tiempo real de todos los pedidos</p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-sm text-secondary-600 hover:text-secondary-800 font-medium"
        >
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
              filter === opt.value
                ? 'bg-secondary-700 text-white border-secondary-700'
                : 'bg-white text-gray-600 border-gray-200 hover:border-secondary-300'
            }`}
          >
            {opt.label}
            {opt.value !== 'all' && counts[opt.value] ? (
              <span className="ml-1.5 bg-white/20 text-inherit rounded-full px-1.5 py-0.5 text-xs">
                {counts[opt.value]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Lista de pedidos */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="font-medium">No hay pedidos {filter !== 'all' ? 'con este estado' : ''}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const nextStatus = cfg.next;
            const isUpdating = updatingId === order.id;
            const total = order.order_items.reduce(
              (sum, item) => sum + (item.unit_price ?? 0) * item.quantity,
              0
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-800">
                      Mesa {order.table_number}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{formatTime(order.created_at)}</span>
                </div>

                {/* Items */}
                <div className="flex-1 px-4 py-3 space-y-1.5">
                  {order.order_items.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Sin items</p>
                  ) : (
                    order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          <span className="font-medium">{item.quantity}×</span>{' '}
                          {item.food_title}
                          {item.notes && (
                            <span className="text-gray-400 text-xs ml-1">({item.notes})</span>
                          )}
                        </span>
                        {item.unit_price != null && (
                          <span className="text-gray-500 tabular-nums">
                            ${(item.unit_price * item.quantity).toLocaleString('es-AR')}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  {total > 0 && (
                    <span className="text-sm font-semibold text-gray-700">
                      Total: ${total.toLocaleString('es-AR')}
                    </span>
                  )}
                  <div className="flex gap-2 ml-auto">
                    {order.status !== 'done' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={isUpdating}
                        className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-40"
                      >
                        Cancelar
                      </button>
                    )}
                    {nextStatus && (
                      <button
                        onClick={() => handleStatusChange(order.id, nextStatus)}
                        disabled={isUpdating}
                        className="px-3 py-1.5 bg-secondary-600 hover:bg-secondary-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-40 flex items-center gap-1.5"
                      >
                        {isUpdating && (
                          <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {STATUS_CONFIG[nextStatus].label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
