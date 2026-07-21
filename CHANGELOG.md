# Changelog

All notable changes to the MedTrack platform (mobile client and backend services) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `feat(sync)`: Exponential backoff algorithm for background sync retry logic during intermittent network connections.
- `feat(ui)`: Biometric authentication support (FaceID / Fingerprint) for mobile app unlock via Expo LocalAuthentication.

### Fixed
- `fix(auth)`: Automatic token refresh race condition when multiple API requests trigger simultaneously on access token expiration.

## [1.0.0] - 2026-07-21

### Added

**Mobile Client (React Native):**
- Offline-first local database layer utilizing `react-native-mmkv` and Zustand state persistence.
- Deterministic Last-Write-Wins (LWW) conflict resolution engine using client transaction IDs (`client_tx_id`).
- On-device local push notifications for medication dosage reminders.
- Native SecureStore wrapper for hardware-backed storage of access and refresh JWT tokens.

**Backend API (Node.js & Express):**
- Express API gateway with `/api/v1/auth`, `/api/v1/medications`, and `/api/v1/sync` endpoint pipelines.
- Security middleware stack including `helmet`, `cors` origin restriction, and `express-rate-limit` brute-force protection.
- DTO validation layer using `express-validator` for payload sanitization.

**Database (PostgreSQL):**
- Initial sequential SQL database migrations for `users`, `medications`, `schedules`, `dosage_logs`, and `sync_logs`.
- Index optimization for `user_id` and `updated_at` across all user-owned domain tables.

**Documentation & DevOps:**
- Comprehensive documentation suite (`README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE.md`).
- Automated Jest test runner scripts for mobile components and backend API endpoints.

## [0.2.0] - 2026-06-15

### Added
- Dual-token JWT authentication flow (`POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`).
- Axios global network interceptor with automatic Bearer token injection and HTTP 401 error interceptors.
- Core UI component library (Buttons, Text Inputs, Modals, Status Badges) styled using NativeWind.

### Changed
- Refactored backend folder structure to strictly follow the Controller-Service-Repository (CSR) pattern.
- Migrated mobile global state management from React Context API to Zustand for improved selector re-render performance.

### Fixed
- Resolved Android emulator loopback connection issue by setting default API target to `10.0.2.2:3000`.

## [0.1.0] - 2026-05-01

### Added
- Initialized monorepo workspace for React Native mobile client and Node.js/Express backend service.
- Configured TypeScript compiler options (`tsconfig.json`) across frontend and backend environments.
- Added ESLint and Prettier formatting rules with custom Metro bundler ignore settings.

---

## Versioning Policy

MedTrack uses [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):
- **MAJOR (`x.0.0`)**: Incompatible API changes, breaking database migrations, or database schema structural refactors requiring data migrations.
- **MINOR (`0.x.0`)**: New features or domain endpoints added in a backward-compatible manner.
- **PATCH (`0.0.x`)**: Backward-compatible bug fixes, security hotfixes, or performance optimizations.

## Release Checklist
Before tagging a new production release:
- [ ] Update `package.json` version numbers in both `root` and `backend/` directories.
- [ ] Run `npm run test` across frontend and backend directories to ensure zero regressions.
- [ ] Verify PostgreSQL migration scripts run cleanly on a fresh database environment (`npm run db:migrate`).
- [ ] Move relevant notes from `[Unreleased]` into a newly dated version heading in this document.
- [ ] Create a Git tag corresponding to the version (`git tag -a v1.x.y -m "Release v1.x.y"`).
