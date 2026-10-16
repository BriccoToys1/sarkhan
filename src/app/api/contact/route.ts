import { prisma } from "@/lib/prisma";
import { clientIp, error, json, parseBody, rateLimit } from "@/lib/api";
import { CONTACT_TOPICS } from "@/lib/labels";
import { sendContactNotification } from "@/lib/mail";
import { contactMessageSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!rateLimit(`contact:${clientIp(request)}`, 4, 10 * 60_000)) return error("Слишком много посланий, попробуйте позже", 429);
  const body = await parseBody(request, contactMessageSchema);
  if (!body.ok) return body.response;
  const { website, ...data } = body.data;
  if (website) return json({ ok: true });

  await prisma.contactMessage.create({ data });
  await sendContactNotification({ ...data, topic: CONTACT_TOPICS[data.topic] });
  return json({ ok: true });
}
