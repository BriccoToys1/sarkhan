-- Default order currency → RUB
ALTER TABLE "Order" ALTER COLUMN "currency" SET DEFAULT 'RUB';

-- Newsletter consent flags
ALTER TABLE "Subscriber" ADD COLUMN IF NOT EXISTS "consentPd" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Subscriber" ADD COLUMN IF NOT EXISTS "consentAds" BOOLEAN NOT NULL DEFAULT false;
