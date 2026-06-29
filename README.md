# BioWood — Backend API

A NestJS REST API powering the BioWood CMS. Handles authentication, content management, file uploads via Uploadcare, and contact form submissions.

**API base URL:** `https://wood-backend-production-f38b.up.railway.app/api`

**Swagger docs:** `https://wood-backend-production-f38b.up.railway.app/api/docs`

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| NestJS 11 | Framework |
| TypeScript | Language |
| PostgreSQL (Neon) | Database |
| Prisma 7 | ORM |
| @prisma/adapter-pg | Prisma v7 database adapter |
| bcrypt | Password hashing |
| JWT | Access + refresh token auth |
| Multer | File upload handling |
| Uploadcare | Permanent cloud file storage |
| Swagger / OpenAPI | API documentation |
| class-validator | Request DTO validation |
| Railway | Deployment |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (local or [Neon](https://neon.tech) hosted)
- npm

### Installation

```bash
git clone https://github.com/laraRifaii/wood-backend.git
cd wood-backend
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

Fill in all values — see [Environment Variables](#environment-variables) below.

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### Build & Seed

```bash
# Build the project
npm run build

# Seed default content + admin user
node dist/prisma/seed.js
```

Default admin credentials after seeding:
- **Email:** `admin@biowood.com`
- **Password:** `Admin123!`

### Run Development Server

```bash
npm run start:dev
```

- API: [http://localhost:3001/api](http://localhost:3001/api)
- Swagger: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for signing access tokens |
| `JWT_EXPIRES_IN` | ✅ | Access token TTL (e.g. `15m`) |
| `JWT_REFRESH_SECRET` | ✅ | Secret key for signing refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | Refresh token TTL (e.g. `7d`) |
| `UPLOADCARE_PUBLIC_KEY` | ✅ | Uploadcare public key for file uploads |
| `UPLOADCARE_SECRET_KEY` | ✅ | Uploadcare secret key for file uploads |
| `PORT` | ❌ | Server port — defaults to `3001` |

> See `.env.example` for the exact format.

Generate secure JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> Run this command twice — once for `JWT_SECRET` and once for `JWT_REFRESH_SECRET`.

---

## Database Setup

### Using Neon (recommended — free hosted PostgreSQL)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the **Connection string** from the Dashboard
4. Paste into `DATABASE_URL` in `.env`

### Prisma v7 Configuration

Prisma v7 requires a database adapter — the connection URL is configured in `prisma.config.ts`, not `schema.prisma`:

**`prisma/schema.prisma`**
```prisma
datasource db {
  provider = "postgresql"
  // No url here — configured via prisma.config.ts
}
```

**`prisma.config.ts`**
```typescript
export default defineConfig({
  datasource: { url: process.env.DATABASE_URL! },
});
```

**`src/prisma/prisma.service.ts`**
```typescript
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
super({ adapter });
```

### Useful Prisma Commands

```bash
# Generate client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_change

# Apply migrations in production
npx prisma migrate deploy

# View data in browser UI
npx prisma studio

# Reset database (caution — drops all data)
npx prisma migrate reset
```

### Seeding

The seed file runs from compiled JavaScript — always build first:

```bash
npm run build
node dist/prisma/seed.js
```

> **Why compiled JS?** On Railway, `ts-node` fails to resolve TypeScript modules. Running from `dist/` avoids this issue entirely.

---

## Architecture Overview

```
src/
├── main.ts                        # Entry — Swagger, CORS, ValidationPipe
├── app.module.ts                  # Root module
│
├── prisma/
│   ├── prisma.service.ts          # PrismaClient with PrismaPg adapter
│   └── prisma.module.ts           # Global module
│
├── auth/
│   ├── auth.service.ts            # Login, logout, token generation, refresh rotation
│   ├── auth.controller.ts         # /auth/login · /auth/refresh · /auth/logout
│   ├── auth.dto.ts
│   ├── jwt.strategy.ts            # Validates Bearer access tokens
│   └── jwt-refresh.strategy.ts   # Validates refresh tokens + checks DB hash
│
├── common/
│   ├── upload.service.ts          # Uploadcare integration
│   ├── cloudinary.ts              # (reserved)
│   └── guards/
│       └── jwt-auth.guard.ts      # Protects admin endpoints
│
├── hero/                          # GET · PATCH · POST /upload
├── wood-types/                    # Full CRUD + image upload + reorder
├── services/                      # Full CRUD + image upload
├── gallery/                       # Upload · reorder · update · delete
├── about/                         # GET · PATCH · POST /upload
├── advantages/                    # GET · PATCH · POST /upload
└── contact/                       # POST (public) · GET · DELETE (admin)
```

### Authentication Architecture

```
POST /auth/login
  → bcrypt.compare(password, stored hash)
  → sign accessToken  (JWT, 15min)
  → sign refreshToken (JWT, 7 days)
  → bcrypt.hash(refreshToken) → stored in User.refreshToken
  → return { accessToken, refreshToken, user }

POST /auth/refresh
  → validate refresh token signature
  → bcrypt.compare(token, User.refreshToken) — prevents token reuse
  → issue new accessToken + new refreshToken (rotation)
  → update User.refreshToken hash in DB

POST /auth/logout
  → User.refreshToken = null
```

---

## API Reference

Full interactive documentation available at `/api/docs`.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login → returns tokens + user |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | JWT | Logout + invalidate refresh token |

### Hero

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/hero` | Public | Get hero content |
| PATCH | `/api/hero` | JWT | Update hero fields |
| POST | `/api/hero/upload` | JWT | Upload image → `{ url }` |

### Wood Types

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wood-types` | Public | Get all with images |
| GET | `/api/wood-types/:id` | Public | Get single |
| POST | `/api/wood-types` | JWT | Create |
| PATCH | `/api/wood-types/:id` | JWT | Update |
| DELETE | `/api/wood-types/:id` | JWT | Delete + cascade images |
| POST | `/api/wood-types/:id/images` | JWT | Upload image |
| PATCH | `/api/wood-types/:id/images/reorder` | JWT | Reorder images |
| DELETE | `/api/wood-types/images/:imageId` | JWT | Delete image |

### Services

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/services` | Public | Get all |
| POST | `/api/services` | JWT | Create |
| PATCH | `/api/services/:id` | JWT | Update |
| DELETE | `/api/services/:id` | JWT | Delete |
| POST | `/api/services/upload` | JWT | Upload image |

### Gallery

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/gallery` | Public | Get all ordered images |
| POST | `/api/gallery/upload` | JWT | Upload image |
| PATCH | `/api/gallery/reorder` | JWT | Reorder `{ items: [{id, order}] }` |
| PATCH | `/api/gallery/:id` | JWT | Update alt/category |
| DELETE | `/api/gallery/:id` | JWT | Delete |

### About

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/about` | Public | Get content |
| PATCH | `/api/about` | JWT | Update |
| POST | `/api/about/upload` | JWT | Upload image |

### Advantages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/advantages` | Public | Get with items |
| PATCH | `/api/advantages` | JWT | Update (replaces items array) |
| POST | `/api/advantages/upload` | JWT | Upload image |

### Contact

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | Public | Submit form |
| GET | `/api/contact` | JWT | Get all messages |
| DELETE | `/api/contact/:id` | JWT | Delete message |

---

## File Uploads

All file uploads are stored permanently on **Uploadcare CDN** — not on Railway's ephemeral filesystem.

```
Admin uploads file
    ↓
Multer (memoryStorage) → file.buffer
    ↓
UploadService.uploadImage()
    ↓
Uploadcare API → permanent CDN URL
    ↓
URL stored in PostgreSQL
    ↓
Frontend renders https://ucarecdn.com/uuid/
```

---

## Deployment (Railway)

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add all environment variables in Railway dashboard
4. Update `package.json` scripts:

```json
"build": "prisma generate && nest build",
"start": "npx prisma migrate deploy && node dist/src/main"
```

5. After first deploy, run in Railway shell:

```bash
npm run build
node dist/prisma/seed.js
```

### CORS Configuration

Update `src/main.ts` with your Vercel frontend URL:

```typescript
app.enableCors({
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:3000',
    /^https:\/\/.*\.vercel\.app$/,
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

---

## AI Tools Used

| Tool | Usage |
|------|-------|
| Claude (Anthropic) | NestJS scaffolding, Prisma v7 adapter setup, JWT auth with refresh rotation, Uploadcare integration, Railway deployment debugging, seed fixes, CORS config |
| GitHub Copilot | Inline code completion |

> All code was reviewed and understood before use. AI tools accelerated boilerplate implementation while architectural decisions were made by the developer.

---

## Time Spent

| Area | Hours |
|------|-------|
| Project setup + TypeScript config | 2h |
| Prisma v7 setup (adapter, config, schema) | 3h |
| Auth module (JWT, bcrypt, refresh rotation) | 4h |
| Content modules (hero, wood-types, services, gallery, about, advantages, contact) | 10h |
| File upload (Multer + Uploadcare) | 2h |
| Swagger documentation | 1h |
| Seed file | 2h |
| Railway deployment + debugging | 3h |
| Documentation | 2h |
| **Total** | **~29h** |