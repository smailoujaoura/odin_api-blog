# Blog API

A full-stack Odin Project project focused on REST API design, JWT-based authentication, role-based authorization, and the practical realities of shipping a small but complete blogging platform.

![Animated demo of the public blog client](./docs/preview.gif)

## Live Demo

| Surface | URL | Purpose |
| --- | --- | --- |
| Public blog | [blog-api-frontend-topaz.vercel.app](https://blog-api-frontend-topaz.vercel.app/) | Read posts, sign up, log in, and join discussions |
| Admin portal | [blog-api-amber-theta.vercel.app](https://blog-api-amber-theta.vercel.app/) | Admin-only publishing, editing, and post management |

## Why This Project Exists

This project grew out of the Odin curriculum with a clear emphasis on:

- API design fundamentals
- REST-style routing
- JWT security
- clean controller/router separation
- centralized error handling
- shipping the MVP first before heavier infrastructure work

That original goal still shows in the current codebase: there is a public reader app, a separate admin authoring app, and an Express API sitting in the middle with Prisma/PostgreSQL underneath.

## Snapshot

![Public feed screenshot](./docs/home.png)

## Architecture

```mermaid
flowchart LR
    Reader[Reader] --> PublicUI[Public React client]
    Admin[Admin] --> AdminUI[Admin React client]

    PublicUI -->|Axios + credentials| API[Express API]
    AdminUI -->|Axios + credentials + x-admin-portal| API

    API --> Auth[JWT cookie auth]
    API --> Guards[authGuard and adminGuard]
    API --> Validation[Zod body validation]
    API --> Errors[Centralized error middleware]
    API --> Prisma[Prisma ORM]
    Prisma --> DB[(PostgreSQL)]
```

## Security And Publish Flow

```mermaid
sequenceDiagram
    participant AdminUI as Admin UI
    participant API as Express API
    participant DB as PostgreSQL

    AdminUI->>API: POST /login + x-admin-portal: true
    API->>DB: find user by email
    API->>API: compare password, verify admin role
    API-->>AdminUI: httpOnly JWT cookie

    AdminUI->>API: POST /posts
    API->>API: authGuard
    API->>API: adminGuard
    API->>DB: create post
    API-->>AdminUI: 201 Created
```

## Data Model

```mermaid
erDiagram
    USER ||--o{ POST : writes
    USER ||--o{ COMMENT : leaves
    POST ||--o{ COMMENT : receives

    USER {
        int id
        string name
        string email
        string password
        Role role
    }

    POST {
        int id
        string title
        string content
        datetime createdAt
        boolean published
        int userId
    }

    COMMENT {
        int id
        string content
        datetime createdAt
        boolean approved
        int postId
        int userId
    }
```

## Features

- Public blog client for browsing posts and opening full post pages
- User sign-up and login flows
- Comment creation for authenticated users
- Comment deletion for owners and admins
- Separate admin portal for protected publishing workflows
- Admin-only create, edit, publish toggle, and delete actions for posts
- Markdown authoring with live preview in the admin editor
- Cookie-based authentication with JWT stored as `httpOnly` cookies
- Role-aware access control through middleware guards
- Validation and API error handling designed around reusable middleware

## Project Structure

```text
.
├── backend/         # Express 5 + Prisma + PostgreSQL API
├── frontend/        # Public React reader client
├── frontend-admin/  # Admin React publishing client
└── docs/            # README media assets
```

## API Surface

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/login` | Public | Log in and issue JWT cookie |
| `POST` | `/api/signup` | Public | Create a user or admin account |
| `POST` | `/api/logout` | Authenticated | Clear session cookie |
| `GET` | `/api/me` | Authenticated | Restore current user session |
| `GET` | `/api/posts` | Public | List posts |
| `GET` | `/api/posts/:id` | Public | Fetch a single post |
| `POST` | `/api/posts` | Admin | Create a post |
| `PATCH` | `/api/posts/:id` | Admin | Update post content or publish state |
| `DELETE` | `/api/posts/:id` | Admin | Delete a post |
| `GET` | `/api/posts/:id/comments` | Public | Read comments for a post |
| `POST` | `/api/posts/:id/comments` | Authenticated | Add a comment |
| `DELETE` | `/api/posts/:id/comments/:commentId` | Authenticated | Delete own comment or moderate as admin |

## Representative Code

### 1. Reusable request validation

This middleware keeps controllers focused on business logic while surfacing readable validation errors to the client.

```ts
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new CustomError(Errors.INVALID_ENTITY, errorMessages);
    }

    req.body = parsed.data;
    next();
  };
};
```

### 2. Markdown-first authoring experience

The admin interface treats content like writing, not form-filling: raw markdown on one side and rendered preview on the other.

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[60vh]">
  <textarea
    placeholder="Write your markdown here..."
    value={content}
    onChange={(e) => setContent(e.target.value)}
    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8"
  />

  <div className="prose prose-invert prose-sky max-w-none bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 overflow-auto">
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
</div>
```

## What I Learned

- How to split a full-stack project into clean layers: routes, controllers, middleware, client state, and persistence
- The difference between authentication and authorization in real code, not just in theory
- Why JWT storage strategy matters, especially when cookies, CORS, and multiple frontends are involved
- How Prisma migrations help turn evolving ideas into an explicit database history
- How much cleaner an API feels when validation and error handling are centralized instead of repeated everywhere
- That markdown support adds a lot of value to a blog authoring workflow with relatively little UI complexity
- That shipping the MVP first is often the best way to discover the real hard problems before investing in infra polish

## Difficulties And Tradeoffs

- Cross-origin authentication is the hardest part of this project technically. Cookies, `credentials: true`, CORS allowlists, and `sameSite`/`secure` behavior all have to line up.
- Managing two clients is productive academically because it exposes role boundaries clearly, but it also increases duplication and deployment overhead.
- The admin workflow is intentionally lightweight, which helped finish the project, but it leaves room for richer moderation, drafts, previews, and editorial tooling.
- Public and admin behavior are close enough to share ideas, but different enough that over-abstracting too early would have hurt readability.
- Deployment is real software design pressure here: local development is easy to imagine, but production auth behavior forces much more careful thinking.

## Optimizations And Good Decisions

- `Promise.all` is used in post pages to fetch the article and its comments concurrently.
- UI state is updated locally after writes like comment creation, comment deletion, publish toggles, and post deletion instead of always refetching everything.
- Prisma `select`/`include` usage keeps responses focused and avoids sending sensitive fields like passwords back to the client.
- Zustand keeps auth state simple and lightweight without introducing unnecessary complexity.
- Pino logging plus a centralized error middleware make debugging cleaner than scattering `console.log` calls across the stack.
- The README demo media was optimized from `docs/preview.webm` into a palette-based GIF that stays lightweight enough to render well on GitHub.

## Academic Value

This project has strong academic value because it combines several core web engineering ideas in one coherent system:

- REST route design and controller responsibility
- schema validation and defensive programming
- database modeling and migrations
- authentication versus authorization
- client/server separation of concerns
- deployment constraints such as CORS and secure cookies
- translating backend state into readable UI feedback

In other words, it is not just "a blog app". It is a compact lab for learning how modern full-stack applications behave across the network boundary.

## Local Setup

### 1. Create the backend environment file at the repo root

The backend dev script reads `../.env`, so the file should live in the root of this repository.

```bash
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/blog_api
JWT_SECRET=replace-me
NODE_ENV=development
ADMIN_KEY=replace-me
ORIGIN_ONE=http://localhost:5173
ORIGIN_TWO=http://localhost:5174
```

### 2. Optional frontend environment files

Both frontends default to `http://localhost:3000`, but explicit env files are still a good idea.

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000

# frontend-admin/.env
VITE_API_URL=http://localhost:3000
```

### 3. Install dependencies and start each app

```bash
# terminal 1
cd backend
npm install
npx prisma migrate dev
npm run dev
```

```bash
# terminal 2
cd frontend
npm install
npm run dev
```

```bash
# terminal 3
cd frontend-admin
npm install
npm run dev
```

## Demo Asset Generation

The animated README preview was generated from the recorded demo in `docs/preview.webm` with `ffmpeg`:

```bash
ffmpeg -y -i docs/preview.webm -vf "fps=8,scale=960:-1:flags=lanczos,palettegen=stats_mode=diff" /tmp/preview-palette.png
ffmpeg -y -i docs/preview.webm -i /tmp/preview-palette.png -filter_complex "fps=8,scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" -loop 0 docs/preview.gif
```

## Next Steps

- Filter unpublished posts out of the public API response
- Add automated tests for auth, posts, and comments
- Improve admin moderation workflows
- Add pagination, search, and richer post metadata
- Move hardcoded origin values fully into environment-based configuration
- Revisit containerization and reverse-proxy setup once the core product surface is stable
