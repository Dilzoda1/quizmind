import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

/** Ensures a row exists in public.users (required by documents FK). */
export async function ensureUserProfile(user: User) {
  const { error } = await supabase.from('users').upsert(
    {
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    },
    { onConflict: 'id' },
  );

  if (error) throw error;
}
