import { Md5 } from "https://deno.land/std@0.100.0/hash/md5.ts";

export function md5sum(data: string): string {
  const h = new Md5();
  h.update(data);
  return h.toString();
}
