"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { InvoiceEditor } from "@/components/admin/InvoiceEditor"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, Trash2, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

// Invoice type definition
interface Invoice {
  id: string
  invoice_number: string
  client_name?: string
  issue_date?: string
  due_date?: string
  status?: string
  total_amount?: number
  created_at?: string
  clients?: { id: string; name: string; email?: string } | null
}

function InvoicesPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  // Compute initial view based on URL params - no useEffect needed
  const initialView = orderId ? 'editor' : 'list'
  const [view, setView] = useState<'list' | 'editor'>(initialView)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [_editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Memoize orderData to prevent re-creation on every render
  const orderData = useMemo(() => orderId ? {
    orderId,
    clientName: searchParams.get('clientName') || '',
    contact: searchParams.get('contact') || '',
    package: searchParams.get('package') || '',
    amount: searchParams.get('amount') || '',
    date: searchParams.get('date') || '',
    status: searchParams.get('status') || ''
  } : null, [orderId, searchParams])
  
  // Check if autoPrint mode
  const autoPrint = searchParams.get('print') === 'true'


  const fetchInvoices = async () => {
    // Fetch orders and treat them as invoices
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) {
        // Map orders to invoice format
        const mappedInvoices: Invoice[] = data.map(order => ({
          id: order.id,
          invoice_number: `INV-${order.id}`,
          client_name: order.client_name,
          issue_date: order.event_date,
          due_date: order.event_date, // Same as event date
          status: order.payment_status || 'unpaid',
          total_amount: order.total_amount,
          created_at: order.created_at
        }))
        setInvoices(mappedInvoices)
    }
  }

  useEffect(() => {
    // Only fetch if we're showing the list view
    if (view === 'list') {
      // Using async IIFE to handle async operation in effect
      void (async () => {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (data) {
          const mappedInvoices: Invoice[] = data.map(order => ({
            id: order.id,
            invoice_number: `INV-${order.id}`,
            client_name: order.client_name,
            issue_date: order.event_date,
            due_date: order.event_date,
            status: order.payment_status || 'unpaid',
            total_amount: order.total_amount,
            created_at: order.created_at
          }))
          setInvoices(mappedInvoices)
        }
      })()
    }
  }, [view])

  const handleDelete = async (id: string) => {
      if (!confirm("Hapus pesanan ini?")) return
      const { error: _deleteError } = await supabase.from('orders').delete().eq('id', id)
      if (!_deleteError) {
          toast.success("Pesanan dihapus")
          fetchInvoices()
      } else {
          toast.error("Gagal menghapus pesanan")
      }
  }

  // State for selected order when editing from list
  const [selectedOrderData, setSelectedOrderData] = useState<{
    orderId: string
    clientName: string
    contact: string
    package: string
    amount: string
    date: string
    status: string
  } | null>(null)

  const handleEdit = (invoice: Invoice) => {
      // Create orderData from invoice for InvoiceEditor
      const invoiceOrderData = {
        orderId: invoice.id,
        clientName: invoice.client_name || '',
        contact: '', // Order doesn't have contact in invoice format
        package: '', // Would need to fetch from order
        amount: invoice.total_amount ? `Rp ${invoice.total_amount.toLocaleString('id-ID')}` : 'Rp 0',
        date: invoice.issue_date || '',
        status: invoice.status || 'unpaid'
      }
      setSelectedOrderData(invoiceOrderData)
      setEditingInvoice(invoice)
      setView('editor')
  }

  const _handleCreate = () => {
      setEditingInvoice(null)
      setSelectedOrderData(null)
      setView('editor')
  }

  if (view === 'editor') {
      // Use selectedOrderData (from list click) or orderData (from URL params)
      const editorData = selectedOrderData || orderData
      return <InvoiceEditor 
        onBack={() => {
          setView('list')
          setSelectedOrderData(null)
          fetchInvoices()
        }} 
        orderData={editorData}
        autoPrint={autoPrint}
      />
  }

  const filteredInvoices = invoices.filter(inv => 
     inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (inv.client_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h2 className="text-3xl font-bold tracking-tight">Invoice</h2>
             <p className="text-muted-foreground">Kelola tagihan dan pembayaran klien. Buat invoice dari halaman Orders.</p>
          </div>
       </div>
       
       <Card>
          <CardHeader>
             <CardTitle>Daftar Invoice</CardTitle>
             <CardDescription>
                Semua invoice yang telah dibuat.
             </CardDescription>
             <div className="pt-4">
                <div className="relative">
                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input 
                      placeholder="Cari invoice number atau nama klien..." 
                      className="pl-9 max-w-sm" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
             </div>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                   <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Klien</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {filteredInvoices.length === 0 ? (
                      <TableRow>
                         <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Belum ada invoice.
                         </TableCell>
                      </TableRow>
                   ) : (
                      filteredInvoices.map((inv) => (
                         <TableRow key={inv.id}>
                            <TableCell className="font-medium">{inv.invoice_number}</TableCell>
                            <TableCell>{inv.clients?.name || "Klien Umum"}</TableCell>
                            <TableCell>{inv.issue_date ? format(new Date(inv.issue_date), "dd MMM yyyy") : "-"}</TableCell>
                            <TableCell>{inv.due_date ? format(new Date(inv.due_date), "dd MMM yyyy") : "-"}</TableCell>
                            <TableCell>
                                <Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'draft' ? 'secondary' : 'destructive'}>
                                   {inv.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                               <div className="flex justify-end gap-2">
                                  {/* Edit not fully implemented for data loading yet, but opens designer */}
                                  <Button variant="ghost" size="icon" onClick={() => handleEdit(inv)}>
                                      <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(inv.id)}>
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                               </div>
                            </TableCell>
                         </TableRow>
                      ))
                   )}
                </TableBody>
             </Table>
          </CardContent>
       </Card>
    </div>
  )
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96">Loading...</div>}>
      <InvoicesPageContent />
    </Suspense>
  )
}
