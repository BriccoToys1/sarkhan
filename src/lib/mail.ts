import nodemailer from "nodemailer";
import { formatPrice } from "./format";
import { SITE } from "./site";

let transport: ReturnType<typeof nodemailer.createTransport> | null | undefined;

function getTransport() {
  if (transport !== undefined) return transport;
  const host = process.env.SMTP_HOST;
  transport = host
    ? nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT ?? 465),
        secure: (process.env.SMTP_SECURE ?? "true") !== "false",
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
      })
    : null;
  return transport;
}

async function send(to: string, subject: string, html: string) {
  const t = getTransport();
  if (!t) return;
  try {
    await t.sendMail({ from: process.env.MAIL_FROM ?? `Sarkhan Grim <${SITE.email}>`, to, subject, html });
  } catch (e) {
    console.error("[mail]", e);
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

const layout = (title: string, body: string) => `<!doctype html><html><body style="margin:0;background:#0b0b0c;color:#f5f2eb;font-family:Georgia,serif">
<div style="max-width:560px;margin:0 auto;padding:40px 28px">
<div style="letter-spacing:6px;color:#c5a880;font-size:13px;text-align:center">SARKHAN GRIM</div>
<h1 style="font-weight:normal;color:#c5a880;text-align:center;font-size:26px;margin:24px 0">${title}</h1>
${body}
<p style="color:#8e8e93;font-size:12px;text-align:center;margin-top:40px">${esc(SITE.address)} · ${SITE.email}</p>
</div></body></html>`;

type MailOrder = {
  number: number;
  email: string;
  name: string;
  total: number;
  blessing: string;
  items: { title: string; quantity: number; price: number }[];
  accessToken: string;
  id: string;
};

export async function sendOrderPaidEmail(order: MailOrder) {
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;color:#f5f2eb">${esc(i.title)} × ${i.quantity}</td><td style="text-align:right;color:#c5a880">${formatPrice(i.price * i.quantity)}</td></tr>`,
    )
    .join("");
  const link = `${SITE.url}/checkout/success?order=${order.id}&token=${order.accessToken}`;
  await send(
    order.email,
    `Заказ #${order.number} оплачен — связь с бездной установлена`,
    layout(
      "Ваша связь с бездной установлена",
      `<p style="line-height:1.6">${esc(order.name)}, Сархан Грим начал подготовку ваших артефактов. Мы пришлём манускрипт отправки с трек-номером, как только посылка покинет мастерскую.</p>
<table style="width:100%;border-top:1px solid #33302a;border-bottom:1px solid #33302a;margin:24px 0;padding:8px 0">${rows}
<tr><td style="padding-top:10px">Итого</td><td style="text-align:right;color:#c5a880;padding-top:10px">${formatPrice(order.total)}</td></tr></table>
<p style="font-style:italic;color:#c5a880;text-align:center">«${esc(order.blessing)}»</p>
<p style="text-align:center;margin-top:28px"><a href="${link}" style="color:#0b0b0c;background:#c5a880;padding:12px 22px;text-decoration:none;letter-spacing:2px;font-size:12px">ЦИФРОВОЙ ЧЕК</a></p>`,
    ),
  );
  const admin = process.env.ADMIN_EMAIL;
  if (admin) await send(admin, `Новый оплаченный заказ #${order.number}`, layout(`Заказ #${order.number}`, `<p>${esc(order.name)} · ${esc(order.email)} · ${formatPrice(order.total)}</p>`));
}

export async function sendContactNotification(msg: { name: string; email: string; topic: string; message: string }) {
  const admin = process.env.ADMIN_EMAIL;
  if (!admin) return;
  await send(
    admin,
    `Письмо в бездну: ${msg.topic}`,
    layout("Новое послание", `<p><b>${esc(msg.name)}</b> &lt;${esc(msg.email)}&gt;</p><p style="white-space:pre-wrap;line-height:1.6">${esc(msg.message)}</p>`),
  );
}
