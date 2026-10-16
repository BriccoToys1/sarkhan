# Админка Sarkhan Grim

Один репозиторий с витриной. Панель: `/admin` (локально) или хост `admin.<domain>` / `ADMIN_HOST`.

## Вход

- Env обязателен: `JWT_SECRET` (≥32 символов).
- Логин: `ADMIN_EMAIL` + `ADMIN_PASSWORD` (env) и/или строка в таблице `Admin` (сид создаёт её при наличии env).
- `ADMIN_HOST` — hostname админки в проде (например `admin.mysticalcards.org`); иначе матчится любой `admin.*`.
- Локально: http://localhost:3000/admin/login

## Разделы

Дашборд, заказы, товары, коллекции, галерея, оракул, журнал, промокоды, подписчики, контакты, точки, медиа, настройки.

Почта-мессенджер **не подключена** (будет отдельно).

## После мутаций

Кэш витрины сбрасывается через `revalidateTag` (`products`, `collections`, `oracle`, `gallery`, `journal`, `venues`).

## Vercel Postgres

БД создаётся в Vercel → Storage (Marketplace Neon). В Neon Dashboard заходить не нужно — всё через Vercel.

Уже подключено: store **`sarkhan-db`** → env `DATABASE_URL` + `DATABASE_URL_UNPOOLED`.

На билде `scripts/migrate-deploy.mjs`:
- берёт unpooled URL;
- **пропускает** migrate, если все миграции уже в `_prisma_migrations` (нет гонок за advisory lock);
- иначе чистит зависший lock и ретраит.

Логин админки: env `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
