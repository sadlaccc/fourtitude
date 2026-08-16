import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const applySession = (next: Session | null) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
      if (!next) {
        setIsAdmin(false);
        return;
      }
      void supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", next.user.id)
        .eq("role", "admin")
        .maybeSingle()
        .then(({ data }) => {
          if (active) setIsAdmin(Boolean(data));
        });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => applySession(next));
    void supabase.auth.getSession().then(({ data }) => applySession(data.session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, isAdmin, loading };
}
