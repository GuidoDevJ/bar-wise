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
