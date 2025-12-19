# Migration Guide

## Database Schema Updates

---

## 📋 Migration Files

Semua file migration ada di folder `/web/`:

- `schema.sql` - Schema lengkap (untuk fresh install)
- `dummy_data.sql` - Data contoh

---

## 🆕 Fresh Installation (Database Baru)

```sql
-- 1. Jalankan schema.sql di Supabase SQL Editor
-- Copy seluruh isi schema.sql dan Run

-- 2. Jalankan dummy_data.sql untuk data contoh (opsional)
-- Copy seluruh isi dummy_data.sql dan Run
```

---

## 🔄 Migration dari Versi Lama

### Jika menambah kolom baru:

```sql
-- Contoh: Tambah kolom 'notes' ke orders
ALTER TABLE public.orders ADD COLUMN notes TEXT;
```

### Jika menambah tabel baru:

```sql
-- 1. Buat tabel
CREATE TABLE public.nama_tabel (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT nama_tabel_pkey PRIMARY KEY (id)
);

-- 2. Enable RLS
ALTER TABLE public.nama_tabel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nama_tabel FORCE ROW LEVEL SECURITY;

-- 3. Buat policy
CREATE POLICY "nama_tabel_auth" ON public.nama_tabel
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

### Jika mengubah tipe kolom:

```sql
-- Contoh: Ubah price dari INTEGER ke NUMERIC
ALTER TABLE public.packages
  ALTER COLUMN price TYPE NUMERIC USING price::NUMERIC;
```

---

## 🗑️ Rollback Migration

### Hapus kolom:

```sql
ALTER TABLE public.orders DROP COLUMN IF EXISTS notes;
```

### Hapus tabel:

```sql
DROP TABLE IF EXISTS public.nama_tabel CASCADE;
```

### Hapus policy:

```sql
DROP POLICY IF EXISTS "nama_policy" ON public.nama_tabel;
```

---

## 📝 Best Practices

1. **Selalu backup** sebelum migration
2. **Test di local/staging** sebelum production
3. **Dokumentasikan** setiap perubahan
4. **Gunakan IF EXISTS/IF NOT EXISTS** untuk keamanan
5. **Jangan lupa RLS** untuk tabel baru

---

## 📁 Contoh File Migration

Simpan migration di folder terpisah:

```
/migrations/
  001_initial_schema.sql
  002_add_notes_to_orders.sql
  003_add_projects_table.sql
```

Format nama: `NNN_deskripsi_singkat.sql`
