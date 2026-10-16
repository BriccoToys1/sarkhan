import { revalidateTag } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "./data";

export function bustCache(...tags: CacheTag[]) {
  const list = tags.length > 0 ? tags : [...CACHE_TAGS];
  for (const tag of list) {
    try {
      revalidateTag(tag, "max");
    } catch {
      /* cache may be unavailable in some runtimes */
    }
  }
}
