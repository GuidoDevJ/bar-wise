'use client';

import { useEffect, useState } from 'react';
import SupabaseService from '../lib/supabase/service';
import { Database } from '../lib/supabase/database';
import { Food, GroupedFoods } from './useGetAllFood';

type FoodType = Database['public']['Enums']['FoodTypes'];

export function useGroupedFoodsByType(foodType: FoodType) {
  const [foods, setFoods] = useState<GroupedFoods[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | unknown>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const allFoods: Food[] = await SupabaseService.getFoodsByType(foodType);

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
        setError(err || 'Error al cargar los items');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [foodType]);

  return { foods, loading, error };
}
