"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface InvoiceOrder {
  id: string;
  client: string;
  contact?: string;
  location?: string;
  date: string;
  package: string;
  status: string;
  amount: string;
  paid_amount?: number;
}

interface InvoicePrintButtonProps {
  order: InvoiceOrder;
}

interface BusinessSettings {
  brand_name: string;
  brand_logo_url: string;
  brand_color: string;
  bank_name: string;
  bank_number: string;
  bank_holder: string;
  address: string;
  footer_note: string;
  header_layout: "vertical" | "horizontal";
}

export default function InvoicePrintButton({ order }: InvoicePrintButtonProps) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("invoice_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setSettings(data);
      }
    };
    fetchSettings();
  }, []);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    // Use settings or defaults
    const brandName = settings?.brand_name || "Enviel Photo";
    const brandColor = settings?.brand_color || "#333333";
    const brandAddress = settings?.address || "";
    const footerNote =
      settings?.footer_note || "Terima kasih atas kepercayaan Anda!";
    const logoUrl = settings?.brand_logo_url;

    // Bank Info
    const bankName = settings?.bank_name || "";
    const bankNumber = settings?.bank_number || "";
    const bankHolder = settings?.bank_holder || "";
    const hasBankInfo = bankName || bankNumber;

    const totalVal = parseInt(order.amount.replace(/\D/g, "")) || 0;
    const paidVal = order.paid_amount || 0;
    const balanceVal = totalVal - paidVal;

    // Stamp Logic
    const isPaidOff = balanceVal <= 0;
    const stampText = isPaidOff ? "LUNAS" : "BELUM LUNAS";
    const stampClass = isPaidOff ? "is-paid" : "is-unpaid";

    const formattedPaid = `Rp ${paidVal.toLocaleString("id-ID")}`;
    const formattedBalance = `Rp ${balanceVal.toLocaleString("id-ID")}`;

    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>INVOICE #${order.id}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; -webkit-print-color-adjust: exact; position: relative; min-height: 90vh; }
                    .header-container { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid ${brandColor}; padding-bottom: 20px; }
                    
                    .brand { max-width: 60%; }
                    .brand-content { display: flex; align-items: center; gap: 15px; }
                    .brand-text h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; color: ${brandColor}; font-weight: 800; line-height: 1; }
                    .brand-text p { margin: 5px 0 0; color: #666; font-size: 13px; white-space: pre-line; line-height: 1.4; }
                    .brand-logo { max-height: 70px; max-width: 150px; object-fit: contain; }
                    /* Vertical Layout Support */
                    .brand.vertical .brand-content { flex-direction: column; align-items: flex-start; gap: 10px; }
                    
                    .invoice-title { text-align: right; }
                    .invoice-title h2 { margin: 0; font-size: 24px; color: ${brandColor}; text-transform: uppercase; letter-spacing: 2px; }
                    .meta { margin-top: 5px; font-size: 14px; color: #555; text-align: right; }
                    
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                    .info-box strong { display: block; margin-bottom: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; }
                    .info-box p { margin: 0; line-height: 1.6; font-size: 15px; }
                    
                    /* Bank Info Box Style */
                    .bank-box { margin-top: 15px; background: #f5f5f5; padding: 10px; border-radius: 6px; font-size: 13px; border-left: 3px solid ${brandColor}; }
                    .bank-label { font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
                    .bank-detail { font-weight: bold; color: #333; }

                    .table-container { margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; }
                    th { text-align: left; padding: 15px 10px; border-bottom: 2px solid ${brandColor}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                    td { padding: 20px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
                    .text-right { text-align: right; }
                    
                    .totals { display: flex; justify-content: flex-end; }
                    .totals-box { width: 350px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
                    .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
                    .row.final { font-weight: 800; font-size: 18px; border-top: 2px solid #ddd; margin-top: 10px; padding-top: 15px; color: #111; }
                    
                    /* STAMP STYLES - CENTERED */
                    .stamp-container { 
                        position: absolute; 
                        top: 50%; 
                        left: 50%; 
                        transform: translate(-50%, -50%) rotate(-12deg); 
                        z-index: 100;
                        pointer-events: none;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .stamp {
                        color: #555;
                        font-size: 6rem;
                        font-weight: 700;
                        border: 0.5rem solid #555;
                        display: inline-block;
                        padding: 1rem 3rem;
                        text-transform: uppercase;
                        border-radius: 1rem;
                        font-family: 'Courier New', Courier, monospace;
                        mask-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/grunge.png');
                        -webkit-mask-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/grunge.png');
                        mask-size: 944px 604px;
                        -webkit-mask-size: 944px 604px;
                        mix-blend-mode: multiply;
                        opacity: 0.15; /* Transparent effect */
                        white-space: nowrap;
                    }

                    .is-paid {
                        color: #0d9656;
                        border-color: #0d9656;
                        opacity: 0.2;
                    }

                    .is-unpaid {
                        color: #d11212;
                        border-color: #d11212;
                        opacity: 0.15;
                    }
                    
                    .footer { 
                        position: fixed; 
                        bottom: 40px; 
                        left: 0; 
                        right: 0; 
                        text-align: left; 
                        font-size: 12px; 
                        color: #999; 
                        border-top: 1px solid #eee; 
                        padding-top: 20px; 
                        margin: 0 40px;
                        white-space: pre-line;
                    }
                    
                    @media print {
                        @page { margin: 0; size: auto; }
                        body { margin: 1.6cm; }
                        .no-print { display: none; }
                        .footer { position: fixed; bottom: 20px; }
                        /* Hide default browser header/footer */
                        header, footer { display: none !important; }
                    }
                </style>
            </head>
            <body>
                <div class="stamp-container">
                    <div class="stamp ${stampClass}">${stampText}</div>
                </div>

                <div class="header-container">
                    <div class="brand ${settings?.header_layout === "vertical" ? "vertical" : "horizontal"}">
                        <div class="brand-content">
                            ${logoUrl ? `<img src="${logoUrl}" class="brand-logo" alt="Logo" />` : ""}
                            <div class="brand-text">
                                <h1>${brandName}</h1>
                                <p>${brandAddress}</p>
                            </div>
                        </div>
                    </div>
                    <div class="invoice-title">
                        <h2>INVOICE</h2>
                        <div class="meta">
                            <strong>#${order.id}</strong><br>
                            Tanggal: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-box">
                        <strong>Ditagihkan Kepada</strong>
                        <p>
                            <span style="font-size: 18px; font-weight: bold; color: #111;">${order.client}</span><br>
                            ${order.contact ? `${order.contact}<br>` : ""}
                            ${order.location ? `${order.location}` : ""}
                        </p>
                    </div>
                    <div class="info-box" style="text-align: right;">
                        <strong>Detail Acara</strong>
                        <p>
                            ${order.package}<br>
                             ${new Date(order.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        
                        ${
                          hasBankInfo
                            ? `
                        <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                            <div class="bank-box" style="text-align: left; min-width: 200px;">
                                <div class="bank-label">Transfer Pembayaran</div>
                                <div class="bank-detail">${bankName}</div>
                                <div class="bank-detail" style="font-size: 16px; letter-spacing: 1px;">${bankNumber}</div>
                                <div style="font-size: 11px; color: #666;">a.n ${bankHolder}</div>
                            </div>
                        </div>
                        `
                            : ""
                        }

                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 70%">Deskripsi Layanan</th>
                                <th class="text-right">Harga</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${order.package}</div>
                                    <div style="color: #666; font-size: 13px;">Layanan profesional fotografi & sinematografi.</div>
                                </td>
                                <td class="text-right" style="font-size: 16px;">${order.amount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="totals">
                    <div class="totals-box">
                        <div class="row">
                            <span>Subtotal</span>
                            <span>${order.amount}</span>
                        </div>
                        <div class="row">
                            <span>Dibayar (DP)</span>
                            <span style="color: #0d9656;">${formattedPaid}</span>
                        </div>
                        <div class="row final">
                            <span>Sisa Tagihan</span>
                            <span style="color: ${balanceVal > 0 ? "#d11212" : "#111"};">${formattedBalance}</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>${footerNote}<br>
                    ${brandName} &copy; ${new Date().getFullYear()}</p>
                </div>

                <script>
                    window.onload = () => {
                        setTimeout(() => {
                           window.print();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <Button size="sm" variant="outline" onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" /> Print Invoice
    </Button>
  );
}
