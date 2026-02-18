'use client';

import { useEffect, useState } from 'react';
import SupabaseService from '../lib/supabase/service';

export type Food = {
  id: number;
  title: string | null;
  description: string | null;
  price: number | null;
  type: string | null;
  subFoodType: string | null;
};

export type GroupedFoods = {
  subFoodType: string;
  items: Food[];
};

export function useGroupedFoods() {
  const [foods, setFoods] = useState<GroupedFoods[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | unknown>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const allFoods: Food[] = await SupabaseService.getAll('foods');

        const orderBySubFoodType = allFoods.reduce((acc, food) => {
          const key = food?.subFoodType ?? 'Sin tipo';
          if (!acc[key]) acc[key] = [];
          acc[key].push(food);
          return acc;
        }, {} as Record<string, Food[]>);

        const groupedArray: GroupedFoods[] = Object.entries(orderBySubFoodType).map(
          ([subFoodType, items]) => ({
            subFoodType,
            items,
          })
        );

        setFoods(groupedArray);
      } catch (err: unknown) {
        setError(err || 'Error al cargar las comidas');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  return { foods, loading, error };
}
