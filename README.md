# MedTrack — Offline-First Medication & Dosage Tracker

MedTrack is a high-reliability, offline-first mobile platform built with React Native and Node.js/Express, designed to help users track medication schedules, log daily dosages, and manage reminders seamlessly—even in environments with poor or zero network connectivity.

## Table of Contents
- [Key Features](#key-features)
- [System Architecture & Stack](#system-architecture--stack)
- [Project Directory Overview](#project-directory-overview)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
  - [1. Repository Setup](#1-repository-setup)
  - [2. Backend Setup & Database Migrations](#2-backend-setup--database-migrations)
  - [3. Mobile Application Setup](#3-mobile-application-setup)
- [Environment Variables Guide](#environment-variables-guide)
- [API Endpoints Reference](#api-endpoints-reference)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Documentation & Related Resources](#documentation--related-resources)
- [License & Contributions](#license--contributions)

## Key Features
- 📱 **Zero-Latency Mobile UI**: Instant database reads and writes via local mobile persistence (MMKV / local store).
- 🔄 **Offline-First Synchronization Engine**: Background task queue records local mutations offline and synchronizes queued payloads with the server upon network restoration.
- ⏱️ **Deterministic Conflict Resolution**: Automatic conflict resolution powered by a UTC-based Last-Write-Wins (LWW) engine and client transaction identifiers (`client_tx_id`).
- 🔐 **Secure Dual-Token Authentication**: Access and Refresh JWT token flow stored safely using iOS Keychain and Android Keystore via SecureStore.
- 🔔 **Scheduled Local Notifications**: On-device dosage reminders that trigger on time regardless of server reachability.
- 📊 **Adherence History & Logs**: Exportable dosage compliance records and schedule histories.

## System Architecture & Stack
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

| Domain | Technology | Key Libraries / Frameworks |
|--------|------------|----------------------------|
| **Mobile Application** | React Native (v0.73+), TypeScript | React Navigation, NativeWind, Lucide Icons |
| **Mobile Storage & State** | MMKV / SQLite, Zustand, React Query | `react-native-mmkv`, `@tanstack/react-query` |
| **HTTP Client** | Axios | Custom interceptors with automatic retry queue |
| **Backend API** | Node.js (v20 LTS), Express.js | `express`, `cors`, `helmet`, `express-validator` |
| **Database** | PostgreSQL (v16+) | `pg`, Prisma ORM / Kysely |
| **Authentication** | Dual-Token JWT | `jsonwebtoken`, `bcrypt`, Native SecureStore |

## Project Directory Overview
```text
MedTrack/
├── src/                        # React Native Mobile Frontend
│   ├── assets/                 # Static images, fonts, vectors
│   ├── components/             # Reusable UI elements (atomic components)
│   ├── config/                 # Environment and theme constants
│   ├── features/               # Domain-driven features (auth, medications, sync)
│   ├── hooks/                  # Global custom React hooks
│   ├── navigation/             # React Navigation stacks and tabs
│   ├── services/               # API clients, local storage, and sync runners
│   └── types/                  # Global TypeScript definitions
├── backend/                    # Node.js / Express Backend Service
│   ├── src/
│   │   ├── config/             # DB pooling and app environment configs
│   │   ├── controllers/        # Request handling and HTTP JSON responses
│   │   ├── middlewares/        # JWT auth, rate limiting, and validator layers
│   │   ├── models/             # Schema definitions and domain entities
│   │   ├── repositories/       # Database SQL access layer
│   │   ├── routes/             # Express API endpoint declarations
│   │   └── services/           # Domain business logic & sync processors
│   └── migrations/             # Sequential SQL migration files
├── docs/                       # Architecture diagrams and Excalidraw assets
├── ARCHITECTURE.md             # In-depth system architecture documentation
├── CONTRIBUTING.md             # Community contribution guidelines & standards
└── LICENSE.md                  # Open-source license terms
```

## Prerequisites
Ensure your local development workstation has the following installed:
- **Node.js**: v20.x LTS or higher
- **Package Manager**: npm (v10+) or yarn (v1.22+)
- **PostgreSQL**: v16.x or higher
- **Java Development Kit**: JDK 17+ (required for Android builds)
- **Mobile Environment**:
  - **Android**: Android Studio with configured SDK (API Level 33/34) and active emulator.
  - **iOS** (macOS only): Xcode 15+, CocoaPods (`pod install`), and iOS Simulator.

## Local Development Setup

### 1. Repository Setup
Clone the repository and enter the project directory:
```bash
git clone https://github.com/YOUR_USERNAME/MedTrack.git
cd MedTrack
```

### 2. Backend Setup & Database Migrations
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```
Create a local PostgreSQL database:
```sql
CREATE DATABASE medtrack_db;
```
Copy the example environment configuration:
```bash
cp .env.example .env
```
*Update `.env` with your local database credentials (see Environment Variables Guide).*

Run database migrations and seed data:
```bash
npm run db:migrate
npm run db:seed
```
Start the Express development server:
```bash
npm run dev
```
*The backend will start at `http://localhost:3000`.*

### 3. Mobile Application Setup
Open a new terminal window, navigate back to the root directory, and install mobile dependencies:
```bash
cd ..
npm install
```
Configure environment variables for the mobile client:
```bash
cp .env.example .env
```
**Android Setup**: Ensure an Android Emulator is running, then execute:
```bash
npx react-native run-android
```
**iOS Setup** (macOS only): Install CocoaPods dependencies and launch the iOS Simulator:
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

## Environment Variables Guide

### Backend Configuration (`backend/.env`)
| Variable | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PORT` | Number | `3000` | Port number for Express server |
| `NODE_ENV` | String | `development` | Runtime environment (development, production, test) |
| `DB_HOST` | String | `localhost` | PostgreSQL host server address |
| `DB_PORT` | Number | `5432` | PostgreSQL database connection port |
| `DB_NAME` | String | `medtrack_db` | Name of the PostgreSQL database |
| `DB_USER` | String | `postgres` | Database username |
| `DB_PASS` | String | `postgres` | Database user password |
| `JWT_SECRET` | String | `[random-string]` | Secret key for signing Access Tokens |
| `JWT_REFRESH_SECRET` | String | `[random-string]` | Secret key for signing Refresh Tokens |

### Mobile App Configuration (`.env`)
| Variable | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `EXPO_PUBLIC_API_URL` | String | `http://10.0.2.2:3000/api/v1` | Server base API URL (10.0.2.2 for Android Emulator) |
| `EXPO_PUBLIC_SYNC_INTERVAL_MS` | Number | `15000` | Automatic background sync polling interval in ms |

## API Endpoints Reference

### Authentication Routes (`/api/v1/auth`)
| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|
| `POST` | `/auth/register` | Public | Create a new user account |
| `POST` | `/auth/login` | Public | Authenticate user and return Access/Refresh tokens |
| `POST` | `/auth/refresh` | Public | Exchange long-lived Refresh Token for a new Access Token |

### Medication Routes (`/api/v1/medications`)
| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|
| `GET` | `/medications` | Authenticated | Retrieve user medication list |
| `POST` | `/medications` | Authenticated | Add a new medication and dosage schedule |
| `PUT` | `/medications/:id` | Authenticated | Update an existing medication record |
| `DELETE` | `/medications/:id` | Authenticated | Soft-delete a medication record |

### Sync Engine Routes (`/api/v1/sync`)
| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|
| `POST` | `/sync/push` | Authenticated | Push local offline changes to the central database |
| `GET` | `/sync/pull` | Authenticated | Pull remote updates committed since `last_synced_at` |

## Testing & Quality Assurance

### Mobile App Tests
Run unit and component integration tests using Jest:
```bash
# Run all mobile unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Check code formatting & linting
npm run lint
```

### Backend API Tests
Run API endpoint tests and database mock suites:
```bash
cd backend

# Run backend unit & integration tests
npm test

# Run code coverage report
npm run test:coverage
```

## Troubleshooting Common Issues

1. **Android Emulator cannot reach local backend (Network Error)**
   - *Cause*: `localhost` inside an Android emulator points to the emulator's loopback interface, not your development PC.
   - *Fix*: Ensure your mobile `.env` uses `http://10.0.2.2:3000/api/v1` instead of `localhost`.

2. **`psql: command not found` in Windows PowerShell**
   - *Cause*: PostgreSQL `bin` directory is missing from your system environment `PATH` variable.
   - *Fix*: Add `C:\Program Files\PostgreSQL\<version>\bin` to your System Path or run commands using full paths.

3. **Metro Bundler Cache Issues**
   - *Fix*: Reset the Metro bundler cache when encountering unexpected bundler errors:
     ```bash
     npx react-native start --reset-cache
     ```

## Documentation & Related Resources
For full technical specifications, database schemas, and contribution standards, refer to the following repository documents:
- 📐 **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Detailed breakdown of Clean Architecture, offline synchronization engine, conflict resolution protocols, and security models.
- 🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Git branching policies, Conventional Commit conventions, pull request rules, and coding standards.

## License & Contributions
MedTrack is released under the MIT License. For a plain-language summary of your rights and obligations, please see the [LICENSE.md](./LICENSE.md) file. Contributions, bug reports, and feature requests are welcome! Please read `CONTRIBUTING.md` before submitting Pull Requests.
