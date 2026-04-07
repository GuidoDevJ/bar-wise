/**
 * Orders service — server-side only.
 * Uses SUPABASE_SERVICE_ROLE_KEY when available (recommended for production).
 * Falls back to anon key if service role key is not set.
 */
import { createClient } from '@supabase/supabase-js';
import { Database } from './database';

type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type OrderStatus = Database['public']['Enums']['OrderStatus'];

export type OrderWithItems = OrderRow & { order_items: OrderItemRow[] };

function getClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const ordersService = {
  /**
   * Returns the active (non-done, non-cancelled) order for a session.
   * Returns null if no active order exists.
   */
  async getOrderBySession(sessionId: string): Promise<OrderWithItems | null> {
    const { data } = await getClient()
      .from('orders')
      .select('*, order_items(*)')
      .eq('session_id', sessionId)
      .neq('status', 'done')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return data as OrderWithItems | null;
  },

  /**
   * Creates a new order for the session.
   * Always creates a fresh order — the agent system prompt ensures this is called only once per conversation.
   */
  async createOrder(sessionId: string, tableNumber: string): Promise<OrderRow> {
    const { data, error } = await getClient()
      .from('orders')
      .insert({ session_id: sessionId, table_number: tableNumber, status: 'pending' })
      .select()
      .single();

    if (error) throw new Error(`Error al crear el pedido: ${error.message}`);
    return data;
  },

  /**
   * Adds an item to the active order for a session.
   * Throws if there's no active order.
   */
  async addItem(
    sessionId: string,
    foodTitle: string,
    quantity: number,
    notes?: string
  ): Promise<OrderItemRow> {
    const order = await this.getOrderBySession(sessionId);
    if (!order) {
      throw new Error(
        'No hay un pedido activo. Primero indicame en qué mesa estás para iniciar el pedido.'
      );
    }

    const { data, error } = await getClient()
      .from('order_items')
      .insert({ order_id: order.id, food_title: foodTitle, quantity, notes })
      .select()
      .single();

    if (error) throw new Error(`Error al agregar el item: ${error.message}`);
    return data;
  },

  /**
   * Removes an item from the session's active order.
   * Verifies the item belongs to this session before deleting.
   */
  async removeItem(sessionId: string, itemId: number): Promise<void> {
    const order = await this.getOrderBySession(sessionId);
    if (!order) throw new Error('No hay pedido activo.');

    const { error } = await getClient()
      .from('order_items')
      .delete()
      .eq('id', itemId)
      .eq('order_id', order.id);

    if (error) throw new Error(`Error al quitar el item: ${error.message}`);
  },

  /**
   * Confirms the order (status → confirmed), signaling it's ready for the kitchen/bar.
   */
  async confirmOrder(sessionId: string): Promise<OrderRow> {
    const order = await this.getOrderBySession(sessionId);
    if (!order) throw new Error('No hay pedido activo para confirmar.');
    if (order.order_items.length === 0) {
      throw new Error('El pedido está vacío. Agregá algo antes de confirmar.');
    }

    const { data, error } = await getClient()
      .from('orders')
      .update({ status: 'confirmed', updated_at: new Date().toISOString() })
      .eq('id', order.id)
      .select()
      .single();

    if (error) throw new Error(`Error al confirmar el pedido: ${error.message}`);
    return data;
  },

  // ── Admin operations ─────────────────────────────────────────────────────────

  async getAllOrders(): Promise<OrderWithItems[]> {
    const { data, error } = await getClient()
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as OrderWithItems[];
  },

  async updateStatus(orderId: string, status: OrderStatus): Promise<OrderRow> {
    const { data, error } = await getClient()
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
