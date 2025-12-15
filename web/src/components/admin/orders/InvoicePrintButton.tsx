// src/components/admin/orders/InvoicePrintButton.tsx
"use client"

import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, ZoomIn, ZoomOut, Loader2 } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InvoiceTemplate } from "@/components/admin/invoice/InvoiceTemplate";
import { Order as InvoiceOrder, BusinessSettings } from "@/types/invoice";
import { supabase } from "@/lib/supabaseClient";

// Interface for the 'Raw' order coming from the page
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
  const [zoom, setZoom] = useState(0.65); // Default start scale
  
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  const fetchSettings = async () => {
      setLoading(true);
      const { data } = await supabase.from('invoice_settings').select('*').single();
      if (data) {
          setSettings({
            brand_name: data.brand_name || "Enviel Admin",
            brand_logo_url: data.brand_logo_url || undefined,
            brand_color: data.brand_color || "#1e293b",
            bank_name: data.bank_name || "",
            bank_number: data.bank_number || "",
            bank_holder: data.bank_holder || "",
            address: data.address || "",
            footer_note: data.footer_note || "",
            header_layout: data.header_layout || "vertical",
            brand_font_family: data.brand_font_family || "Inter",
            brand_custom_font_url: data.brand_custom_font_url || ""
          });
      } else {
          // Fallback if no settings found
          setSettings({
            brand_name: "Enviel Admin (Default)",
            brand_color: "#1e293b",
            bank_name: "-",
            bank_number: "-",
            bank_holder: "-",
            address: "-",
            footer_note: "Harap atur setting invoice di menu Pengaturan."
          });
      }
      setLoading(false);
  }

  // Fetch Settings on Open
  useEffect(() => {
    if (isOpen && !settings) {
        // eslint-disable-next-line
        fetchSettings();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- ADAPTER: CONVERT RAW ORDER TO INVOICE ORDER ---
  const parseAmount = (str: string) => parseInt(str.replace(/[^0-9]/g, "")) || 0;
  
  const totalAmount = parseAmount(orderData.amount);
  
  // Logic Paid Amount:
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
             
             {/* ACTIONS */}
             <div className="flex items-center gap-2">
                 {/* ZOOM CONTROLS */}
                 <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-md p-0.5 mr-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}>
                        <ZoomOut className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}>
                        <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                 </div>

                 <Button variant="ghost" className="hidden sm:flex" onClick={() => setIsOpen(false)}>
                     Batal
                 </Button>
                 <Button onClick={() => handlePrint()} disabled={loading} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-9">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                    Print / Save PDF
                 </Button>
             </div>
           </div>
        </DialogHeader>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-auto bg-slate-300/30 dark:bg-slate-900/50 flex justify-center p-4 sm:p-8">
            {loading || !settings ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p>Memuat Template...</p>
                </div>
            ) : (
              <div 
                 className="relative bg-white shadow-2xl transition-all duration-200 ease-out origin-top-left flex-none my-auto overflow-hidden"
                 style={{
                     width: `${794 * zoom}px`,
                     height: `${1123 * zoom}px`
                 }}
              >
                 <div 
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                        transform: `scale(${zoom})`
                    }}
                 >
                   <InvoiceTemplate
                       ref={componentRef}
                       order={invoiceData}
                       settings={settings}
                   />
                 </div>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
