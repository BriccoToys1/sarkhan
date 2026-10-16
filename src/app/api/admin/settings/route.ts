import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { bustCache } from "@/lib/admin-cache";
import { error, parseBody } from "@/lib/api";
import { SITE_SETTING_KEY } from "@/lib/site-config";
import { getSetting, upsertSetting } from "@/lib/site-settings";

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return error("key required", 400);
  const value = await getSetting(key);
  return NextResponse.json({ key, value });
}

const putSchema = z.object({
  key: z.string().min(1).max(120),
  value: z.string().max(500_000),
});

export async function PUT(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const body = await parseBody(req, putSchema);
  if (!body.ok) return body.response;
  await upsertSetting(body.data.key, body.data.value);
  if (body.data.key === SITE_SETTING_KEY) bustCache("site");
  return NextResponse.json({ ok: true });
}
