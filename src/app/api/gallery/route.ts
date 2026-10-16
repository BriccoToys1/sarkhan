import type { NextRequest } from "next/server";
import { json } from "@/lib/api";
import { getArtworkPage } from "@/lib/data";

export async function GET(request: NextRequest) {
  const cursor = Math.max(0, Number.parseInt(request.nextUrl.searchParams.get("cursor") ?? "0", 10) || 0);
  return json(await getArtworkPage(cursor));
}
