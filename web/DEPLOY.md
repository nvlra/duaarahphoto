# Deployment Guide

## Enviel Photography Dashboard

---

## 🚀 Deploy ke Vercel (Recommended)

### Step 1: Push ke GitHub

```bash
cd d:\DuaarahPhoto
git add .
git commit -m "ready for deployment"
git push origin main
```

### Step 2: Connect Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik **Add New** → **Project**
3. Import repository dari GitHub
4. Set **Root Directory** = `web`
5. Set **Framework Preset** = `Next.js`

### Step 3: Environment Variables

Tambahkan di Vercel Dashboard → Settings → Environment Variables:

| Key                             | Value                     |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...`               |

### Step 4: Deploy

Klik **Deploy** dan tunggu selesai.

---

## 🔧 Custom Domain (Opsional)

1. Di Vercel → Project → Settings → Domains
2. Add domain: `admin.envielphotography.com`
3. Update DNS di domain registrar:
   - Type: `CNAME`
   - Name: `admin`
   - Value: `cname.vercel-dns.com`

---

## 🗄️ Setup Supabase (Fresh Install)

### Step 1: Buat Project

1. Buka [supabase.com](https://supabase.com)
2. Klik **New Project**
3. Isi nama, password database, region (Singapore recommended)

### Step 2: Jalankan Schema

1. Buka **SQL Editor**
2. Copy-paste isi `schema.sql`
3. Klik **Run**

### Step 3: Jalankan Dummy Data (Opsional)

1. Copy-paste isi `dummy_data.sql`
2. Klik **Run**

### Step 4: Buat User Admin

1. Buka **Authentication** → **Users**
2. Klik **Add User**
3. Isi email dan password
4. Ini untuk login ke `/admin`

### Step 5: Setup Storage (Opsional)

1. Buka **Storage**
2. Klik **New Bucket**
3. Buat bucket:
   - `branding` (Public)
   - `gallery` (Public)
   - `projects` (Public)

---

## 🔄 Re-Deploy (Update)

### Automatic (Recommended)

Setiap push ke `main` branch akan auto-deploy.

### Manual

1. Buka Vercel Dashboard
2. Pilih Project
3. Klik **Deployments** → **Redeploy**

---

## 🐛 Troubleshooting

### Build Error: Module not found

- Pastikan semua dependencies ada di `package.json`
- Coba: `npm install` lalu push ulang

### Environment Variables tidak terbaca

- Pastikan nama variable PERSIS sama
- Redeploy setelah tambah variable baru

### 500 Error di Production

- Cek Vercel logs untuk detail
- Pastikan Supabase project tidak pause

### CORS Error

- Tambahkan domain di Supabase → Authentication → URL Configuration

---

## 📊 Monitoring

### Vercel Analytics

1. Project → Analytics
2. Lihat traffic, errors, performance

### Supabase Monitoring

1. Dashboard → Reports
2. Cek database usage, API calls

---

## 💰 Pricing Notes

### Vercel Free Tier

- 100GB bandwidth/bulan
- Unlimited deployments
- 1 team member

### Supabase Free Tier

- 500MB database
- 1GB file storage
- 50,000 monthly active users
- **Pause after 1 week inactive** (reactivate via dashboard)
