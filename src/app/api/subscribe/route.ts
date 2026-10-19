import { prisma } from "@/lib/prisma";
import { clientIp, error, json, parseBody, rateLimit } from "@/lib/api";
import { subscribeSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!rateLimit(`subscribe:${clientIp(request)}`, 5, 60_000)) return error("Слишком много попыток, подождите минуту", 429);
  const body = await parseBody(request, subscribeSchema);
  if (!body.ok) return body.response;
  if (body.data.website) return json({ ok: true });

  await prisma.subscriber.upsert({
    where: { email: body.data.email },
    update: {
      consentPd: true,
      consentAds: true,
      source: "newsletter",
    },
    create: {
      email: body.data.email,
      source: "newsletter",
      consentPd: true,
      consentAds: true,
    },
  });
  return json({ ok: true });
}
