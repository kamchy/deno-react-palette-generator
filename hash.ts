import { createHash } from "https://deno.land/std@0.100.0/hash/mod.ts";

export function md5sum(data: string): string {
  const h = createHash("md5");
  h.update(data);
  return h.toString();
}
