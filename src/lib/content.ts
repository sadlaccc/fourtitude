import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Service = Tables<"services">;
export type TeamMember = Tables<"team_members">;
export type Post = Tables<"posts">;
export type SiteSettings = Tables<"site_settings">;
export type ContactMessage = Tables<"contact_messages">;

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () =>
    unwrap(await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()),
});

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () =>
    unwrap(await supabase.from("services").select("*").order("sort_order")) as Service[],
});

export const teamQuery = queryOptions({
  queryKey: ["team_members"],
  queryFn: async () =>
    unwrap(await supabase.from("team_members").select("*").order("sort_order")) as TeamMember[],
});

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: async () =>
    unwrap(await supabase.from("posts").select("*").order("published_at", { ascending: false })) as Post[],
});

export const messagesQuery = queryOptions({
  queryKey: ["contact_messages"],
  queryFn: async () =>
    unwrap(
      await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ) as ContactMessage[],
});

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
