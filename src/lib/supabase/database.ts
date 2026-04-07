export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          session_id: string;
          table_number: string;
          status: Database['public']['Enums']['OrderStatus'];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          table_number: string;
          status?: Database['public']['Enums']['OrderStatus'];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          table_number?: string;
          status?: Database['public']['Enums']['OrderStatus'];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: string;
          food_id: number | null;
          food_title: string;
          quantity: number;
          unit_price: number | null;
          notes: string | null;
        };
        Insert: {
          id?: number;
          order_id: string;
          food_id?: number | null;
          food_title: string;
          quantity?: number;
          unit_price?: number | null;
          notes?: string | null;
        };
        Update: {
          id?: number;
          order_id?: string;
          food_id?: number | null;
          food_title?: string;
          quantity?: number;
          unit_price?: number | null;
          notes?: string | null;
        };
      };
      suggestions: {
        Row: {
          id: number;
          title: string | null;
          description: string | null;
          imageURL: string | null;
          price: number | null;
        };
        Insert: {
          id?: number;
          title?: string | null;
          description?: string | null;
          imageURL?: string | null;
          price?: number | null;
        };
        Update: {
          id?: number;
          title?: string | null;
          description?: string | null;
          imageURL?: string | null;
          price?: number | null;
        };
      };
      foods: {
        Row: {
          id: number;
          title: string | null;
          description: string | null;
          price: number | null;
          type: Database['public']['Enums']['FoodTypes'] | null;
          subFoodType: Database['public']['Enums']['SubFoodTypes'] | null;
        };
        Insert: {
          id?: number;
          title?: string | null;
          description?: string | null;
          price?: number | null;
          type?: Database['public']['Enums']['FoodTypes'] | null;
          subFoodType?: Database['public']['Enums']['SubFoodTypes'] | null;
        };
        Update: {
          id?: number;
          title?: string | null;
          description?: string | null;
          price?: number | null;
          type?: Database['public']['Enums']['FoodTypes'] | null;
          subFoodType?: Database['public']['Enums']['SubFoodTypes'] | null;
        };
      };
      comments: {
        Row: {
          id: number;
          calification: number | null;
          food: string | null;
          review: string | null;
          fullName: string | null;
          email: string | null;
        };
        Insert: {
          id?: number;
          calification?: number | null;
          food?: string | null;
          review?: string | null;
          fullName?: string | null;
          email?: string | null;
        };
        Update: {
          id?: number;
          calification?: number | null;
          food?: string | null;
          review?: string | null;
          fullName?: string | null;
          email?: string | null;
        };
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      OrderStatus: 'pending' | 'confirmed' | 'in_progress' | 'done' | 'cancelled';
      FoodTypes: 'COMIDAS' | 'TRAGOS' | 'BEBIDAS';
      SubFoodTypes:
        | 'ENTRADAS'
        | 'PRINCIPALES'
        | 'GUARNICIONES'
        | 'PIZZAS'
        | 'SANDWICHES'
        | 'CERVEZAS'
        | 'VINOS'
        | 'ESPUMANTES'
        | 'BEBIDAS SIN ALCOHOL';
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
