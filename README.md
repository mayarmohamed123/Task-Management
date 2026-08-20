# TaskFlow — Modern Full-Stack Task Management Web Application

TaskFlow is a production-ready, full-stack **Task Management Application** built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) with strict **TypeScript**, **Tailwind CSS**, **TanStack Query**, **React Hook Form**, **Zod**, **JWT Authentication**, and **bcrypt**.

Designed to match professional SaaS standards, TaskFlow provides an intuitive dashboard for users to organize, filter, search, track, and manage their daily task workflow with clean data isolation and real-time responsiveness.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication & Security Architecture](#authentication--security-architecture)
- [Testing](#testing)
- [AI Usage Disclosure](#ai-usage-disclosure)
- [Time Spent](#time-spent)

---

## Features

### Authentication & Authorization
- **User Registration**: Secure account creation with normalized, unique email validation and bcrypt password hashing.
- **User Login**: JWT issue on password verification with sanitized profile payload.
- **Current User Context**: Re-authentication on application reload via `/api/auth/me`.
- **Strict Data Isolation**: Backend enforces that every database query is scoped exclusively to `req.user.id`. A user can **never** view, edit, or delete another user's task.

### Task Management (CRUD)
- **Create Task**: Interactive modal dialog powered by React Hook Form + Zod schema validation (Title, Description, Status, Priority, Due Date).
- **Read Tasks**: Task grid with color-coded status badges, priority pill tags, and relative due date indicators ("Due in 2 days", "Overdue").
- **Update Task**: Pre-filled edit modal with instantaneous UI sync.
- **Delete Task**: Confirmation modal with non-blocking disabled state during server deletion.

### Search & Filtering
- **Debounced Title Search**: Search bar with 300ms debounce to minimize unnecessary network requests.
- **Status Filter**: Shortcuts for *All Tasks*, *To Do*, *In Progress*, *Done*.
- **Priority Filter**: Dropdown filter for *Low*, *Medium*, *High* priority.
- **Combined Filtering**: Search, status, and priority work seamlessly together on the backend.

### UX & Responsive Design
- **Dynamic Statistics**: Cards displaying live counts for *Total Tasks*, *To Do*, *In Progress*, *Completed* calculated directly from the authenticated user's database records.
- **Skeletal Loaders & Empty States**: Polished loading animations and distinct empty state graphics (No tasks created vs No search results found).
- **Responsive Layout**: Designed for mobile drawer navigation (320px) up to ultra-wide desktop displays (1440px+).

---

## Tech Stack

### Frontend (`client/`)
- **Framework**: React 18 + Vite + TypeScript
- **Routing**: React Router v6 (`react-router-dom`)
- **Server State**: TanStack Query v5 (`@tanstack/react-query`)
- **Form Management**: React Hook Form (`react-hook-form`) + Zod (`zod`)
- **Styling**: Tailwind CSS + Plus Jakarta Sans Typography
- **Icons**: Lucide React (`lucide-react`)
- **HTTP Client**: Axios with centralized interceptors

### Backend (`server/`)
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: MongoDB + Mongoose ORM
- **Authentication**: JSON Web Token (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Validation**: Zod (`zod`)
- **Security**: Helmet, CORS, Dotenv
- **Testing**: Vitest + Supertest

---

## Project Structure

```text
taskflow/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/           # Button, Input, Select, Textarea, Modal, Badge, Toast, Skeleton
│   │   ├── features/
│   │   │   ├── auth/         # Auth API, hooks, schemas
│   │   │   └── tasks/        # Task API, query hooks, TaskCard, TaskStats, TaskFilters, TaskFormModal
│   │   ├── pages/            # LoginPage, RegisterPage, DashboardPage, NotFoundPage
│   │   ├── layouts/          # DashboardLayout (Sidebar, Header)
│   │   ├── hooks/            # useDebounce, custom UI hooks
│   │   ├── lib/              # Axios instance (api.ts), queryClient.ts
│   │   ├── store/            # AuthContext.tsx
│   │   ├── types/            # TypeScript interfaces (User, Task, Stats, API)
│   │   ├── utils/            # Date formatters, cn helper
│   │   ├── App.tsx           # Router & QueryClient Provider setup
│   │   └── main.tsx          # Client entrypoint
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/
│   ├── src/
│   │   ├── config/           # Database & env configurations
│   │   ├── controllers/      # authController.ts, taskController.ts
│   │   ├── middleware/       # authMiddleware.ts, validate.ts, errorHandler.ts
│   │   ├── models/           # User.ts, Task.ts (Mongoose schemas & indexes)
│   │   ├── routes/           # authRoutes.ts, taskRoutes.ts
│   │   ├── services/         # authService.ts, taskService.ts
│   │   ├── validations/      # Zod validation schemas
│   │   ├── types/            # Express custom types (req.user)
│   │   ├── utils/            # AppError, asyncHandler, jwt, seed.ts
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server entrypoint
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .gitignore
├── README.md
└── .env.example
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v22 tested)
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` or MongoDB Atlas URI
- **npm**: 9.0.0 or higher

---

## Installation & Setup

### 1. Clone & Setup Workspace

```bash
git clone <repository-url>
cd taskflow
```

### 2. Configure Environment Variables

Create `.env` in both `server/` and root:

**Server (`server/.env`)**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=super-secret-jwt-key-taskflow-2026-secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Install & Start Backend

```bash
cd server
npm install
npm run seed     # Optional: Populates sample test user & tasks
npm run dev      # Starts Express dev server on http://localhost:5000
```

### 4. Install & Start Frontend Client

In a separate terminal window:

```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

Access the application in your browser at `http://localhost:5173`.

---

## API Documentation

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth Required | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new user | `{ "name": "John", "email": "john@example.com", "password": "Password123" }` |
| `POST` | `/api/auth/login` | No | Authenticate user & issue JWT | `{ "email": "john@example.com", "password": "Password123" }` |
| `GET` | `/api/auth/me` | Yes | Get currently logged-in user | Header: `Authorization: Bearer <token>` |

### Task Routes (`/api/tasks`)

| Method | Endpoint | Auth Required | Query / Body Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Yes | `?search=title&status=IN_PROGRESS&priority=HIGH` | Fetch all tasks belonging to authenticated user |
| `GET` | `/api/tasks/:id` | Yes | `params.id` | Fetch single task by ID |
| `POST` | `/api/tasks` | Yes | `{ "title": "Task", "description": "...", "status": "TODO", "priority": "HIGH", "dueDate": "2026-08-30" }` | Create new task |
| `PATCH` | `/api/tasks/:id` | Yes | `{ "status": "DONE" }` | Update existing task |
| `DELETE` | `/api/tasks/:id` | Yes | `params.id` | Delete task by ID |

---

## Authentication & Security Architecture

1. **Bearer Token Authentication**: Frontend includes the JWT token in HTTP header `Authorization: Bearer <token>`.
2. **Password Protection**: User passwords are never stored in plaintext and are hashed using `bcryptjs` with 10 salt rounds. `select: false` prevents accidental password returns in database queries.
3. **Database Authorization Scoping**:
   - `Task.find({ user: req.user.id, ...filters })`
   - `Task.findOne({ _id: taskId, user: req.user.id })`
   - `Task.findOneAndUpdate({ _id: taskId, user: req.user.id }, ...)`
   - `Task.findOneAndDelete({ _id: taskId, user: req.user.id })`
   This guarantees that User B cannot access or modify User A's task, returning a `404 Not Found` response.

---

## Testing

Run the automated backend test suite:

```bash
cd server
npm test
```

The test suite validates:
- Zod schema input validation rules
- JWT token signing and payload verification
- Operational `AppError` handling

---

## AI Usage

AI tools were used as development assistance for:
- Code architecture recommendations and structuring layered services
- Synthesizing component boilerplate and Tailwind CSS design tokens
- Reviewing security authorization edge cases and writing validation tests

All generated code was thoroughly reviewed, refined, and verified for performance and security correctness before inclusion.

---

## Time Spent

- **Total Development Time**: ~6.5 hours (Architecture setup, Mongoose models, JWT Auth, Task APIs, Zod validations, TanStack Query integration, Tailwind UI dashboard, and testing).
