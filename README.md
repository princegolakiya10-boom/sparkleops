# SparkleOps — Cleaning Job Manager

A clean, professional React web app for managing recurring cleaning jobs. Multi-user, Airtable-powered, deployable anywhere.

---

## Features

- **Login / Signup** — Email & password auth, persisted across sessions
- **Dashboard** — Live stats: Today / Tomorrow / This Week / Total clients
- **Filter by date** — Today, Tomorrow, This Week, All, or pick any date
- **Search** — Search across customer name, address, mobile, notes
- **Add & edit jobs** — Customer name, mobile, address, weekly/fortnightly schedule, unlimited notes
- **Mark done** — Auto-advances next date by 7 or 14 days
- **Job detail view** — Full profile, next 5 scheduled dates, tap-to-call mobile link
- **Print run sheet** — Opens a print-ready daily run sheet with checkboxes
- **Export CSV** — Download all jobs as a spreadsheet

---

## Setup — Step by Step

### 1. Set up Airtable

1. Go to [airtable.com](https://airtable.com) and create a free account
2. Create a **new Base** — call it "SparkleOps"
3. Create two tables with these exact fields:

**Table: `Users`**
| Field name  | Field type       |
|-------------|-----------------|
| Id          | Single line text |
| Name        | Single line text |
| Email       | Single line text |
| Password    | Single line text |
| CreatedAt   | Single line text |

**Table: `Jobs`**
| Field name   | Field type                                    |
|--------------|----------------------------------------------|
| Id           | Single line text                              |
| UserId       | Single line text                              |
| CustomerName | Single line text                              |
| Mobile       | Single line text                              |
| Address      | Single line text                              |
| Notes        | Long text                                     |
| NextDate     | Date (ISO format — turn off "Use same time zone for all collaborators") |
| Frequency    | Single select — add options: `weekly`, `fortnightly` |
| CreatedAt    | Single line text                              |

> **Important:** The Frequency field options must be exactly `weekly` and `fortnightly` (lowercase).

### 2. Get your credentials

**Personal Access Token:**
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **+ Create new token**
3. Give it a name (e.g. "SparkleOps")
4. Add scopes: `data.records:read`, `data.records:write`
5. Add your base under **Access**
6. Copy the token — you only see it once!

**Base ID:**
1. Go to [airtable.com/api](https://airtable.com/api)
2. Click your SparkleOps base
3. The Base ID is in the URL and docs — starts with `app` (e.g. `appXXXXXXXXXXXXXX`)

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:
```
REACT_APP_AIRTABLE_TOKEN=patXXXXXXXXXXXXXX
REACT_APP_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### 4. Install and run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) — create an account and start adding jobs!

---

## Deploy

### Netlify (easiest — free)
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Build command: `npm run build`
4. Publish directory: `build`
5. Add environment variables in **Site settings → Environment variables**

### Vercel (also free)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Framework: Create React App (auto-detected)
4. Add environment variables in project settings

### Manual
```bash
npm run build
```
Upload the `build/` folder to any static host (Cloudflare Pages, GitHub Pages, S3, etc.)

---

## Security note

Passwords are stored as plaintext in Airtable for this demo. For production use, add a small backend (Node.js/Express or a Netlify/Vercel serverless function) to hash passwords with bcrypt before storing them. The Airtable token should also be kept server-side in production so it's never exposed in the browser bundle.

---

## Project structure

```
src/
  lib/
    airtable.js     ← All Airtable API calls
    AuthContext.js  ← Login/signup/logout state
    utils.js        ← Date helpers, formatting
    print.js        ← Print run sheet + CSV export
  hooks/
    useJobs.js      ← Job CRUD with Airtable
  components/
    UI.jsx          ← Button, Badge, Input, Modal, etc.
    UI.module.css
    JobCard.jsx     ← Job list item
    JobDetail.jsx   ← Job detail modal
    JobForm.jsx     ← Add/edit form
  pages/
    AuthPage.jsx    ← Login / signup
    DashboardPage.jsx ← Main dashboard
  styles/
    global.css      ← CSS variables + reset
```
