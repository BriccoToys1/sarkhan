import { NextRequest, NextResponse } from "next/server";
import { mkdir, readdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { adminGuard } from "@/lib/admin-auth";
import { error } from "@/lib/api";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/ogg",
]);

async function ensureDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  await ensureDir();
  try {
    const files = await readdir(UPLOAD_DIR);
    const items = await Promise.all(
      files.map(async (name) => {
        const full = path.join(UPLOAD_DIR, name);
        const s = await stat(full);
        return {
          name,
          url: `/uploads/${name}`,
          size: s.size,
          mtime: s.mtime.toISOString(),
        };
      }),
    );
    items.sort((a, b) => (a.mtime < b.mtime ? 1 : -1));
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  await ensureDir();

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return error("Файл не передан", 400);
  if (!ALLOWED.has(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|gif|svg|mp3|wav|ogg|m4a)$/i)) {
    return error("Тип файла не поддерживается", 400);
  }
  if (file.size > 25 * 1024 * 1024) return error("Максимум 25 МБ", 400);

  const safe = file.name.replace(/[^\w.\-]+/g, "_").slice(-80);
  const name = `${Date.now()}-${safe}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, name), buf);
  return NextResponse.json({ url: `/uploads/${name}`, name, size: buf.length }, { status: 201 });
}
