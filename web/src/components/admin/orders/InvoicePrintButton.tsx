// src/components/admin/orders/InvoicePrintButton.tsx
"use client"

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InvoiceTemplate } from "@/components/admin/invoice/InvoiceTemplate";
import { Order as InvoiceOrder, BusinessSettings } from "@/types/invoice";

// === SETTINGS CONFIG (Temporary, later move to DB) ===
const appSettings: BusinessSettings = {
  brand_name: "Duaarah Photo",
  brand_color: "#1e293b", // Slate 800 - Classy Dark
  // brand_logo_url: "/logo.png", // Add logo in public folder if available
  bank_name: "BCA (Bank Central Asia)",
  bank_number: "123-456-7890",
  bank_holder: "Duaarah Photography",
  address: "Jakarta Selatan, DKI Jakarta",
  footer_note: "1. Booking Fee (DP) tidak dapat dikembalikan (Non-refundable).\n2. Pelunasan wajib dilakukan H-7 sebelum hari H.\n3. Reschedule diperbolehkan maksimal 1x (S&K Berlaku).",
};

// Interface for the 'Raw' order coming from the page
// We only need a subset to map it
interface RawOrder {
    id: string;
    client: string;
    contact?: string;
    date: string;
    location?: string;
    package: string;
    amount: string; // "Rp 5.000.000"
    paymentStatus: string; // 'paid' | 'unpaid'
    // New field we are adding
    paid_amount?: number; // Numeric from DB
    created_at?: string;
}

export default function InvoicePrintButton({ orderData }: { orderData: RawOrder }) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // --- ADAPTER: CONVERT RAW ORDER TO INVOICE ORDER ---
  const parseAmount = (str: string) => parseInt(str.replace(/[^0-9]/g, "")) || 0;
  
  const totalAmount = parseAmount(orderData.amount);
  
  // Logic Paid Amount:
  // 1. If 'paid_amount' exists (from DB), use it.
  // 2. Fallback: If status is 'paid', assume Full Payment.
  // 3. Fallback: If status is 'unpaid', assume 0.
  let finalPaid = orderData.paid_amount || 0;
  if (!orderData.paid_amount) {
      if (orderData.paymentStatus === 'paid') finalPaid = totalAmount;
  }

  const invoiceData: InvoiceOrder = {
      id: orderData.id,
      invoice_number: `INV-${orderData.id.replace('DA-', '')}`, // DA-2025 -> INV-2025
      created_at: orderData.created_at || new Date().toISOString(),
      client_name: orderData.client,
      client_phone: orderData.contact,
      event_date: orderData.date,
      event_location: orderData.location,
      total_amount: totalAmount,
      paid_amount: finalPaid,
      items: [
          {
              id: "1",
              name: orderData.package,
              description: "Photography Service Package",
              quantity: 1,
              price: totalAmount
          }
      ]
  };

  // Hook Print
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `INVOICE-${orderData.client}-${orderData.date}`,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50">
           <Printer className="w-4 h-4" />
           Cetak Invoice
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl h-[95vh] flex flex-col p-0 bg-slate-100 border-none sm:rounded-xl overflow-hidden">
        <DialogHeader className="p-4 bg-white border-b flex-none z-10 shadow-sm">
           <div className="flex justify-between items-center w-full pr-8">
             <div>
                <DialogTitle>Preview Invoice</DialogTitle>
                <DialogDescription className="hidden sm:block">Pastikan data sudah benar sebelum dicetak.</DialogDescription>
             </div>
             <Button onClick={() => handlePrint()} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <Printer className="w-4 h-4" />
                Print / Save PDF
             </Button>
           </div>
        </DialogHeader>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-auto bg-slate-200/50 flex justify-center py-8">
          {/* 
            Wrapper Scale Logic: 
            Original A4 Width = 210mm (~794px).
            We use CSS scale to fit it in smaller screens.
          */}
          <div className="scale-[0.5] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.85] xl:scale-100 origin-top transition-transform duration-200 ease-out mb-10">
             <div className="shadow-2xl">
              <InvoiceTemplate
                  ref={componentRef}
                  order={invoiceData}
                  settings={appSettings}
              />
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
