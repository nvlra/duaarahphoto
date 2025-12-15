// src/components/admin/invoice/InvoiceTemplate.tsx
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
    const grandTotal = order.total_amount || subTotal;
    const amountPaid = order.paid_amount || 0;
    const amountDue = grandTotal - amountPaid;

    // --- 2. LOGIC STATUS PEMBAYARAN ---
    let paymentStatus = "UNPAID";
    let statusColor = "bg-red-100 text-red-700 border-red-200"; // Default Merah

    // Logic: 
    // - Paid >= Total -> LUNAS
    // - Paid > 0 tapi < Total -> PARTIAL
    // - Paid == 0 -> UNPAID
    if (amountDue <= 0) {
      paymentStatus = "LUNAS (PAID)";
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
      // Gunakan 'print:w-full print:h-full' agar saat print dia full page
      <div
        ref={ref}
        className="w-[210mm] min-h-[297mm] mx-auto bg-white p-12 shadow-none text-slate-900 font-sans leading-relaxed"
        style={{ boxSizing: 'border-box' }}
      >

        {/* === HEADER === */}
        <div className="flex justify-between items-start mb-8">
          <div className="w-1/2 pr-4 flex flex-col gap-1">
            <div className={`flex ${settings.header_layout === 'horizontal' ? 'flex-row items-center gap-4' : 'flex-col items-start gap-2'} mb-2`}>
              {settings.brand_logo_url && (
                <div className={`relative w-full ${settings.header_layout === 'horizontal' ? 'max-w-[80px] h-16' : 'max-w-[200px] h-20'}`}>
                  <Image
                    src={settings.brand_logo_url}
                    alt="Logo"
                    fill
                    className="object-contain object-left"
                    unoptimized
                  />
                </div>
              )}
              <h1 className="text-2xl font-bold tracking-widest uppercase leading-none">{settings.brand_name}</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">Professional Photography Services</p>
            <p className="text-sm text-slate-500">{settings.address || "Jakarta, Indonesia"}</p>
          </div>

          {/* Invoice Meta Section */}
          <div className="text-right w-1/2">
            <h2 className="text-5xl font-extralight tracking-wide mb-2" style={{ color: themeColor }}>
              INVOICE
            </h2>
            <div className="space-y-1">
              <p className="font-mono text-slate-600 font-medium text-lg">#{order.invoice_number}</p>
              <p className="text-sm text-slate-500">
                Issued: {format(new Date(order.created_at), 'dd MMMM yyyy', { locale: id })}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <Badge variant="outline" className={`px-4 py-1.5 text-sm font-bold rounded-sm border ${statusColor}`}>
                {paymentStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Separator dengan warna tema */}
        <div className="w-full h-1 mb-10" style={{ backgroundColor: themeColor, opacity: 0.8 }}></div>

        {/* === INFO SECTION (BILL TO & EVENT) === */}
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div className="bg-slate-50 p-6 rounded-sm border-l-4" style={{ borderColor: themeColor }}>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Bill To</h3>
            <p className="text-xl font-bold text-slate-800 mb-1">{order.client_name}</p>
            <p className="text-sm text-slate-600">{order.client_email || '-'}</p>
            <p className="text-sm text-slate-600">{order.client_phone || '-'}</p>
          </div>

          <div className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4 text-right">Project Details</h3>
            <div className="space-y-3 text-right">
              <div>
                 <span className="text-xs text-slate-400 mr-3 uppercase tracking-wide">Event Date</span>
                 <span className="font-medium text-slate-800 text-lg">
                   {order.event_date ? format(new Date(order.event_date), 'dd MMMM yyyy', { locale: id }) : '-'}
                 </span>
              </div>
              <div>
                 <span className="text-xs text-slate-400 mr-3 uppercase tracking-wide">Location</span>
                 <span className="font-medium text-slate-800">{order.event_location || 'Jakarta'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* === TABLE ITEMS === */}
        <div className="mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-slate-800 hover:bg-transparent">
                <TableHead className="w-[50%] text-slate-900 font-bold uppercase text-xs tracking-wider py-4">Description</TableHead>
                <TableHead className="text-center text-slate-900 font-bold uppercase text-xs tracking-wider py-4">Qty</TableHead>
                <TableHead className="text-right text-slate-900 font-bold uppercase text-xs tracking-wider py-4">Price</TableHead>
                <TableHead className="text-right text-slate-900 font-bold uppercase text-xs tracking-wider py-4">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, idx) => (
                <TableRow key={idx} className="border-b border-slate-100 hover:bg-transparent">
                  <TableCell className="py-6 align-top">
                    <p className="font-bold text-slate-800 text-base">{item.name}</p>
                    {item.description && (
                       <p className="text-sm text-slate-500 mt-1 line-clamp-3 leading-snug">{item.description}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-center py-6 align-top font-medium text-slate-700">{item.quantity}</TableCell>
                  <TableCell className="text-right py-6 align-top font-mono text-slate-600">{toRupiah(item.price)}</TableCell>
                  <TableCell className="text-right py-6 align-top font-mono font-bold text-slate-800">
                    {toRupiah(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* === SUMMARY / TOTALS === */}
        <div className="flex justify-end mb-20">
          <div className="w-[50%]">
            <div className="space-y-4">
              <div className="flex justify-between text-base px-2">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-mono font-medium text-slate-800">{toRupiah(subTotal)}</span>
              </div>

              {/* DP / Paid Amount Row */}
              <div className="flex justify-between text-base px-2 text-slate-600">
                <span>Less: Payment / DP</span>
                <span className="font-mono font-medium text-red-500">({toRupiah(amountPaid)})</span>
              </div>

              <Separator className="bg-slate-200 my-2" />

              {/* Amount Due Highlight */}
              <div
                className="flex justify-between items-center p-4 rounded text-white shadow-sm"
                style={{ backgroundColor: themeColor }}
              >
                <span className="font-bold text-sm tracking-widest uppercase">Amount Due</span>
                <span className="font-bold text-2xl font-mono">{toRupiah(amountDue > 0 ? amountDue : 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* === FOOTER (BANK & TERMS) === */}
        <div className="mt-auto pt-10 border-t-2 border-slate-100">
          <div className="grid grid-cols-2 gap-12 text-sm text-slate-600">
            {/* Payment Info */}
            <div>
              <h4 className="font-bold text-slate-900 mb-3 uppercase text-xs tracking-wider border-b pb-2 inline-block">Payment Method</h4>
              <div>
                 <p className="font-medium text-slate-800">{settings.bank_name}</p>
                 <p className="font-mono text-slate-900 text-xl tracking-wide my-1 font-bold">{settings.bank_number}</p>
                 <p className="text-sm text-slate-500">A/N {settings.bank_holder}</p>
              </div>
            </div>

            {/* Terms / Notes */}
            <div>
              <h4 className="font-bold text-slate-900 mb-3 uppercase text-xs tracking-wider border-b pb-2 inline-block">Terms & Notes</h4>
              <p className="whitespace-pre-line text-xs leading-6 text-slate-500">
                {settings.footer_note || "Pembayaran pelunasan wajib dilakukan maksimal H-3 sebelum acara.\nTerima kasih telah mempercayakan momen Anda kepada kami."}
              </p>
            </div>
          </div>

          <div className="text-center mt-16 pt-6 border-t border-dashed border-slate-200">
             <p className="text-xs text-slate-400 font-medium">© 2025 {settings.brand_name} System | Generated automatically</p>
          </div>
        </div>

      </div>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";
