# MedTrack System Architecture

This document provides a comprehensive overview of the technical architecture, design patterns, data flow, and infrastructure for MedTrack. It serves as the primary technical reference for engineers maintaining or contributing to the project.

## Table of Contents
1. [Executive System Overview](#1-executive-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [High-Level Architecture Diagram](#3-high-level-architecture-diagram)
4. [Mobile Client Architecture (React Native)](#4-mobile-client-architecture-react-native)
5. [Backend API Architecture (Node.js / Express)](#5-backend-api-architecture-nodejs--express)
6. [Database & Persistence Layer (PostgreSQL)](#6-database--persistence-layer-postgresql)
7. [Offline-First Synchronization Engine](#7-offline-first-synchronization-engine)
8. [Security & Authentication Flow](#8-security--authentication-flow)
9. [Excalidraw Diagram Reference](#9-excalidraw-diagram-reference)

## 1. Executive System Overview
MedTrack is designed as an offline-first, event-aware mobile platform built to ensure continuous reliability even under erratic network conditions.

The architecture separates the mobile frontend client from the server infrastructure. All user actions (dosage tracking, schedules, notes) write immediately to the local mobile store. Background queues and interceptors then push state changes to the remote Node/Express API when network connectivity is detected.

```text
+-----------------------------------------------------------------------+
|                            MOBILE CLIENT                              |
|   React Native (TS) -> Local Database (MMKV/Watermelon) -> Sync Queue |
+-----------------------------------------------------------------------+
                                   |
                       HTTPS REST API / JSON
                                   v
+-----------------------------------------------------------------------+
|                            BACKEND API                                |
|    Node.js / Express Services -> Auth & Validation -> DB Adapters     |
+-----------------------------------------------------------------------+
                                   |
                               SQL Pool
                                   v
+-----------------------------------------------------------------------+
|                            PERSISTENCE                                |
|                      PostgreSQL 16 Database                           |
+-----------------------------------------------------------------------+
```

## 2. Technology Stack

| Layer | Technology | Primary Purpose | Key Libraries / Modules |
|-------|------------|-----------------|-------------------------|
| **Mobile UI** | React Native (v0.73+) | Cross-platform UI execution | React Navigation, NativeWind, Lucide Icons |
| **Mobile Core** | TypeScript (v5.x) | Static typing & interface definitions | Strict Null Checks enabled |
| **Local Persistence** | React Native MMKV / SQLite | Zero-latency local storage for offline state | `react-native-mmkv` / `@realm/react` |
| **State & Sync** | Zustand / React Query | App state management & cached network queries | `@tanstack/react-query`, `zustand` |
| **Network Client** | Axios | RESTful HTTP requests with interceptors | Axios with automatic retry queue |
| **Backend Runtime** | Node.js (v20 LTS) | Asynchronous API execution environment | Express.js, TypeScript |
| **API Layer** | Express.js | Route routing, middleware processing, REST endpoints | `cors`, `helmet`, `express-validator` |
| **Database** | PostgreSQL (v16+) | Relational persistence & JSON transactional storage | `pg`, Prisma ORM / Kysely |
| **Authentication** | JSON Web Tokens (JWT) | Stateless authentication & authorization | `jsonwebtoken`, `bcrypt` |

## 3. High-Level Architecture Diagram
```text
                     +---------------------------------------+
                     |         React Native Application      |
                     +---------------------------------------+
                       /                 |                 \
                      v                  v                  v
         +--------------------+ +-----------------+ +-------------------+
         | UI Components /    | | Zustand Store   | | Local Storage     |
         | React Navigation   | | (Global State)  | | (MMKV / SQLite)   |
         +--------------------+ +-----------------+ +-------------------+
                                         |                  |
                                         v                  |
                               +-------------------+        | (Offline Fallback)
                               | Axios API Client  |        |
                               +-------------------+        |
                                         |                  |
                                 HTTPS (JSON Payloads)      |
                                         |                  v
                                         v        +-------------------+
                               +------------------| Sync Queue Engine |
                               | Node/Express API | +-------------------+
                               +-------------------+
                                 /       |       \
                                v        v        v
                        [Auth Guard] [Router] [Services]
                                         |
                                         v
                               +-------------------+
                               | PostgreSQL 16 DB  |
                               +-------------------+
```

## 4. Mobile Client Architecture (React Native)
The mobile client uses a Feature-Driven Clean Architecture to prevent tight coupling between the presentation layer and network logic.

### 4.1 Directory Structure
```text
src/
├── assets/             # Fonts, images, raw static vectors
├── components/         # Shared presentation components (Button, Modal, Input)
│   ├── ui/             # Atomic design elements
│   └── feedback/       # Alerts, Spinners, Toast primitives
├── config/             # App-wide constants, theme files, environment variables
├── features/           # Modular feature domains
│   ├── auth/           # Screens, state, and services for login/signup
│   ├── medications/    # Screens, hooks, and logic for dosage tracking
│   └── sync/           # Offline queue runners and network listeners
├── hooks/              # Global custom hooks (useNetworkStatus, useDebounce)
├── navigation/         # React Navigation stacks, tabs, and type guards
├── services/           # Infrastructure logic
│   ├── api/            # Axios instance, interceptors, endpoint methods
│   ├── db/             # Local database drivers and schema definitions
│   └── storage/        # Encrypted SecureStore adapters for tokens
├── types/              # Global TypeScript interfaces & type aliases
└── utils/              # Pure utility functions (formatting, date calculations)
```

### 4.2 Layered Architecture
- **Presentation Layer** (`src/components`, `src/features/*/screens`):
  - Renders UI based on local state.
  - Never directly executes raw fetch or direct database calls.
  - Delegates events to Custom Hooks or Zustand Store actions.
- **Domain / State Layer** (`src/features/*/hooks`, Zustand stores):
  - Holds reactive application state.
  - Enforces business rules (e.g., validating dosage timing intervals).
  - Triggers local storage updates and sync queue items.
- **Data / Infrastructure Layer** (`src/services/`):
  - Handles local SQLite/MMKV reads/writes.
  - Wraps network calls inside `apiClient.ts` with error handling.

### 4.3 State Management & Offline Storage
```text
[ User Action ] ---> [ Zustand Store Action ] ---> [ 1. Save to Local MMKV/SQLite ]
                                            ---> [ 2. Queue Sync Event ]
                                            ---> [ 3. Fire API via Network Client ]
```
- **Local Storage**: Used as the single source of truth for the UI. App rendering is instant because reads hit local storage directly instead of waiting for API responses.
- **Axios Interceptors**: Append JWT Bearer tokens to outbound requests and automatically catch `401 Unauthorized` responses to initiate token refreshes.

## 5. Backend API Architecture (Node.js / Express)
The backend follows a Controller-Service-Repository (CSR) pattern to ensure separation of concerns and maintainability.

### 5.1 Directory Structure
```text
backend/src/
├── config/             # DB pooling setup, environment variable validation
├── constants/          # Error codes, status constants
├── controllers/        # Request handling, input extraction, HTTP responses
├── middlewares/        # Express request middleware (auth, rate limiting, validation)
├── models/             # Database entity schemas and interface definitions
├── repositories/       # Direct SQL queries and database access methods
├── routes/             # Express API endpoint declarations
├── services/           # Core domain business logic and sync handling
├── utils/              # Token generators, loggers, password hashing
└── app.ts              # Express application configuration entry point
```

### 5.2 Express Application Layers
```text
Client Request ---> Middleware Stack ---> Controller ---> Service Layer ---> Repository Layer ---> PostgreSQL
                                                                                                        |
Client Response <--- Controller <--- Service Layer <--- Data Results <-----------------------------------+
```
- **Routes & Middleware Layer**: Validates structural inputs via `express-validator`, verifies JWT headers (`authMiddleware.ts`), and applies security headers via `helmet`.
- **Controller Layer**: Parses parameters, delegates execution to services, and shapes standardized HTTP JSON responses:
  ```json
  {
    "success": true,
    "data": {},
    "error": null
  }
  ```
- **Service Layer**: Executes core business processing (e.g., computing medication schedules, checking log collisions).
- **Repository Layer**: Encapsulates database queries (Prisma/Kysely/SQL) to isolate storage engine dependencies.

## 6. Database & Persistence Layer (PostgreSQL)

### 6.1 Entity-Relationship Overview
```text
+---------------+         1:N         +-------------------+
|     users     | ------------------->|    medications    |
+---------------+                     +-------------------+
| id (PK)       |                             |
| email         |                             | 1:N
| password_hash |                             v
| created_at    |                     +-------------------+
+---------------+                     |     schedules     |
        |                             +-------------------+
        | 1:N                         | id (PK)           |
        v                             | medication_id(FK) |
+---------------+                     | dosage_time       |
|   sync_logs   |                     +-------------------+
+---------------+                             |
| id (PK)       |                             | 1:N
| user_id (FK)  |                             v
| client_tx_id  |                     +-------------------+
| status        |                     |   dosage_logs     |
+---------------+                     +-------------------+
                                      | id (PK)           |
                                      | schedule_id (FK)  |
                                      | status (taken/skip|
                                      | synced_at         |
                                      +-------------------+
```

### 6.2 Database Schema & Migrations
- **Primary Keys**: UUID v4 (`gen_random_uuid()`) is used across all tables. Using UUIDs allows the React Native client to generate valid record identifiers offline without waiting for server auto-increment responses.
- **Timestamps**: Every table contains `created_at`, `updated_at`, and `deleted_at` (for soft deletes) stored in `TIMESTAMPTZ` format.
- **Migration Strategy**: Database schema changes are version-controlled using database migration files run sequentially via automated deployment scripts (`npm run db:migrate`).

## 7. Offline-First Synchronization Engine

### 7.1 Sync Lifecycle & Pipeline
When the device loses internet access, user operations are queued locally and executed sequentially once connectivity is re-established.

```text
[ Offline User Action ]
          |
          v
[ Local DB Mutation ] ---> [ Append Event to Local Sync Queue ]
                                       |
                           (Device Returns Online)
                                       |
                                       v
                        [ Processing Queue Batch ]
                                       |
                         POST /api/v1/sync/push
                                       |
                                       v
                        [ Backend Validates Payload ]
                                       |
               +-----------------------+-----------------------+
               |                                               |
      (No Conflicts)                                  (Conflict Detected)
               |                                               |
               v                                               v
     [ Commit DB Transaction ]                     [ Resolve via LWW Engine ]
               |                                               |
               +-----------------------+-----------------------+
                                       |
                                       v
                     [ Return Updated Server State ]
                                       |
                                       v
                    [ Flush Local Queue & Mark Synced ]
```

### 7.2 Conflict Resolution Strategy
MedTrack uses a Last-Write-Wins (LWW) conflict resolution model based on UTC timestamps, paired with a deterministic client transaction ID (`client_tx_id`):
- Every write operation includes a client-generated `updated_at` ISO timestamp.
- If the backend receives an update for a record where `incoming.updated_at > existing.updated_at`, the server accepts the change.
- If an incoming record is older, the server discards the client change and returns the latest database state to force client synchronization.
- Duplicate events sent due to network retries are dropped safely using unique constraint validation on `client_tx_id`.

## 8. Security & Authentication Flow

### 8.1 Token Management
Authentication relies on dual-token JSON Web Tokens (JWT):
- **Access Token**: Short-lived (15 minutes), passed in the `Authorization: Bearer <JWT>` header for all protected API requests. Held in memory on the mobile client.
- **Refresh Token**: Long-lived (7 days), stored securely on the mobile device using iOS Keychain / Android Keystore via Expo/React Native SecureStore.

```text
Client                              Server                           Database
  |                                   |                                  |
  |--- POST /api/v1/auth/login ------>|                                  |
  |                                   |--- Validate Credentials -------->|
  |                                   |<-- Valid User Payload -----------|
  |<-- Return Access & Refresh Tokens -|                                  |
  |                                   |                                  |
  |--- Request + Access Token ------->|                                  |
  |                                   |--- Validate JWT Signature ------>|
  |<-- 200 OK Response ---------------|                                  |
```

### 8.2 API Gateway & Security Headers
- **CORS**: Restricted strictly to registered client application origins.
- **Helmet.js**: Applied globally to enforce HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`).
- **Rate Limiting**: Enforced via `express-rate-limit` on public routes (e.g., maximum 5 login attempts per minute per IP).

## 9. Excalidraw Diagram Reference
For editing or extending visual architectural models, access the visual diagrams in our repository workspace:
- **System Architecture Diagram**: `docs/diagrams/system-overview.excalidraw`
- **Offline Data Pipeline**: `docs/diagrams/offline-sync-flow.excalidraw`
- **Database ERD Visual**: `docs/diagrams/database-erd.excalidraw`

*Note: Open `.excalidraw` files directly inside VS Code / Antigravity using the Excalidraw Extension or import them into Excalidraw.com.*
