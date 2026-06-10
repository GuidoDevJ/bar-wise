'use client';
import { useEffect, useState } from 'react';
import SupabaseService from '../lib/supabase/service';

export type Comment = {
  id: number;
  calification: number | null;
  food: string | null;
  review: string | null;
  fullName: string | null;
  email: string | null;
};

export function useGetAllComments(refreshKey = 0) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | unknown>(null);
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const allComments: Comment[] = await SupabaseService.getAllComments();
        setComments(allComments);
      } catch (err: unknown) {
        setError(err || 'Error al cargar las Reseñas');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [refreshKey]);
  return {
    comments,
    loading,
    error,
  };
}
