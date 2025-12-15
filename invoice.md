Definisi Tipe Data
Buat file ini (atau gabungkan di types/index.ts) agar struktur data Order dan Settings jelas.

TypeScript

// types/invoice.ts

export interface OrderItem {
id: string;
name: string; // Misal: "Engagement Session Package B"
description?: string; // Misal: "4 Hours, 50 Edited Photos"
quantity: number;
price: number;
}

export interface Order {
id: string;
invoice_number: string; // "INV-2025-001"
created_at: string;
client_name: string;
client_email: string;
client_phone?: string;
event_date?: string; // Tanggal pemotretan
event_location?: string;

// Finance Logic
total_amount: number; // Total Harga Deal
paid_amount: number; // Total Uang Masuk (DP/Full)

items: OrderItem[];
}

export interface BusinessSettings {
brand_name: string;
brand_logo_url?: string; // URL dari Supabase Storage
brand_color: string; // HEX Code (e.g., "#d4af37")
bank_name: string;
bank_number: string;
bank_holder: string;
footer_note?: string; // Terms & Conditions
} 2. Komponen Visual Invoice (InvoiceTemplate.tsx)
Ini adalah komponen utama yang desainnya mirip kertas A4. Logic perhitungan status (Lunas/DP/Unpaid) terjadi di sini secara otomatis.

Prerequisites: Pastikan sudah install shadcn components: npx shadcn@latest add table separator badge

TypeScript

// components/admin/invoice/InvoiceTemplate.tsx
import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Order, BusinessSettings } from '@/types/invoice';

interface InvoiceProps {
order: Order;
settings: BusinessSettings;
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceProps>(
({ order, settings }, ref) => {

    // --- 1. LOGIC KALKULASI KEUANGAN ---
    const subTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    // Jika ada diskon manual, bisa ditambahkan logicnya disini
    const grandTotal = order.total_amount || subTotal;
    const amountPaid = order.paid_amount || 0;
    const amountDue = grandTotal - amountPaid;

    // --- 2. LOGIC STATUS PEMBAYARAN ---
    let paymentStatus = "UNPAID";
    let statusColor = "bg-red-100 text-red-700 border-red-200"; // Default Merah

    if (amountDue <= 0) {
      paymentStatus = "PAID (LUNAS)";
      statusColor = "bg-green-100 text-green-700 border-green-200";
    } else if (amountPaid > 0) {
      paymentStatus = "PARTIAL (DP)";
      statusColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    // --- 3. THEME COLOR ---
    const themeColor = settings.brand_color || "#000000";

    // Format Rupiah Helper
    const toRupiah = (val: number) =>
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    return (
      // Container A4 (Lebar fix 210mm, min-height 297mm)
      <div
        ref={ref}
        className="w-[210mm] min-h-[297mm] mx-auto bg-white p-12 shadow-none text-slate-900 font-sans"
        style={{ boxSizing: 'border-box' }}
      >

        {/* === HEADER === */}
        <div className="flex justify-between items-start mb-8">
          {/* Logo Section */}
          <div className="w-1/2 pr-4">
            {settings.brand_logo_url ? (
              <div className="relative w-40 h-20 mb-4">
                {/* Gunakan unoptimized agar aman saat print/pdf generation */}
                <Image
                  src={settings.brand_logo_url}
                  alt="Logo"
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            ) : (
              <h1 className="text-3xl font-bold tracking-widest uppercase">{settings.brand_name}</h1>
            )}
            <p className="text-sm text-slate-500 mt-2">Professional Photography Services</p>
            <p className="text-sm text-slate-500">Jakarta, Indonesia</p>
          </div>

          {/* Invoice Meta Section */}
          <div className="text-right w-1/2">
            <h2 className="text-5xl font-extralight tracking-wide mb-2" style={{ color: themeColor }}>
              INVOICE
            </h2>
            <div className="space-y-1">
              <p className="font-mono text-slate-600 font-medium">#{order.invoice_number}</p>
              <p className="text-sm text-slate-500">
                Issued: {format(new Date(order.created_at), 'dd MMMM yyyy', { locale: id })}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <Badge variant="outline" className={`px-3 py-1 text-xs font-bold rounded-sm ${statusColor}`}>
                {paymentStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Separator dengan warna tema */}
        <div className="w-full h-1 mb-8" style={{ backgroundColor: themeColor, opacity: 0.8 }}></div>

        {/* === INFO SECTION (BILL TO & EVENT) === */}
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div className="bg-slate-50 p-6 rounded-sm border-l-4" style={{ borderColor: themeColor }}>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Bill To</h3>
            <p className="text-lg font-bold text-slate-800">{order.client_name}</p>
            <p className="text-sm text-slate-600">{order.client_email}</p>
            {order.client_phone && <p className="text-sm text-slate-600">{order.client_phone}</p>}
          </div>

          <div className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 text-right">Project Details</h3>
            <div className="space-y-2 text-right">
              <div>
                 <span className="text-xs text-slate-400 mr-2">Event Date</span>
                 <span className="font-medium text-slate-700">
                   {order.event_date ? format(new Date(order.event_date), 'dd MMMM yyyy', { locale: id }) : '-'}
                 </span>
              </div>
              <div>
                 <span className="text-xs text-slate-400 mr-2">Location</span>
                 <span className="font-medium text-slate-700">{order.event_location || 'Jakarta'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* === TABLE ITEMS === */}
        <div className="mb-8">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-slate-800 hover:bg-transparent">
                <TableHead className="w-[50%] text-slate-900 font-bold uppercase text-xs tracking-wider">Description</TableHead>
                <TableHead className="text-center text-slate-900 font-bold uppercase text-xs tracking-wider">Qty</TableHead>
                <TableHead className="text-right text-slate-900 font-bold uppercase text-xs tracking-wider">Price</TableHead>
                <TableHead className="text-right text-slate-900 font-bold uppercase text-xs tracking-wider">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, idx) => (
                <TableRow key={idx} className="border-b border-slate-100 hover:bg-transparent">
                  <TableCell className="py-4">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                  </TableCell>
                  <TableCell className="text-center py-4">{item.quantity}</TableCell>
                  <TableCell className="text-right py-4 font-mono text-slate-600">{toRupiah(item.price)}</TableCell>
                  <TableCell className="text-right py-4 font-mono font-medium text-slate-800">
                    {toRupiah(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* === SUMMARY / TOTALS === */}
        <div className="flex justify-end mb-16">
          <div className="w-[45%]">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-mono font-medium">{toRupiah(subTotal)}</span>
              </div>

              {/* DP / Paid Amount Row */}
              <div className="flex justify-between text-sm text-red-500">
                <span>Less: Payment / DP</span>
                <span className="font-mono font-medium">({toRupiah(amountPaid)})</span>
              </div>

              <Separator />

              {/* Amount Due Highlight */}
              <div
                className="flex justify-between items-center p-3 rounded text-white mt-2"
                style={{ backgroundColor: themeColor }}
              >
                <span className="font-bold text-sm tracking-wide uppercase">Amount Due</span>
                <span className="font-bold text-xl font-mono">{toRupiah(amountDue > 0 ? amountDue : 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* === FOOTER (BANK & TERMS) === */}
        <div className="mt-auto pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-8 text-sm text-slate-600">
            {/* Payment Info */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">Payment Method</h4>
              <p className="font-medium">{settings.bank_name}</p>
              <p className="font-mono text-slate-800 text-lg tracking-wide my-1">{settings.bank_number}</p>
              <p className="text-xs">A/N {settings.bank_holder}</p>
            </div>

            {/* Terms / Notes */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">Terms & Notes</h4>
              <p className="whitespace-pre-line text-xs leading-relaxed text-slate-500">
                {settings.footer_note || "Pembayaran pelunasan wajib dilakukan maksimal H-3 sebelum acara.\nTerima kasih telah mempercayakan momen Anda kepada kami."}
              </p>
            </div>
          </div>

          <div className="text-center mt-12 pt-4">
             <p className="text-xs text-slate-300">© 2025 {settings.brand_name} System</p>
          </div>
        </div>

      </div>
    );

}
);

InvoiceTemplate.displayName = "InvoiceTemplate"; 3. Cara Pasang di Halaman Order (PrintButton.tsx)
Ini adalah komponen tombol yang akan memunculkan dialog preview dan fitur print. Pasang komponen ini di halaman detail order kamu.

Install tambahan: npm install react-to-print

TypeScript

// components/admin/orders/InvoicePrintButton.tsx
"use client"

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, Eye } from "lucide-react"; // Icon
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvoiceTemplate } from "@/components/admin/invoice/InvoiceTemplate"; // Import yang diatas
import { Order, BusinessSettings } from "@/types/invoice";

// === CONTOH DATA SETTINGS (Nanti ambil dari Database Supabase) ===
const dummySettings: BusinessSettings = {
brand_name: "Duaarah Photography",
brand_color: "#c29b40", // Warna Gold/Emas estetik
brand_logo_url: "/images/logo-placeholder.png", // Ganti kalau ada
bank_name: "BCA (Bank Central Asia)",
bank_number: "8820-1234-5678",
bank_holder: "PT Duaarah Kreatif",
footer_note: "1. DP tidak dapat dikembalikan.\n2. Pelunasan H-7 sebelum acara.\n3. File diedit max 14 hari kerja.",
};

export default function InvoicePrintButton({ orderData }: { orderData: Order }) {
const componentRef = useRef<HTMLDivElement>(null);
const [isOpen, setIsOpen] = useState(false);

// Hook Print
const handlePrint = useReactToPrint({
contentRef: componentRef,
documentTitle: `INV-${orderData.invoice_number}-${orderData.client_name}`,
onAfterPrint: () => console.log("Printed successfully"),
});

return (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
<DialogTrigger asChild>
<Button variant="outline" className="gap-2">
<Eye className="w-4 h-4" />
Preview & Print Invoice
</Button>
</DialogTrigger>

      {/* Gunakan max-w-4xl agar previewnya besar */}
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 bg-slate-100">
        <DialogHeader className="p-4 bg-white border-b">
           <div className="flex justify-between items-center">
             <DialogTitle>Invoice Preview</DialogTitle>
             <Button onClick={() => handlePrint()} className="bg-slate-900 text-white gap-2">
                <Printer className="w-4 h-4" />
                Print / Save PDF
             </Button>
           </div>
        </DialogHeader>

        {/* Area Scrollable untuk Preview */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-500/10 flex justify-center">
          {/* Wrapper scale agar pas di layar laptop kecil */}
          <div className="scale-75 origin-top md:scale-100 transition-transform">
             {/* Render Template Disini */}
             <InvoiceTemplate
                ref={componentRef}
                order={orderData}
                settings={dummySettings}
             />
          </div>
        </div>
      </DialogContent>
    </Dialog>

);
}
Cara Menggunakan
Di halaman Detail Order kamu (app/(dashboard)/admin/orders/[id]/page.tsx), cukup panggil:

TypeScript

import InvoicePrintButton from "@/components/admin/orders/InvoicePrintButton";

// ... fetch data order ...

return (

  <div className="header-actions">
     {/* Tombol lain... */}
     <InvoicePrintButton orderData={fetchedOrder} />
  </div>
)
Apa yang otomatis terjadi dengan kode ini?
Status Warna: Jika kamu input paid_amount: 100000 dan total: 5000000, invoice otomatis ada badge kuning PARTIAL (DP).

Sisa Tagihan: Otomatis menghitung Amount Due: Rp 4.900.000.

Branding: Warna garis, warna teks "INVOICE", dan warna background total akan mengikuti settings.brand_color. Jika kamu ganti kode warna di database, invoice langsung berubah tema.
