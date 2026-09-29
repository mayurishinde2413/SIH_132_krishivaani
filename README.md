# KrishiVaani

**Tagline:** Strengthening Market Linkages & Price Discovery for Farmers

A full-stack prototype for a farmer-first agricultural market linkage platform.

## Project Structure

```
KrishiVaani/
│
├── frontend/          # React + Vite + TypeScript UI
├── backend/           # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── routes/        # Express route definitions
│   │   ├── controllers/   # Request handlers (thin, delegate to services)
│   │   ├── services/      # Business logic + Prisma calls
│   │   ├── middleware/    # errorHandler, notFound
│   │   ├── utils/         # asyncHandler, apiResponse
│   │   ├── database/      # PrismaClient singleton
│   │   └── index.ts       # App entry point
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── seed.ts        # Demo seed data
├── ml-service/        # Python FastAPI ML micro-service
├── .env               # Root environment variables
├── docker-compose.yml
└── README.md
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** PostgreSQL 16
- **AI/ML Service:** Python 3.11, FastAPI, Pandas, NumPy, Scikit-learn, XGBoost

---

## Prerequisites

Make sure the following are installed:

- Node.js ≥ 20
- PostgreSQL ≥ 14 (running locally or via Docker)
- Python ≥ 3.11 (for ML service)
- npm or yarn

---

## Environment Setup

### 1. Configure `.env`

The root `.env` is shared. Copy & edit:

```env
# .env (project root)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/krishivaani?schema=public"
PORT=5000
```

If using Docker Compose (recommended):
```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/krishivaani?schema=public"
```

---

## Backend Setup

### 2. Install dependencies

```powershell
cd backend
npm install
```

### 3. Create the PostgreSQL database

Using `psql` or pgAdmin, create a database named `krishivaani`:

```sql
CREATE DATABASE krishivaani;
```

Or with psql CLI:

```powershell
psql -U postgres -c "CREATE DATABASE krishivaani;"
```

### 4. Generate Prisma client

```powershell
npm run db:generate
```

### 5. Push schema to database (development, no migration history)

```powershell
npm run db:push
```

Or use proper migrations (recommended):

```powershell
npm run db:migrate
# name: "init"
```

### 6. Seed demo data

```powershell
npm run db:seed
```

This will create:
- 7 crops (Wheat, Bajra, Tomato, Onion, Maize, Potato, Soybean)
- 6 markets (Pune APMC, Nashik APMC, Solapur APMC, Ahmednagar APMC, Satara Market, Baramati APMC)
- ~140 market price records (7 days × all crop-market pairs)
- 70 market arrival records
- 5 FPOs with members
- 5 demo farmers + 3 demo buyers (password: `demo@1234`)
- Farmer inventory + Buyer requirements

### 7. Start backend

```powershell
npm run dev
```

Backend runs at **http://localhost:5000**

---

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register new Farmer or Buyer |
| POST | `/api/auth/login` | Login with mobile/email & password, returns JWT |
| POST | `/api/auth/logout` | Logout acknowledgment |
| GET | `/api/auth/me` | Fetch authenticated user profile (Protected Bearer) |
| GET | `/api/crops` | All crops |
| GET | `/api/crops/:id` | Crop by ID |
| GET | `/api/markets` | All markets |
| GET | `/api/markets/:id` | Market with prices & arrivals |
| GET | `/api/market-prices` | Market prices (filters: `cropId`, `marketId`, `startDate`, `endDate`, `limit`) |
| GET | `/api/fpos` | All FPOs with members |
| GET | `/api/fpos/:id` | FPO by ID |
| GET | `/api/buyers` | All buyers |
| GET | `/api/buyers/:id` | Buyer with requirements |
| GET | `/api/buyer-requirements` | Buyer requirements (filters: `cropId`, `buyerId`, `isActive`) |

All endpoints return:
```json
{
  "success": true,
  "message": "Success",
  "data": [...]
}
```

Error responses:
```json
{
  "success": false,
  "message": "Route /api/xyz not found",
  "code": 404
}
```

---

## Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000** and proxies `/api` calls to the backend.

---

## ML Service Setup

```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

ML service runs at **http://localhost:8000**

Health check: `GET /ml/health`

---

## 🔥 Quick Start (All Services)

To run the full stack simultaneously in separate PowerShell windows:

**1. Start the Database & Backend (Terminal 1)**
```powershell
cd backend
npm run db:push
npm run db:seed
npm run dev
```

**2. Start the ML Service (Terminal 2)**
```powershell
cd ml-service
.\.venv\Scripts\activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**3. Start the Frontend (Terminal 3)**
```powershell
cd frontend
npm run dev
```

## Docker Compose (Full Stack)

```powershell
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| ML Service | http://localhost:8000 |
| PostgreSQL | localhost:5432 |

---

## Demo Credentials

All demo users have password: `demo@1234`

| Name | Email | Role |
|------|-------|------|
| Ramesh Kumar | ramesh@demo.com | Farmer |
| Priya Patil | priya@demo.com | Farmer |
| Suresh Jadhav | suresh@demo.com | Farmer |
| Fresh Mart Pvt Ltd | freshmart@demo.com | Buyer |
| AgroExport Co | agroexport@demo.com | Buyer |
| Spice Route Foods | spiceroute@demo.com | Buyer |

---

## Modules Roadmap

| # | Module | Status |
|---|--------|--------|
| 01 | Price Discovery | ✅ Done |
| 02 | Net Realisation | ✅ Done |
| 03 | FPO Aggregation | ✅ Done |
| 04 | Sell Now / Wait | ✅ Done |
| 05 | Buyer Matching & Bidding | ✅ Done |
| 06 | Crop Rescue | ✅ Done |
