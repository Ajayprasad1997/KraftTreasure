# KraftTreasure Admin Panel

A responsive Next.js App Router admin panel starter for an ecommerce store.

## Tech stack
- Next.js 14 (JavaScript / JSX)
- React 18
- Tailwind CSS
- Lucide React
- Recharts

## Requirements
Install Node.js 18.17 or newer.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Included routes
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/products/[id]/edit`
- `/admin/orders`
- `/admin/customers`
- `/admin/users`
- `/admin/categories`
- `/admin/inventory`
- `/admin/activity`
- `/admin/coupons`
- `/admin/reviews`
- `/admin/support`
- `/admin/analytics`
- `/admin/notifications`
- `/admin/settings`
- `/login`

## Notes
- This is a functional frontend prototype using in-memory mock data. Product create/edit/delete works during the current browser session; a page refresh resets the mock state.
- Other modules show prototype data and sample interactions.
- The login page is not connected to real authentication.
- No database, payment processing, image upload service, or real API is configured.
- Before production, connect a backend, implement secure server-side authentication/authorization, validate all API requests, and persist data in a database.
- Configure `NEXT_PUBLIC_API_URL` in `.env.local` when your API is ready. Do not put secrets in `NEXT_PUBLIC_*` variables.
