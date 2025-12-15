// src/types/invoice.ts

export interface OrderItem {
    id: string;
    name: string;      // e.g. "Wedding Package Gold"
    description?: string; // e.g. "Includes 2 Photographers"
    quantity: number;
    price: number;
  }
  
  export interface Order {
    id: string;
    invoice_number: string;
    created_at: string;
    
    // Client Info
    client_name: string;
    client_email?: string;
    client_phone?: string;
    client_address?: string;
  
    // Event Info
    event_date?: string;
    event_location?: string;
  
    // Finance
    total_amount: number;
    paid_amount: number; // New Field for DP
    
    // Items (Usually we map the Package to 1 Item)
    items: OrderItem[];
  }
  
  export interface BusinessSettings {
    brand_name: string;
    brand_logo_url?: string;
    brand_color: string;
    bank_name: string;
    bank_number: string;
    bank_holder: string;
    footer_note?: string;
    address?: string;
    // New field for layout preference
    header_layout?: 'vertical' | 'horizontal';
    user_id?: string;
  }
