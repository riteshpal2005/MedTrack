# MedTrack Security Policy

The MedTrack team takes the security of our application, API infrastructure, and user data seriously. As an offline-first health and medication management platform, protecting sensitive user data—both locally on the mobile device and during synchronization with remote servers—is a top priority.

This document outlines supported software versions, instructions for reporting security vulnerabilities responsibly, and our core security architecture safeguards.

## Table of Contents
- [Supported Versions](#supported-versions)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
  - [Reporting Steps](#reporting-steps)
  - [What to Include](#what-to-include)
  - [Response Expectations & SLA](#response-expectations--sla)
- [Security Architecture & Threat Controls](#security-architecture--threat-controls)
  - [1. Mobile Client (React Native)](#1-mobile-client-react-native)
  - [2. API Infrastructure (Node.js & Express)](#2-api-infrastructure-nodejs--express)
  - [3. Persistence & Database (PostgreSQL)](#3-persistence--database-postgresql)
- [Incident Handling & Disclosure Lifecycle](#incident-handling--disclosure-lifecycle)
- [Developer & Contributor Security Hygiene](#developer--contributor-security-hygiene)

## Supported Versions
We actively release security patches and dependency updates for the following software versions:

| Version | Supported | Maintenance Status |
|---------|-----------|--------------------|
| **v1.x.x** (Main / Latest) | 🟢 Yes | Active development and priority security updates |
| **< v1.0.0** (Alpha/Beta) | 🔴 No | Deprecated. Users should upgrade to latest v1.x |

## Reporting a Vulnerability
If you discover a security vulnerability, security flaw, or potential weakness in MedTrack, please **do not open a public GitHub issue**. Publicly disclosing security flaws puts active users at risk before a fix can be prepared and deployed.

### Reporting Steps
Please report security issues privately using one of the following methods:
- **GitHub Private Vulnerability Reporting**: Navigate to the repository's *Security* tab, click *Report a vulnerability*, and fill out the private disclosure form.
- **Email Disclosure**: Send an email directly to our security maintainers at `security@medtrack.app` with the subject line: `[SECURITY] Vulnerability Report - <Brief Summary>`.

### What to Include
To help us investigate and remediate the issue quickly, please include as much detail as possible:
- **Type of Issue**: (e.g., Unauthenticated API endpoint, JWT Token leakage, SQL Injection, Broken Access Control, Insecure Local Storage).
- **Affected Component**: Mobile App, Backend API, Database Migration, or Build Script.
- **Steps to Reproduce**: Step-by-step instructions or proof-of-concept (PoC) code/scripts.
- **Potential Impact**: What data, operations, or accounts could be compromised?
- **Suggested Remediation**: Any recommended code changes or configuration fixes (if known).

### Response Expectations & SLA
- **Initial Acknowledgment**: Within 24 to 48 hours of receiving your report.
- **Triage & Assessment**: Within 5 business days, detailing validity and severity rating.
- **Patch Target**: Critical vulnerabilities aim to be patched within 14 calendar days; non-critical flaws within 30 calendar days.

## Security Architecture & Threat Controls
MedTrack employs a defense-in-depth approach spanning the mobile frontend, backend HTTP services, and relational persistence layer.

```text
+-------------------------------------------------------------------------+
| MOBILE CLIENT (React Native)                                            |
| - SecureStore (iOS Keychain / Android Keystore)                         |
| - Certificate Pinning / Transport Layer Security (TLS 1.3)              |
| - Local Data Encryption & Input Sanitization                            |
+-------------------------------------------------------------------------+
                                     |
                          HTTPS Strict Bearer JWT
                                     v
+-------------------------------------------------------------------------+
| BACKEND API (Node.js / Express)                                         |
| - Helmet.js (HTTP Security Headers) & Restricted CORS Rules             |
| - Express Rate-Limiter (Brute-force protection on /auth)                |
| - Input Validation & Sanitization via express-validator                 |
| - Stateless Short-lived Access JWTs + HttpOnly Refresh Tokens           |
+-------------------------------------------------------------------------+
                                     |
                         Encrypted Connection Pool
                                     v
+-------------------------------------------------------------------------+
| DATABASE LAYER (PostgreSQL 16)                                          |
| - Parameterized SQL Queries (SQL Injection Prevention)                  |
| - Password Hashing using bcrypt / SCRAM-SHA-256                         |
| - SSL/TLS Mode Enabled for Database Connections                         |
+-------------------------------------------------------------------------+
```

### 1. Mobile Client (React Native)
- **Credential & Token Storage**: Long-lived Refresh Tokens and secrets are stored exclusively in hardware-backed secure storage via Expo SecureStore (iOS Keychain and Android Keystore). Tokens are never stored in plaintext inside `AsyncStorage` or unencrypted local state.
- **Console Log Stripping**: All `console.log` statements containing potentially sensitive payload outputs are automatically stripped in production release builds using Babel transformers (`babel-plugin-transform-remove-console`).
- **Transport Security**: All network communications enforce HTTPS (TLS 1.3). HTTP connections are rejected in production builds.

### 2. API Infrastructure (Node.js & Express)
- **HTTP Header Security**: `helmet` middleware is enforced globally to configure secure HTTP headers (`X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`, `HSTS`).
- **Rate Limiting**: Public authentication endpoints (`/api/v1/auth/login`, `/api/v1/auth/register`) enforce strict rate limiting via `express-rate-limit` to prevent brute-force credential stuffing attacks.
- **Access Control & JWT**: Authentication relies on short-lived Access Tokens (15-minute expiration) signed via strong secret keys (`JWT_SECRET`). Endpoints check explicit authorization scopes before processing database mutations.
- **Input Validation**: Request parameters, body payloads, and query params are strictly sanitized using `express-validator` to eliminate Cross-Site Scripting (XSS) and payload tampering.

### 3. Persistence & Database (PostgreSQL)
- **SQL Injection Prevention**: Raw, concatenated string queries are strictly forbidden. All SQL queries use parameterized queries / prepared statements via ORMs (Prisma, Kysely) or pg parameter binding (`$1`, `$2`).
- **Password Hashing**: User passwords are never stored in plain text. Passwords are hashed using `bcrypt` (cost factor 12) or `scram-sha-256` at the database engine level.
- **Database TLS**: PostgreSQL database connections require SSL/TLS in staging and production environments (`SSL_MODE=require`).

## Incident Handling & Disclosure Lifecycle
When a security vulnerability is reported or identified:
1. **Verification**: Maintainers isolate the affected code paths in a private workspace.
2. **Fix Development**: A security patch is created, tested against existing Jest test suites, and verified against regression.
3. **Release Deployment**: A hotfix release is published (`v1.x.y`) for backend API instances and mobile App Store/Play Store builds.
4. **Public Advisory**: After a patch is deployed and verified, a GitHub Security Advisory is published summarizing the issue, severity, fix, and credit to the reporter (if desired).

## Developer & Contributor Security Hygiene
All project contributors must adhere to these baseline security habits:
- **Never Commit Secrets**: API keys, database credentials, JWT secrets, and private keys must never be committed to Git. Always use `.env` files and verify they are listed in `.gitignore`.
- **Automated Secret Scanning**: We recommend installing `gitleaks` or `trufflehog` locally to prevent accidental credential commits.
- **Dependency Auditing**: Run `npm audit` periodically on both frontend and backend directories. High or critical severity vulnerabilities must be updated or overridden immediately.
- **PR Code Reviews**: All pull requests targeting `main` require approval from at least one core maintainer, checking specifically for input validation and privilege escalation risks.

Thank you for helping keep MedTrack secure for all users!
