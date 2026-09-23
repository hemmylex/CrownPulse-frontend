"use client";

import { createBrowserClient } from "@supabase/ssr";

function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

let client: ReturnType<typeof createSupabaseBrowserClient> | undefined;

/**
 * Singleton browser Supabase client.
 * Use this in Client Components only.
 */
export function supabaseBrowser() {
  if (!client) {
    client = createSupabaseBrowserClient();
  }
  return client;
}