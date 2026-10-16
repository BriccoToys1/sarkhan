import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_JWT_AUDIENCE, ADMIN_JWT_ISSUER } from "@/lib/admin-auth-constants";

function hostname(req: NextRequest): string {
  const raw = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  return raw.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
}

function isAdminHost(host: string): boolean {
  const configured = (process.env.ADMIN_HOST || "").trim().toLowerCase();
  if (configured && host === configured) return true;
  return host.startsWith("admin.");
}

async function hasValidAdminToken(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret || secret.length < 32) return false;

  const key = new TextEncoder().encode(secret);
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
      issuer: ADMIN_JWT_ISSUER,
      audience: ADMIN_JWT_AUDIENCE,
    });
    return Boolean(payload?.adminId || payload?.email);
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = hostname(req);
  const adminHost = isAdminHost(host);
  const isLocalHost = host === "localhost" || host === "127.0.0.1";
  const isPublicAsset =
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/art") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/media") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/opengraph-image";

  if (adminHost) {
    if (pathname === "/" || pathname === "") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (
      !isPublicAsset &&
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/api")
    ) {
      return NextResponse.redirect(new URL(`/admin${pathname}`, req.url));
    }
  }

  // Hide /admin on public custom domains. Allow on localhost, admin.*, and *.vercel.app
  // (until a dedicated ADMIN_HOST subdomain is attached).
  const allowAdminOnHost =
    adminHost || isLocalHost || host.endsWith(".vercel.app") || process.env.ALLOW_ADMIN_ON_PRIMARY === "1";
  if (pathname.startsWith("/admin") && !allowAdminOnHost) {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!(await hasValidAdminToken(req))) {
      const loginUrl = new URL("/admin/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
