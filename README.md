# Bar Wise

Menú digital interactivo para bares con asistente IA que toma pedidos de forma conversacional y panel de administración con gestión en tiempo real.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| Base de datos | Supabase (PostgreSQL + Realtime + Auth) |
| Asistente IA | Claude 3 Haiku vía AWS Bedrock |
| Embeddings (RAG) | Amazon Titan Embed Text v2 |
| Imágenes | Cloudinary |
| Formularios | React Hook Form |
| Lenguaje | TypeScript 5 |

---

## Inicio rápido

```bash
git clone <repo-url>
cd bar-wise
npm install

cp .env.example .env   # completar variables (ver sección Variables de entorno)

npm run dev            # http://localhost:3000
```

> Con Docker: ver [sección Docker](#docker) al final.

---

## Scripts disponibles

```bash
npm run dev    # Dev server con Turbopack
npm run build  # Build de producción
npm run start  # Servidor de producción
npm run lint   # ESLint

npm run seed   # Inserta datos iniciales en Supabase
npm run embed  # Genera embeddings RAG de todo el catálogo
```

`seed` y `embed` leen directamente el `.env` vía `tsx --env-file`.

---

## Variables de entorno

Crear un `.env` en la raíz a partir de `.env.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=

# AWS Bedrock (Claude + embeddings)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
BEDROCK_EMBED_MODEL_ID=amazon.titan-embed-text-v2:0
```

Las variables `NEXT_PUBLIC_*` se exponen al cliente. Las demás son server-only.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              # Home — categorías del menú
│   ├── foods/                # Menú de comidas
│   ├── drinks/               # Menú de bebidas
│   ├── coctels/              # Menú de tragos
│   ├── suggestions/          # Sugerencias del chef
│   ├── review/               # Reseñas de clientes
│   ├── location/             # Mapa + dirección
│   ├── about/                # Info del bar
│   │
│   ├── admin/                # Panel admin (requiere auth)
│   │   ├── login/
│   │   ├── foods/            # CRUD catálogo
│   │   ├── suggestions/      # CRUD sugerencias
│   │   ├── comments/         # Moderación de Reseñas
│   │   └── orders/           # Pedidos en tiempo real
│   │
│   └── api/
│       ├── chat/             # POST — chat IA con tool use
│       ├── orders/           # CRUD pedidos por sesión
│       └── admin/
│           ├── orders/       # GET todos + PATCH estado
│           ├── re-embed/     # POST resincronización RAG
│           └── sync-item/    # POST sync ítem individual
│
├── components/
│   ├── chat/                 # ChatWidget flotante
│   ├── admin/                # DataTable, Modal, ImageUpload, forms
│   ├── layout/               # MainLayout, PageTransition
│   ├── toggle/               # Acordeón de platos
│   └── ...
│
├── hooks/                    # useAuth, useChat, useGetFoodsByType, ...
├── lib/
│   ├── supabase/             # Cliente, auth, ordersService, types
│   ├── api/                  # bedrock.ts (Claude + embeddings)
│   └── embedSync.ts          # syncUpsert / syncDelete
│
scripts/
└── embed.ts                  # Genera embeddings de todo el catálogo
```

---

## Arquitectura

### Chat IA y pedidos

El widget de chat usa **streaming tool use** de Claude. Cuando el cliente quiere pedir, el modelo ejecuta tools que hacen llamadas directas a la API interna:

```
Cliente → POST /api/chat
  └── Claude 3 Haiku (Bedrock)
        ├── create_order(table_number)    → POST /api/orders
        ├── add_item(title, qty, notes)   → POST /api/orders/:id/items
        ├── remove_item(item_id)          → DELETE /api/orders/:id/items/:item_id
        ├── get_my_order()                → GET /api/orders/:sessionId
        └── confirm_order()              → PATCH estado → "confirmed"
```

Antes de responder, el modelo hace una **búsqueda vectorial** (RAG) en la tabla `documents` de Supabase para inyectar contexto relevante del menú en el prompt.

### Pedidos en tiempo real

El panel de admin escucha un canal de **Supabase Realtime** sobre la tabla `orders`. Cualquier cambio (nuevo pedido, cambio de estado) se refleja en la UI sin polling.

### Sincronización de embeddings

Al crear/editar/eliminar un ítem del catálogo, `embedSync.ts` llama a Bedrock para generar el embedding y lo upserta en la tabla `documents`. Si se hacen cambios masivos, hay un endpoint `POST /api/admin/re-embed` que regenera todo el índice.

---

## Rutas de la API

### Públicas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/chat` | Turno de conversación con el asistente IA |
| `POST` | `/api/orders` | Crear pedido (`{ sessionId, tableNumber }`) |
| `GET` | `/api/orders/:sessionId` | Obtener pedido activo del cliente |
| `POST` | `/api/orders/:sessionId/items` | Agregar ítem al pedido |
| `PATCH` | `/api/orders/:sessionId/items/:itemId` | Actualizar ítem |
| `DELETE` | `/api/orders/:sessionId/items/:itemId` | Eliminar ítem |

### Admin (requieren Bearer token de Supabase)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/admin/orders` | Todos los pedidos |
| `PATCH` | `/api/admin/orders/:id/status` | Cambiar estado del pedido |
| `POST` | `/api/admin/re-embed` | Resincronizar todos los embeddings |
| `POST` | `/api/admin/sync-item` | Sincronizar un ítem puntual |

---

## Base de datos (esquema simplificado)

```sql
foods        (id, title, description, price, type, subFoodType)
suggestions  (id, title, description, imageURL, price)
orders       (id, session_id, table_number, status, notes, created_at)
order_items  (id, order_id, food_id, food_title, quantity, unit_price, notes)
comments     (id, calification, food, review, fullName, email)
documents    (id, content, embedding vector, metadata jsonb)   -- RAG index
```

Los estados válidos de `orders.status`: `pending` → `confirmed` → `in_progress` → `done` / `cancelled`.

---

## Docker

```bash
# Build y levantar
docker compose up --build

# Solo build de la imagen
docker build -t bar-wise .
```

La app corre en el puerto `3000`. Las variables de entorno se inyectan a través del archivo `.env` o directamente en `docker-compose.yml`.

> En producción reemplazar `NODE_ENV=development` por `production` y no montar el volumen de código fuente.

---

## Primer setup (base de datos nueva)

```bash
# 1. Crear las tablas en Supabase (usar el SQL editor del dashboard)
# 2. Insertar datos de ejemplo
npm run seed

# 3. Generar embeddings del catálogo inicial
npm run embed
```

Después de cualquier cambio masivo al catálogo, volver a correr `npm run embed` o usar el botón **Resincronizar** en el panel admin.

---

## Convenciones

- **Rutas admin** protegidas en dos niveles: layout del cliente (`useAuth` redirige a `/admin/login`) y middleware en servidor (`verifyAuth` en cada API route).
- **`NEXT_PUBLIC_`** solo para valores que el browser necesita. Las keys de AWS y Cloudinary API secret son siempre server-only.
- Los hooks de datos (`useGetFoodsByType`, `useGetAllSuggestions`, etc.) encapsulan toda la lógica de fetch; los componentes solo consumen el resultado.
