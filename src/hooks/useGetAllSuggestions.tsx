'use client';
import { useEffect, useState } from 'react';
import SupabaseService from '../lib/supabase/service';

export type Suggestions = {
  id: number;
  title: string | null;
  description: string | null;
  price: number | null;
  imageURL: string | null;
};

export function useGetAllSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | unknown>(null);
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const allSuggestions: Suggestions[] =
          await SupabaseService.getAllSuggestions();

        setSuggestions(allSuggestions);
      } catch (err: unknown) {
        setError(err || 'Error al cargar las comidas');
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  },[]);
  return {
    suggestions,
    loading,
    error,
  };
}
