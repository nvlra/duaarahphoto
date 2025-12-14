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
  brand_name: "Enviel Admin",
  brand_color: "#1e293b", // Slate 800 - Classy Dark
  // brand_logo_url: "/logo.png", // Add logo in public folder if available
  bank_name: "BCA (Bank Central Asia)",
  bank_number: "4210000000",
  bank_holder: "Noval RIzki",
  address: "Jakarta Timur, DKI Jakarta",
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
      invoice_number: orderData.id, // Use actual DB ID
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
        <Button size="sm" variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800/50">
           <Printer className="w-4 h-4" />
           Cetak Invoice
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[85vw] h-[80vh] flex flex-col p-0 bg-slate-100 dark:bg-neutral-950 border-none sm:rounded-xl overflow-hidden">
        <DialogHeader className="px-4 py-3 bg-white dark:bg-neutral-900 border-b dark:border-neutral-800 flex-none z-10 shadow-sm">
           <div className="flex justify-between items-center w-full">
             <div>
                <DialogTitle>Preview Invoice</DialogTitle>
                <DialogDescription className="hidden sm:block text-xs text-muted-foreground mt-0.5">Pastikan data sudah benar sebelum dicetak.</DialogDescription>
             </div>
             <div className="flex items-center gap-2">
                 <Button variant="ghost" className="flex" onClick={() => setIsOpen(false)}>
                     Batal
                 </Button>
                 <Button onClick={() => handlePrint()} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-9">
                    <Printer className="w-4 h-4" />
                    Print / Save PDF
                 </Button>
             </div>
           </div>
        </DialogHeader>

        {/* Scrollable Preview Area */}
        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-auto bg-slate-300/30 dark:bg-slate-900/50 flex justify-center p-4 sm:p-8">
          {/* 
            Wrapper Scale Logic: 
            We use a fixed-size container (Outer) to define the layout footprint, 
            and an absolute-positioned inner container for the scaled content.
            This prevents 'ghost' whitespace and scrollbars caused by the original A4 size.
            
            Dimensions based on A4 (794x1123px) * Scale Factor
            Scales: 0.45, 0.55, 0.6, 0.65, 0.7
          */}
          <div className="relative bg-white shadow-2xl transition-all duration-200 ease-out origin-top-left
             w-[358px] h-[506px] 
             sm:w-[437px] sm:h-[618px] 
             md:w-[477px] md:h-[674px] 
             lg:w-[517px] lg:h-[730px] 
             xl:w-[556px] xl:h-[787px]
             flex-none my-auto overflow-hidden
          ">
             <div className="absolute top-0 left-0 origin-top-left 
                scale-[0.45] sm:scale-[0.55] md:scale-[0.6] lg:scale-[0.65] xl:scale-[0.7]
             ">
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
