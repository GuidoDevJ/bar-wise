'use client';

import { useEffect, useState } from 'react';
import SupabaseService from '@/lib/supabase/service';
import { Food } from './useGetAllFood';
import { Suggestions } from './useGetAllSuggestions';

export type SearchableItem = {
  id: number;
  title: string;
  type: 'food' | 'suggestion';
  href: string;
};

export function useSearchMenu() {
  const [items, setItems] = useState<SearchableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [foods, suggestions] = await Promise.all([
          SupabaseService.getAll('foods') as Promise<Food[]>,
          SupabaseService.getAllSuggestions() as Promise<Suggestions[]>,
        ]);

        const foodItems: SearchableItem[] = foods
          .filter((f) => f.title)
          .map((f) => ({
            id: f.id,
            title: f.title!,
            type: 'food' as const,
            href: '/foods',
          }));

        const sugItems: SearchableItem[] = suggestions
          .filter((s) => s.title)
          .map((s) => ({
            id: s.id,
            title: s.title!,
            type: 'suggestion' as const,
            href: '/suggestions',
          }));

        setItems([...foodItems, ...sugItems]);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { items, loading };
}
