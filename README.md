# Memvoro

Leaderboard pay-to-rank para proyectos de memecoin. El proyecto que más paga
acumulado, ocupa el #1. Next.js + Stripe + Supabase.

## 1. Crear el proyecto en Supabase (gratis)

1. Crea una cuenta en https://supabase.com y un nuevo proyecto.
2. Ve a **SQL Editor**, pega el contenido de `supabase.sql` (incluido en
   este repo) y ejecútalo. Esto crea la tabla `projects` con 3 proyectos
   de ejemplo.
3. Ve a **Settings → API** y copia:
   - `Project URL` → será tu `SUPABASE_URL`
   - `service_role` key (no la `anon` key) → será tu
     `SUPABASE_SERVICE_ROLE_KEY`

## 2. Configurar Stripe (modo test)

1. Crea una cuenta en https://dashboard.stripe.com si no tienes una.
2. En **Developers → API keys**, copia la "Secret key" (`sk_test_...`).
3. Para probar el webhook en local, instala la Stripe CLI
   (https://stripe.com/docs/stripe-cli) y corre:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   Esto te da un `whsec_...` para pruebas locales.

## 3. Correr en local

```bash
npm install
cp .env.example .env.local   # y rellena las 4 variables de arriba
npm run dev
```

Abre http://localhost:3000. Pulsa "Enter the arena" o "Outbid", paga con
la tarjeta de prueba `4242 4242 4242 4242` (CVC y fecha cualquiera), y el
leaderboard se actualiza solo — vía el webhook, nunca al cerrar el modal.

## 4. Desplegar en Vercel (producción)

1. Sube este proyecto a un repo de GitHub.
2. Ve a https://vercel.com, conecta tu cuenta de GitHub e importa el repo.
   Vercel detecta Next.js automáticamente, no hay que tocar nada de build.
3. En **Settings → Environment Variables** de Vercel, añade las mismas 4
   variables de `.env.local` (con la `APP_URL` apuntando a tu dominio real
   de Vercel, ej. `https://memvoro.vercel.app`).
4. Haz deploy.
5. En el dashboard de Stripe, ve a **Developers → Webhooks → Add endpoint**,
   apunta a `https://tu-dominio.vercel.app/api/webhook`, y selecciona el
   evento `checkout.session.completed`. Copia el "Signing secret" y
   actualiza `STRIPE_WEBHOOK_SECRET` en Vercel (ahora será uno distinto al
   de `stripe listen`).
6. Redeploy para que tome la variable nueva.
7. Cuando quieras cobrar de verdad: en Stripe activa el modo Live y
   sustituye `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` por las claves
   `sk_live_...` / el webhook en modo live.

## Estructura

```
app/
  page.js                   → carga el leaderboard (dinámico, sin caché)
  components/Home.jsx        → hero + leaderboard + estado del modal
  components/BidModal.jsx    → formulario de puja → crea Checkout Session
  components/Crown.jsx       → ícono
  api/checkout/route.js      → crea la sesión de pago en Stripe
  api/webhook/route.js       → confirma el pago y actualiza el ranking
lib/
  store.js                   → capa de datos (habla con Supabase)
  supabase.js                → cliente de Supabase (service role, server-only)
  stripe.js                  → cliente de Stripe
supabase.sql                 → esquema de la tabla + datos de ejemplo
```

## Roadmap sugerido

- **Fase 2 — pagos cripto:** añadir una opción de pago on-chain (ej. USDC en
  Base vía wallet connect) como alternativa a Stripe. Requiere decidir
  cadena/wallet y un servicio que verifique la transacción antes de llamar
  a `applyPaidBid`.
- **Panel de moderación:** vista simple para editar/quitar proyectos sin
  entrar a Supabase a mano.
- **Anti-fraude básico:** límite de pujas por IP/tiempo, revisión manual de
  proyectos nuevos antes de publicarlos.
- **Concurrencia:** `applyPaidBid` hace lectura-luego-escritura, así que dos
  pagos simultáneos sobre el mismo proyecto podrían pisarse. A bajo volumen
  no es problema; si escala, mover el incremento a una función SQL
  (`increment_bid`) que sume de forma atómica en la base de datos.
