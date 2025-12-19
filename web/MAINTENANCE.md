# Maintenance Guide

## Enviel Photography Dashboard

---

## 📅 Jadwal Maintenance

| Task                         | Frekuensi | Waktu    |
| ---------------------------- | --------- | -------- |
| Security check (`npm audit`) | Bulanan   | 2 menit  |
| Update dependencies          | 3 Bulan   | 15 menit |
| Backup database              | Bulanan   | 5 menit  |
| Review logs                  | Bulanan   | 10 menit |

---

## 🔒 Security Check (Bulanan)

```bash
cd d:\DuaarahPhoto\web

# Cek vulnerability
npm audit

# Auto-fix jika ada
npm audit fix

# Jika ada yang tidak bisa auto-fix
npm audit fix --force  # Hati-hati, bisa breaking
```

---

## 🔄 Update Dependencies (3 Bulan Sekali)

### Step 1: Backup

```bash
git checkout -b backup/sebelum-update
git push origin backup/sebelum-update
```

### Step 2: Cek Outdated

```bash
npm outdated
```

### Step 3: Update Aman (Patch Only)

```bash
npm update
```

### Step 4: Test

```bash
npm run dev
# Cek: Login, Dashboard, Orders, Finance, Landing Page
```

### Step 5: Commit

```bash
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push
```

### Rollback Jika Error

```bash
git checkout backup/sebelum-update
npm install
```

---

## 💾 Backup Database (Bulanan)

### Via Supabase Dashboard

1. Buka **Supabase Dashboard** → **Settings** → **Database**
2. Klik **Download backup**
3. Simpan file `.sql` di tempat aman

### Via SQL (Manual Export)

```sql
-- Di SQL Editor, jalankan untuk export orders
SELECT * FROM orders;
-- Copy hasil ke CSV
```

---

## 📊 Monitor & Logs

### Vercel (jika deployed)

1. Buka [vercel.com/dashboard](https://vercel.com)
2. Pilih project → **Functions** → **Logs**
3. Cek error 500 atau anomali

### Supabase

1. Buka **Supabase Dashboard** → **Logs**
2. Filter by **Error** untuk cek masalah
3. Cek **Database** → **Query Performance**

---

## 🔧 Troubleshooting

### Error "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error Supabase Connection

1. Cek `.env.local` masih valid
2. Cek Supabase project status (bisa pause jika free tier)
3. Restart: `npm run dev`

### Build Error di Vercel

1. Cek Vercel logs untuk detail error
2. Pastikan environment variables sudah diset
3. Coba re-deploy: Push commit baru

---

## 🤖 Otomatis dengan Dependabot

Buat file `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/web"
    schedule:
      interval: "monthly"
    open-pull-requests-limit: 5
```

GitHub akan otomatis buat PR untuk update dependencies.
