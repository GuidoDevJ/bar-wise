import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database';

type Tables = keyof Database['public']['Tables'];

class SupabaseService {
  private static instance: SupabaseService;
  public client: SupabaseClient<Database>;

  private constructor() {
    this.client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  async getAllSuggestions() {
    const { data, error } = await this.client.from('suggestions').select('*');
    if (error) throw new Error(error.message);
    return data;
  }
  async getAllComments() {
    const { data, error } = await this.client.from('comments').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async getAll<T extends Tables>(table: T) {
    const { data, error } = await this.client.from(table).select('*');
    if (error)
      throw new Error(`Error getting data from ${table}: ${error.message}`);
    return data;
  }

  async getById<T extends Tables>(table: T, id: number) {
    const { data, error } = await this.client
      .from(table)
      .select('*')
      .eq('id', id as never)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }
  async getFoodsByType(foodType: Database['public']['Enums']['FoodTypes']) {
    const { data, error } = await this.client
      .from('foods')
      .select('*')
      .eq('type', foodType);
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  // Crear un registro
  async insert<T extends Tables>(
    table: T,
    row: Database['public']['Tables'][T]['Insert']
  ) {
    const { data, error } = await this.client
      .from(table)
      .insert([row] as never)
      .select()
      .single();
    if (error)
      throw new Error(`Error inserting into ${table}: ${error.message}`);
    return data;
  }

  // Actualizar un registro
  async update<T extends Tables>(
    table: T,
    id: number,
    row: Database['public']['Tables'][T]['Update']
  ) {
    const { data, error } = await this.client
      .from(table)
      .update(row as never)
      .eq('id', id as never)
      .select()
      .single();

    if (error)
      throw new Error(`Error updating ${table} id ${id}: ${error.message}`);
    return data;
  }

  // Eliminar un registro
  async delete<T extends Tables>(table: T, id: number) {
    const { error } = await this.client
      .from(table)
      .delete()
      .eq('id', id as never);
    if (error)
      throw new Error(`Error deleting ${table} id ${id}: ${error.message}`);
  }
}

export default SupabaseService.getInstance();
