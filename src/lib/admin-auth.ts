import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { ADMIN_JWT_AUDIENCE, ADMIN_JWT_ISSUER, ADMIN_SESSION_MAX_AGE } from "./admin-auth-constants";

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  name: string;
}

function getSecretKey(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: AdminTokenPayload): Promise<string | null> {
  const key = getSecretKey();
  if (!key) return null;
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ADMIN_JWT_ISSUER)
    .setAudience(ADMIN_JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE}s`)
    .setJti(crypto.randomUUID())
    .sign(key);
}

async function verifyToken(token: string): Promise<AdminTokenPayload | null> {
  const key = getSecretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
      issuer: ADMIN_JWT_ISSUER,
      audience: ADMIN_JWT_AUDIENCE,
    });
    const adminId = typeof payload.adminId === "string" ? payload.adminId : "";
    const email = typeof payload.email === "string" ? payload.email : "";
    const name = typeof payload.name === "string" ? payload.name : "Admin";
    if (!adminId || !email) return null;
    return { adminId, email, name };
  } catch {
    return null;
  }
}

export async function verifyAdminToken(req: NextRequest): Promise<AdminTokenPayload | null> {
  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const cookie = req.cookies.get("admin_token")?.value || "";
  for (const token of [bearer, cookie]) {
    if (!token || token === "cookie-session") continue;
    const payload = await verifyToken(token);
    if (payload) return payload;
  }
  return null;
}

export async function adminGuard(req: NextRequest): Promise<NextResponse | null> {
  const admin = await verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (origin && host) {
      try {
        if (new URL(origin).host !== host) {
          return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
      }
    }
  }
  return null;
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}
