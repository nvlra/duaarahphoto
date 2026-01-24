# Enviel Photography

## Admin Dashboard & Landing Page

**All-in-one Business Management System** untuk studio fotografi.

---

## 🚀 Quick Start (5 Menit)

### 1. Clone & Install

```bash
git clone <repository-url>
cd web
npm install
```

### 2. Setup Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** → Paste & Run `schema.sql`
3. Setup Storage (Bucket & Policies) → Paste & Run `storage_setup.sql`
4. Buka **Authentication** → **Users** → Add User (untuk admin login)

### 3. Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run

```bash
npm run dev
```

**Done!**

- Landing Page: [localhost:3000](http://localhost:3000)
- Admin: [localhost:3000/admin](http://localhost:3000/admin)

---

## 📚 Dokumentasi

| File                               | Isi                 |
| ---------------------------------- | ------------------- |
| [DEPLOY.md](./DEPLOY.md)           | Deploy ke Vercel    |
| [MAINTENANCE.md](./MAINTENANCE.md) | Update dependencies |
| [MIGRATION.md](./MIGRATION.md)     | Update database     |

---

## 🛠 Tech Stack

| Layer      | Technology                   |
| ---------- | ---------------------------- |
| Framework  | Next.js 16                   |
| Language   | TypeScript                   |
| Styling    | Tailwind CSS 4 + Shadcn UI   |
| Backend    | Supabase (PostgreSQL + Auth) |
| Animations | Framer Motion                |

---

## ✨ Features

### Public Website

- Landing Page dinamis (Hero, About, Services)
- Portfolio gallery
- SEO-friendly

### Admin Dashboard

- 📦 **Orders** - Kelola pesanan & status pembayaran
- 💰 **Finance** - Revenue, expenses, profit tracking
- 🧾 **Invoicing** - Print invoice PDF, kustomisasi brand & logo
- 👥 **Team** - Kelola tim & alokasi per proyek
- 📸 **Gallery** - Kelola portfolio
- 🎨 **CMS** - Edit konten landing page
- 📅 **Calendar** - Jadwal acara

---

## 📁 Project Structure

```
web/
├── src/
├── storage_setup.sql       # Storage policies setup
├── schema.sql              # Database schema
├── dummy_data.sql          # Sample data
└── .env.example            # Environment template
```

---

## 🔒 Security

- ✅ Supabase Auth (session-based)
- ✅ Row Level Security (RLS) enabled
- ✅ Protected admin routes (middleware)
- ✅ No public signup (admin only)

---

## 📦 Database Tables

| Table              | Deskripsi                |
| ------------------ | ------------------------ |
| orders             | Pesanan klien            |
| invoice_settings   | Pengaturan brand invoice |
| order_allocations  | Penugasan tim per order  |
| team_members       | Data tim                 |
| expenses           | Pengeluaran              |
| expense_categories | Kategori expense         |
| packages           | Paket layanan            |
| package_categories | Kategori paket           |
| page_sections      | CMS landing page         |
| projects           | Portfolio                |
| clients            | Data klien               |
| site_settings      | Pengaturan website       |

---

## 🌐 Deploy to Vercel

```bash
# Push to GitHub
git push origin main
```

1. Import project di [vercel.com](https://vercel.com)
2. Set **Root Directory** = `web`
3. Add Environment Variables
4. Deploy!

---

## 📄 License

Private project for Enviel Photography.
