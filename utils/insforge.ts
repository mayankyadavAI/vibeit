// utils/insforge.ts
import { createClient } from '@insforge/sdk';

// Find your anon key with: npx @insforge/cli secrets get ANON_KEY
const insforgeUrl =
  process.env.NEXT_PUBLIC_INSFORGE_PROJECT_URL ||
  process.env.NEXT_PUBLIC_INSFORGE_URL ||
  process.env.NEXT_PUBLIC_INFRABASE_PROJECT_URL!;

const insforgeAnonKey =
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
  process.env.NEXT_PUBLIC_INFRABASE_ANON_KEY!;

const client = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey,
});

// Alias client.from to client.database.from for seamless compatibility
export const insforge = Object.assign(client, {
  from: (table: string) => client.database.from(table),
});
