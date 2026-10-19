import { z } from "zod";
import { COUNTRY_CODES, isValidPostal } from "./countries";

export const POSTAL_ERROR = "Символы не соответствуют формату почтовой службы";

export const emailSchema = z.string().trim().toLowerCase().email("Проверьте адрес электронной почты").max(200);

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, "Укажите телефон в международном формате");

export const contactInfoSchema = z
  .object({
    email: emailSchema,
    phone: phoneSchema,
    name: z.string().trim().min(2, "Укажите имя получателя").max(120),
    country: z.string().refine((v) => COUNTRY_CODES.includes(v), "Выберите страну"),
    city: z.string().trim().min(2, "Укажите город").max(120),
    postalCode: z.string().trim().max(16),
    address: z.string().trim().min(5, "Укажите улицу, дом и квартиру").max(300),
  })
  .superRefine((v, ctx) => {
    if (!isValidPostal(v.country, v.postalCode)) {
      ctx.addIssue({ code: "custom", path: ["postalCode"], message: POSTAL_ERROR });
    }
  });

export type ContactInfo = z.infer<typeof contactInfoSchema>;

export const orderSchema = z.object({
  contact: contactInfoSchema,
  shippingMethod: z.enum(["STANDARD", "EXPRESS"]),
  paymentMethod: z.enum(["CARD", "CRYPTO"]),
  cryptoCurrency: z.enum(["BTC", "ETH", "SOL"]).optional(),
  promoCode: z.string().trim().toUpperCase().max(40).optional().nullable(),
  note: z.string().trim().max(1000).optional(),
  items: z
    .array(z.object({ productId: z.string().min(1).max(64), quantity: z.number().int().min(1).max(99) }))
    .min(1, "Корзина пуста")
    .max(50),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const subscribeSchema = z.object({
  email: emailSchema,
  website: z.string().max(0).optional(),
  consentPd: z.boolean().refine((v) => v === true, "Нужно согласие на обработку персональных данных"),
  consentAds: z.boolean().refine((v) => v === true, "Нужно согласие на получение рекламы"),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Представьтесь, пожалуйста").max(120),
  email: emailSchema,
  topic: z.enum(["COLLABORATION", "CUSTOM_PAINTING", "DELIVERY", "PRESS"]),
  message: z.string().trim().min(10, "Послание слишком короткое").max(5000),
  website: z.string().max(0).optional(),
});

export const promoSchema = z.object({ code: z.string().trim().toUpperCase().min(2).max(40) });

export const cartSyncSchema = z.object({ ids: z.array(z.string().min(1).max(64)).max(50) });

export const tokenSchema = z.object({ token: z.string().min(10).max(200) });
