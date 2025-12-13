Project Website Duaarah Photography

- NextJS 15
- Landing Page
- Dashboard Admin
- Shadcn UI
- Magic UI
- Supabase/PostgreSQL

Alur Project

1. Landing Page

- Home
- About
- Contact
- Gallery
  > Wedding
  > Engagement
  > Birth
  > Graduation
  > Portrait
  > Family
  > Event
- Pricing
- Contact

2. Dashboard Admin

- Login
- Manage User
- Manage Gallery
- Manage Pricing
- Manage About
- Manage Contact
- Manage Order
- Manage Schedule
- Manage Receipt
- Manage Pengeluaran
- Statement Monthly/Yearly
- Support Export CSV

# Project Design Document: Duaarah Photography

## 1. Project Overview

Platform website fotografi modern "All-in-One" yang berfungsi sebagai:

1.  **Frontend (Public):** Portofolio estetis untuk menarik klien.
2.  **Backend (Admin):** Sistem Mini-ERP untuk manajemen order, jadwal, dan kesehatan finansial bisnis.

## 2. Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Backend Logic:** Next.js Server Actions
- **Database & Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Animations:** Magic UI (untuk Landing Page & Gallery)
- **Icons:** Lucide React
- **Utilities:** `nanoid` (untuk generate Custom ID `DA-XXXXXXXX`)

---

## 3. Fitur Landing Page (Public & Client)

_Fokus: Estetika Visual & Konversi._

### A. Halaman Utama

1.  **Home:** Hero section (Carousel/Video), USP, CTA "Book Now".
2.  **About:** Profil fotografer, visi "Duaarah".
3.  **Gallery (Portfolio):**
    - Layout Masonry Grid (Pinterest style).
    - Filter: Wedding, Engagement, Birth, Graduation, Portrait, Family, Event.
    - _Interaction:_ Lightbox view + Zoom.
4.  **Pricing:** Card paket harga.
5.  **Contact:** Form inquiry & Map.

### B. Client Area (Login)

- **Access:** Login via Kode Unik / Email.
- **Private Gallery:** Klien melihat hasil foto spesifik mereka.
- **Selection:** (Future dev) Fitur memilih foto untuk diedit.

---

## 4. Fitur Dashboard Admin (Internal)

_Fokus: Kecepatan Input & Analisa Data._

### A. Core Management

- **Login Admin:** Secured via Supabase Auth.
- **Manage Content:** Edit teks About/Contact, Update Pricing Packages.
- **Manage Gallery:** Upload foto portofolio, hapus foto, set kategori.

### B. CRM (Customer Relationship Management)

- **Manage Order (Kanban / List View):**
  - Menggunakan **Custom ID**: `DA-XXXXXXXXXXXXXX`.
  - Flow Status: _Inquiry_ -> _Booked (DP)_ -> _Photoshoot_ -> _Editing_ -> _Delivery_ -> _Completed_.
- **Manage Schedule:** Kalender visual untuk melihat tanggal booking.
- **Manage Receipt:** Generate Invoice sederhana (PDF View/Download).

### C. Finance & Expense (Mini-ERP)

- **Manage Pengeluaran (Simplified Flow):**
  - **Tanpa Upload Bukti Wajib:** Fokus pada input data cepat (text-based).
  - **Input Form:** Judul, Nominal, Tanggal, Kategori, Deskripsi, **Link to Order (Optional)**.
  - **Tujuan:** Menghitung _Net Profit_ per proyek.
- **Financial Reports:**
  - **Profit & Loss Chart:** Pemasukan vs Pengeluaran Bulanan.
  - **Project Profitability:** Analisa keuntungan bersih dari setiap job.
  - **Export:** CSV support.

---
