"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let client;
    try {
      client = createClient();
    } catch {
      setLoading(false);
      return;
    }

    const sync = async () => {
      // Session from storage resolves first so UI (e.g. checkout) is not blocked on getUser().
      const {
        data: { session },
      } = await client.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);

      const { data } = await client.auth.getUser();
      setUser(data.user ?? null);
    };

    void sync();

    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
