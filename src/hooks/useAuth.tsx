'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
  signIn as authSignIn,
  signOut as authSignOut,
  getSession,
  onAuthStateChange,
} from '@/lib/supabase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = onAuthStateChange((_event, session) => {
      const s = session as { user: User } | null;
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const data = await authSignIn(email, password);
    setUser(data.user);
    return data;
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
  };

  return { user, loading, signIn, signOut };
}
