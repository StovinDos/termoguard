# TermoGuard — 
           
# &#x20;   Precision Thermal Intelligence Platform

A full-stack e-commerce platform for the TermoGuard smart temperature sensor.

## Architecture

```
termoguard/
├── frontend/          # React + Tailwind CSS + Vite
└── backend/           # Spring Boot + PostgreSQL
```

## Tech Stack

|Layer|Technology|
|-|-|
|Frontend|React 18, Tailwind CSS v3, React Router v6, Axios|
|Backend|Java 17, Spring Boot 3, Spring Security, JWT|
|Database|PostgreSQL 15|
|Auth|JWT (Bearer tokens) + BCrypt password hashing|
|Hosting|GitHub Pages (frontend) + GitHub Actions CI/CD|

## Quick Start

### Backend

```bash
cd backend
# Configure database in src/main/resources/application.yml
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`application.yml`)

* `DB\_URL` — PostgreSQL connection string
* `DB\_USERNAME` / `DB\_PASSWORD` — Database credentials
* `JWT\_SECRET` — 256-bit secret key for JWT signing
* `JWT\_EXPIRATION` — Token expiry in milliseconds (default: 86400000 = 24h)

### Frontend (`.env`)

* `VITE\_API\_BASE\_URL` — Backend API base URL

## Protected Routes

The `/store` and `/cart` routes require authentication.
Unauthenticated users are redirected to `/auth?redirect=/store`.

