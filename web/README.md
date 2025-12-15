# Enviel Photography

Platform fotografi modern "All-in-One" yang berfungsi sebagai portofolio publik yang estetis sekaligus sistem manajemen bisnis (Mini-ERP) yang powerful.

## 🚀 Overview

Project ini dibangun dengan **Next.js 15** (App Router) untuk performa maksimal dan SEO yang baik. Frontend publik difokuskan pada estetika dan konversi klien, sementara Admin Dashboard difokuskan pada produktivitas, manajemen order, dan kesehatan finansial.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & Magic UI
- **Database:** Supabase (PostgreSQL) - _Planned_
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** Recharts (untuk Dashboard Analytics)
- **Date Handling:** date-fns

## ✨ Fitur Utama

### 1. Landing Page (Public)

Halaman depan yang ditujukan untuk calon klien.

- **Gallery Showcase:** Layout Masonry Grid untuk portofolio (Wedding, Engagement, dll).
- **Pricing:** Kartu paket harga yang informatif.
- **Contact:** Form inquiry terintegrasi.
- **Responsive Design:** Tampilan optimal di Mobile & Desktop.

### 2. Admin Dashboard

Pusat kontrol untuk fotografer/admin.

- **CRM (Customer Relationship Management):**
  - **Orders Management:** Melacak status pesanan dari _Inquiry_ hingga _Completed_.
  - **Schedule:** Kalender visual untuk jadwal pemotretan.
- **Finance (Mini-ERP):**
  - **Invoice Designer:** Tools Drag & Drop untuk membuat invoice custom.
  - **Income & Expense:** Pencatatan arus kas dan chart profitabilitas.
- **Content Management:**
  - **Gallery Manager:** Upload dan kelola foto portofolio.
  - **Packages:** Update harga dan detail paket layanan.

## 📂 Struktur Project

```
src/
├── app/
│   ├── (dashboard)/       # Route Group untuk Admin Dashboard
│   │   ├── admin/         # Main Admin Entry
│   │   ├── orders/        # Manajemen Pesanan
│   │   ├── invoices/      # Invoice Designer & List
│   │   ├── finance/       # Laporan Keuangan
│   │   └── gallery/       # Manajemen Galeri
│   ├── login/             # Halaman Login Admin
│   └── page.tsx           # Landing Page Utama
├── components/
│   ├── ui/                # Komponen Low-level (Button, Input, dll - Shadcn)
│   └── ...                # Komponen Spesifik Fitur
├── lib/
│   └── utils.ts           # Utility helper (cn, formatters)
└── ...
```

## 🚀 Getting Started

1.  **Clone Repository**

    ```bash
    git clone https://github.com/username/Enviel-photo.git
    cd Enviel-photo/web
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Run Development Server**

    ```bash
    npm run dev
    ```

4.  **Open Browser**
    Buka [http://localhost:3000](http://localhost:3000) untuk melihat Landing Page.
    Buka [http://localhost:3000/admin](http://localhost:3000/admin) untuk mengakses Dashboard (Login required).

## 📝 Script Penting

- `npm run dev`: Menjalankan server development.
- `npm run build`: Build aplikasi untuk produksi.
- `npm run start`: Menjalankan server produksi.
- `npm run lint`: Cek isu linting/kode.

---

© 2025 Enviel Photography. Made by pal.
