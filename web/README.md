# Enviel Photography Web & Admin Dashboard

A powerful, all-in-one **Business Management System (BMS)** & **Headless CMS** designed specifically for creative studios and photography businesses.

This application acts as the central nervous system for **Enviel Photography**, bridging the gap between a stunning public-facing portfolio and a robust internal ERP (Enterprise Resource Planning) for managing operations.

## System Analysis

This project is a hybrid solution that combines:

1.  **Headless CMS (Content Management System)**:
    - Allows dynamic management of the public Landing Page (Hero, About, Services, etc.).
    - Host a rich Portfolio with multi-image galleries and SEO-friendly slugs.
2.  **Creative ERP / CRM**:
    - **Order Management**: Full lifecycle tracking from "Pending" to "Completed", including payment status (Partial/Paid).
    - **Finance & Revenue**: Automated profit/loss tracking, expense categorization, and revenue visualization.
    - **Team & HR**: Manage photographers, editors, and assistants with role-based allocations per project.
    - **Product/Service Management**: Configure pricing tiers and packages dynamically.

## Tech Stack

Built with a modern, type-safe, and high-performance stack:

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router) - Server Side Rendering (SSR) & Partial Prerendering.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Strict type safety for fewer bugs.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) - Beautiful, responsive, and accessible UI components.
- **Backend / Database**: [Supabase](https://supabase.com/) - PostgreSQL Database, Auth, and Storage.
- **State & Animations**: React Hooks & [Framer Motion](https://www.framer.com/motion/) - For fluid interactions.
- **Icons**: [Lucide React](https://lucide.dev/) - Consistent and lightweight iconography.

## Features

- **Public Landing Page**: Dynamic Hero, About, Portfolio, Services, Testimonials, and Contact.
- **Portfolio Manager**: Admin interface to manage projects with rich text and multi-image uploads.
- **Order Management**: Track client bookings, status, and payment details.
- **Finance & Reporting**: Monitor revenue, expenses, and profit margins.
- **Team Management**: Manage team members and roles.
- **Package & Category Manager**: Configure service offerings dynamically.

---

## Deployment & Setup Guide

### 1. Prerequisites

- **Node.js 18+** installed.
- **Supabase Account**: Create a new project at [supabase.com](https://supabase.com).

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup (One-Click Schema)

This project uses a consolidated schema file to set up all necessary tables, policies, and storage buckets.

1.  Go to your Supabase Project Dashboard.
2.  Navigate to **SQL Editor**.
3.  Open the `schema.sql` file provided in this repository (or copy its content).
4.  Paste the SQL query into the editor and click **Run**.

**What this script does:**

- Creates tables: `page_sections`, `projects`, `team_members`, `orders`, `packages`, `expenses`, etc.
- Enables **Row Level Security (RLS)** policies for security.
- Sets up Storage Buckets: `landing-assets` and `portfolio`.
- Inserts default data for the Landing Page and Categories.

> **Note:** The script is idempotent. You can run it multiple times safely; it will not duplicate existing tables or buckets.

### 4. Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Deployment

### Option A: Vercel (Recommended)

1.  Push your code to **GitHub**.
2.  Import the project into **Vercel**.
3.  Add the **Environment Variables** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel Project Settings.
4.  Deploy!

### Option B: VPS (Ubuntu/Nginx)

If migrating from Vercel to a VPS:

1.  **Prepare the VPS**: Install Node.js, NPM, and PM2.
2.  **Clone Repository**:
    ```bash
    git clone https://github.com/your-repo/project.git
    cd project
    npm install
    ```
3.  **Build the App**:
    ```bash
    npm run build
    ```
4.  **Start with PM2**:
    ```bash
    pm2 start npm --name "enviel-web" -- start
    ```
5.  **Configure Nginx** as a reverse proxy to port 3000.

---

## Migration Guide (Update Database)

If you are updating the application or deploying a new version that requires database changes:

1.  Simply re-run the updated `schema.sql` in Supabase SQL Editor.
2.  The script allows safe updates (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`) so your existing data remains safe while new tables or columns are added.

---

## Project Structure

- `/src/app/(public)`: Public facing pages (Landing Page & Portfolio). Uses independent Theme Provider.
- `/src/app/admin`: Admin dashboard pages (protected). Uses isolated `admin-theme` Provider.
- `/src/components/ui`: Reusable UI components (buttons, inputs, etc.).
- `/src/lib`: Utility functions and Supabase client.
