import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { clientIp, error, parseBody, rateLimit } from "@/lib/api";
import { setAdminSessionCookie, signAdminToken } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { SESSIONS_SETTING_KEY } from "@/lib/site-config";
import { upsertSetting, getSetting } from "@/lib/site-settings";

const schema = z.object({
  email: z.string().min(1).max(200),
  password: z.string().min(1).max(200),
});

async function recordSession(req: NextRequest, email: string, name: string) {
  const entry = {
    at: new Date().toISOString(),
    email,
    name,
    ip: clientIp(req),
    userAgent: req.headers.get("user-agent") || "",
  };
  try {
    const current = await getSetting(SESSIONS_SETTING_KEY);
    let list: typeof entry[] = [];
    try {
      const parsed = JSON.parse(current || "[]");
      if (Array.isArray(parsed)) list = parsed as typeof entry[];
    } catch {
      list = [];
    }
    await upsertSetting(SESSIONS_SETTING_KEY, JSON.stringify([entry, ...list].slice(0, 100)));
  } catch (e) {
    console.error("Failed to record admin session", e);
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!rateLimit(`admin-login:${ip}`, 10, 15 * 60_000)) {
    return error("Слишком много попыток. Попробуйте позже.", 429);
  }

  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;

  const email = body.data.email.trim().toLowerCase();
  const password = body.data.password;

  const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD || "";
  const envHash = process.env.ADMIN_PASSWORD_HASH || "";

  let adminId = "env-admin";
  let name = "Admin";
  let ok = false;

  if (envEmail && email === envEmail) {
    if (envHash) {
      ok = await bcrypt.compare(password, envHash);
    } else if (envPassword) {
      ok = password === envPassword;
    }
  }

  if (!ok) {
    const admin = await prisma.admin.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (admin) {
      ok = await bcrypt.compare(password, admin.password);
      if (ok) {
        adminId = admin.id;
        name = admin.name;
      }
    }
  }

  if (!ok) {
    return error("Неверный логин или пароль", 401);
  }

  const token = await signAdminToken({ adminId, email, name });
  if (!token) {
    return error("JWT_SECRET не настроен (мин. 32 символа)", 500);
  }

  await recordSession(req, email, name);

  const out = NextResponse.json({ authenticated: true, token, admin: { email, name } });
  setAdminSessionCookie(out, token);
  return out;
}
