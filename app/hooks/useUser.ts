'use client';
// Fetch and manage current user profile data from database

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import type { Profile } from '@/lib/types';

export function useUser() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchProfile = async () => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setProfile(data);
        } catch (error) {
          console.error('[v0] Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [authLoading, user]);

  return { profile, loading: authLoading || loading };
}
