# Enviel Photography (Enviel Admin)

Platform manajemen bisnis fotografi "All-in-One" yang modern, menggabungkan portofolio publik yang estetis dengan sistem Admin Dashboard yang powerful.

## 🚀 Overview

Project ini dibangun dengan **Next.js 15** (App Router) dan **Supabase**. Frontend publik didesain untuk konversi klien dengan tampilan estetis, sedangkan Admin Dashboard difokuskan pada efisiensi operasional bisnis fotografi (CRM, Finance, Invoicing).

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Database:** Supabase (PostgreSQL, Auth, Storage)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** Geist Sans, Mono, Poppins (Global), Custom Font Support
- **PDF Generation:** React-to-Print

## ✨ Fitur Utama

### 1. Public Landing Page

- **Showcase Portfolio:** Tampilan Masonry Grid untuk hasil foto.
- **Pricing Packages:** Daftar paket harga yang transparan.
- **Responsive:** Optimal di desktop dan mobile.

### 2. Admin Dashboard (Mini-ERP)

- **Invoice Generator:** Buat, kustomisasi, dan cetak invoice profesional.
  - _Kustomisasi:_ Upload Logo, Pilih Warna Brand, Ganti Font (termasuk .TTF custom), dan Atur Layout Header (Vertikal/Horizontal).
- **Order Management (CRM):** Track status pesanan dari "Pending" hingga "Completed".
- **Team Management:** Kelola data tim dan penugasan job (Order Allocation).
- **Finance:** Catat pemasukan dan pengeluaran operasional.
- **Content Manager:** Upload foto ke galeri publik dan update harga paket tanpa coding.

## 📂 Struktur Project Terbaru

```text
d:\EnvielPhoto\
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/       # Secured Admin Area
│   │   │   │   ├── admin/         # Dashboard Overview
│   │   │   │   ├── orders/        # Order & Invoice Management
│   │   │   │   ├── finance/       # Laporan Keuangan
│   │   │   │   ├── gallery/       # Manajemen Portofolio
│   │   │   │   ├── settings/      # Pengaturan Invoice & Brand (NEW)
│   │   │   │   ├── team/          # Manajemen Tim
│   │   │   │   └── packages/      # Pengaturan Paket Harga
│   │   │   ├── login/             # Halaman Auth Admin
│   │   │   ├── layout.tsx         # Global Config (Fonts, Theme)
│   │   │   └── page.tsx           # Halaman Depan (Public)
│   │   ├── components/
│   │   │   ├── admin/             # Komponen Bisnis (InvoiceTemplate, Tables)
│   │   │   └── ui/                # Komponen Dasar (Shadcn UI)
│   │   └── lib/
│   │       ├── supabaseClient.ts  # Koneksi Database
│   │       └── utils.ts           # Utility & Formatters
│   ├── package.json
│   └── ...
├── migration_*.sql                # File Migrasi Individual
└── schema.sql                     # Single Source of Truth (Database Schema Lengkap)
```

## 🚀 Cara Install & Setup

### 1. Database Setup (Supabase)

Pastikan Anda memiliki instance Supabase. Buka SQL Editor di dashboard Supabase dan jalankan file:
`d:\EnvielPhoto\schema.sql`

File ini akan otomatis membuat:

- Tabel-tabel (Orders, Invoices, Team, Settings, dll)
- RLS Policies (Keamanan data)
- Storage Buckets (Untuk upload foto & font)

### 2. Local Development

1.  **Clone Repository**

    ```bash
    git clone https://github.com/username/Enviel-photo.git
    cd Enviel-photo/web
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Environment Variables**
    Buat file `.env.local` di folder `web/` dan isi dengan kredensial Supabase Anda:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

4.  **Jalankan Server**
    ```bash
    npm run dev
    ```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat hasil.

## 📝 Maintenance

- **Update Database:** Jika ada perubahan struktur DB, selalu update `schema.sql` agar sinkron.
- **Fonts:** Font global menggunakan `next/font`. Font custom invoice disimpan di Supabase Storage bucket `branding`.

---

© 2025 Enviel Photography.
