"use client"

import { useState, ElementType, Fragment } from "react"
import { toast } from "sonner"
import { 
  Search, 
  Filter, 
  MapPin,
  Loader2,
  Calendar as CalendarIcon,
  Trash2,
  Camera,
  CheckCircle2,
  CircleDashed,
  ChevronDown,
  Save,
  Printer,
  Plus,
  FileText
} from "lucide-react"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
// Import shared team data
import { supabase } from "@/lib/supabaseClient"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { AnimatePresence, motion } from "framer-motion"

// Order interface definition
interface Order {
  id: string
  client: string
  date: string
  package: string
  status: string
  amount: string
  location: string
  mapsUrl?: string
  contact?: string
  allocations?: Allocation[]
}

interface Allocation {
  id: string
  name: string
  role: string
  fee: string
  member_id?: string // For DB reference
}

interface TeamMemberSimple {
    id: string
    name: string
    role: string
}

// Status definitions mapping to colors and labels
const statusConfig: Record<string, { label: string, color: string, icon: ElementType }> = {
  booked: { label: "Booked (DP)", color: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400", icon: CalendarIcon },
  process: { label: "Proses", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Camera },
  completed: { label: "Selesai", color: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
}



export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMemberSimple[]>([])
  const [packages, setPackages] = useState<{id: string, name: string, price: number}[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  
  const [isLoading, setIsLoading] = useState(true)

  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  // Dialog States
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  // Editing State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  const handleGenerateInvoice = (order: Order) => {
    const params = new URLSearchParams({
      orderId: order.id,
      clientName: order.client,
      contact: order.contact || '',
      package: order.package,
      amount: order.amount,
      date: order.date,
      status: order.status
    })
    router.push(`/admin/invoices?${params.toString()}`)
    toast.success("Membuka Invoice Designer...")
  }

  const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Generate simple ID
    const newId = `DA-${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

    const payload = {
        id: newId,
        client_name: formData.get("client") as string,
        contact_info: formData.get("contact") as string,
        event_date: formData.get("date") as string,
        package_name: formData.get("package") as string,
        location: formData.get("location") as string,
        maps_url: formData.get("mapsUrl") as string,
        total_amount: parseInt((formData.get("amount") as string).replace(/[^0-9]/g, "")) || 0,
        status: "booked",
        created_at: new Date().toISOString()
    }

    const { error } = await supabase.from('orders').insert(payload)
    if (!error) {
        toast.success("Booking berhasil dibuat")
        setIsNewBookingOpen(false)
        fetchOrders()
    } else {
        toast.error("Gagal membuat booking: " + error.message)
        console.error(error)
    }
    setIsLoading(false)
  }

  // Fetch Packages for Dropdown
  const fetchPackages = async () => {
      const { data } = await supabase.from('packages').select('id, name, price').order('name')
      if (data) setPackages(data)
  }

  // Fetch Team for Dropdown
  const fetchTeam = async () => {
      const { data } = await supabase.from('team_members').select('id, name, role').eq('status', 'active')
      if (data) setTeamMembers(data)
  }

  // Fetch Orders
  const fetchOrders = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_allocations (
                id, role, fee, member_id,
                team_members (name)
            )
        `)
        .order('created_at', { ascending: false })

      if (error) {
          console.error(error)
          toast.error("Gagal mengambil data order")
      } else if (data) {
          const mappedOrders: Order[] = data.map((d: any) => ({
              id: d.id,
              client: d.client_name,
              date: d.event_date,
              package: d.package_name || "-",
              status: d.status,
              amount: d.total_amount ? `Rp ${parseInt(d.total_amount).toLocaleString('id-ID')}` : "Rp 0",
              location: d.location || "-",
              mapsUrl: d.maps_url,
              contact: d.contact_info,
              allocations: d.order_allocations.map((alloc: any) => ({
                  id: alloc.id,
                  member_id: alloc.member_id,
                  role: alloc.role,
                  fee: alloc.fee ? `Rp ${parseInt(alloc.fee).toLocaleString('id-ID')}` : "Rp 0",
                  name: alloc.team_members?.name || "Unknown"
              }))
          }))
          setOrders(mappedOrders)
      }
      setIsLoading(false)
  }

  useEffect(() => {
      fetchPackages()
      fetchTeam()
      fetchOrders()
  }, [])

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.location && order.location.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter) {
       matchesDate = order.date === format(dateFilter, "yyyy-MM-dd")
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleRowClick = (order: Order) => {
    setExpandedId(expandedId === order.id ? null : order.id)
  }

  const handleDeleteOrder = async (orderId: string) => {
      if (confirm("Hapus order ini?")) {
          const { error } = await supabase.from('orders').delete().eq('id', orderId)
          if (!error) {
              toast.success("Order dihapus")
              setOrders(orders.filter(o => o.id !== orderId))
          } else {
              toast.error("Gagal menghapus")
          }
      }
  }

  const handleSaveEdit = async () => {
      if (!editingOrder) return

      const rawAmount = editingOrder.amount.replace(/[^0-9]/g, "")
      
      const orderPayload = {
          client_name: editingOrder.client,
          contact_info: editingOrder.contact,
          event_date: editingOrder.date,
          location: editingOrder.location,
          maps_url: editingOrder.mapsUrl,
          package_name: editingOrder.package,
          status: editingOrder.status,
          total_amount: parseInt(rawAmount) || 0,
      }

      if (isNewBookingOpen) {
         // Create New
         // ID is manual in frontend or auto? 
         // DB `id` is text primary key. Let's auto-generate formatting 'ORD-YYYY-XXX' or just use UUID if permissible, but Schema said text.
         // Schema: id text primary key.
         // I'll generate a random ID for now or timestamp.
         const newId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
         
         const { error } = await supabase.from('orders').insert({
             id: newId,
             ...orderPayload
         })
         
         if (error) {
             toast.error("Gagal membuat order")
             console.error(error)
             return
         }
         
         // Insert Allocations
         if (editingOrder.allocations && editingOrder.allocations.length > 0) {
             const allocs = editingOrder.allocations.map(a => ({
                 order_id: newId,
                 member_id: a.member_id, // We need member ID! frontend must store it
                 role: a.role,
                 fee: parseInt(a.fee.replace(/[^0-9]/g, "")) || 0
             }))
             // Filter out those without member_id if any (manual input not supported fully yet)
             // But my UI uses Select from TEAM_DATA (now teamMembers).
             // I need to update UI to store member_id in `newItem` state!
             
             await supabase.from('order_allocations').insert(allocs)
         }

         toast.success("Order berhasil dibuat")
         setIsNewBookingOpen(false)
         fetchOrders()
         
      } else {
          // Update
          const { error } = await supabase.from('orders').update(orderPayload).eq('id', editingOrder.id)
          
          if (error) {
              toast.error("Gagal update order")
               return
          }
          
          // Sync Allocations (Delete all and re-insert is easiest for now)
          await supabase.from('order_allocations').delete().eq('order_id', editingOrder.id)
          
          if (editingOrder.allocations && editingOrder.allocations.length > 0) {
              const allocs = editingOrder.allocations.map(a => {
                  // If member_id missing (legacy data), try finding by name?
                  // For now assume member_id exists or skip
                  const member = teamMembers.find(t => t.name === a.name)
                  const mId = a.member_id || member?.id
                  
                  if (!mId) return null 
                  
                  return {
                     order_id: editingOrder.id,
                     member_id: mId,
                     role: a.role,
                     fee: parseInt(a.fee.replace(/[^0-9]/g, "")) || 0
                  }
              }).filter(Boolean)
              
              if (allocs.length > 0) await supabase.from('order_allocations').insert(allocs)
          }

          toast.success("Order diupdate")
          setIsEditDialogOpen(false)
          fetchOrders()
      }
      setEditingOrder(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
        setOrders(orders.filter(o => o.id !== id))
        if (expandedId === id) {
            setExpandedId(null)
            setEditingOrder(null)
        }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Daftar Pesanan</h2>
          <p className="text-sm md:text-base text-muted-foreground">Kelola booking, edit data & invoice.</p>
        </div>
        <Button onClick={() => setIsNewBookingOpen(true)} className="w-full md:w-auto">
          <CalendarIcon className="mr-2 h-4 w-4" /> Booking Baru
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama klien atau ID..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Semua Status</DropdownMenuItem>
            <DropdownMenuItem>Hanya Booked</DropdownMenuItem>
            <DropdownMenuItem>Hanya Selesai</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">Semua Pesanan</TabsTrigger>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-4 data-[state=active]:duration-500 ease-in-out">
          <CardTable 
             orders={filteredOrders} 
             expandedId={expandedId}
             editingOrder={editingOrder}
             onRowClick={handleRowClick}
             setEditingOrder={setEditingOrder as (order: Order) => void}
             onSave={handleSaveEdit}
             onDelete={handleDelete}
             onGenerateInvoice={handleGenerateInvoice}
             teamMembers={teamMembers}
          />
        </TabsContent>
        <TabsContent value="active" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-4 data-[state=active]:duration-500 ease-in-out">
          <CardTable 
             orders={filteredOrders.filter(o => o.status !== 'completed')} 
             expandedId={expandedId}
             editingOrder={editingOrder}
             onRowClick={handleRowClick}
             setEditingOrder={setEditingOrder as (order: Order) => void}
             onSave={handleSaveEdit}
             onDelete={handleDelete}
             onGenerateInvoice={handleGenerateInvoice}
             teamMembers={teamMembers}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-4 data-[state=active]:duration-500 ease-in-out">
          <CardTable 
             orders={filteredOrders.filter(o => o.status === 'completed')} 
             expandedId={expandedId}
             editingOrder={editingOrder}
             onRowClick={handleRowClick}
             setEditingOrder={setEditingOrder as (order: Order) => void}
             onSave={handleSaveEdit}
             onDelete={handleDelete}
             onGenerateInvoice={handleGenerateInvoice}
             teamMembers={teamMembers}
          />
        </TabsContent>
      </Tabs>

      {/* New Booking Dialog */}
      <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
        <DialogContent className="w-[90%] max-w-[400px] sm:max-w-[600px] rounded-xl max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleCreateOrder}>
             <DialogHeader>
                <DialogTitle>Buat Booking Baru</DialogTitle>
                <DialogDescription>Masukkan detail pesanan klien baru.</DialogDescription>
             </DialogHeader>
             <div className="grid gap-3 py-3 md:gap-4 md:py-4 md:grid-cols-2">
                <div className="space-y-1 md:space-y-2">
                   <Label>Nama Klien</Label>
                   <Input name="client" placeholder="Contoh: Sarah & John" required className="h-9 md:h-10" />
                </div>
                <div className="space-y-1 md:space-y-2">
                   <Label>Kontak (HP/Email)</Label>
                   <Input name="contact" placeholder="0812..." required className="h-9 md:h-10" />
                </div>
                <div className="space-y-1 md:space-y-2">
                   <Label>Tanggal Acara</Label>
                   <Input name="date" type="date" required className="h-9 md:h-10" />
                </div>
                 <div className="space-y-1 md:space-y-2">
                    <Label>Paket</Label>
                    <Select name="package" required>
                       <SelectTrigger className="h-9 md:h-10">
                          <SelectValue placeholder="Pilih Paket" />
                       </SelectTrigger>
                       <SelectContent>
                          {packages.length === 0 ? (
                            <SelectItem value="no-package" disabled>Belum ada paket tersedia</SelectItem>
                          ) : (
                            packages.map(pkg => (
                              <SelectItem key={pkg.id} value={pkg.name}>
                                {pkg.name} - Rp {pkg.price.toLocaleString('id-ID')}
                              </SelectItem>
                            ))
                          )}
                       </SelectContent>
                    </Select>
                 </div>
                <div className="space-y-1 md:space-y-2">
                   <Label>Label Lokasi (Gedung/Rumah)</Label>
                   <Input name="location" placeholder="Contoh: Hotel Mulia" required className="h-9 md:h-10" />
                </div>
                <div className="space-y-1 md:space-y-2">
                   <Label>Link Google Maps</Label>
                   <Input name="mapsUrl" placeholder="https://maps.app.goo.gl/..." className="h-9 md:h-10" />
                </div>
                <div className="space-y-1 md:space-y-2 md:col-span-2">
                   <Label>Total Harga (Estimasi)</Label>
                   <Input name="amount" placeholder="Rp 0" required className="h-9 md:h-10" />
                </div>
             </div>
             <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsNewBookingOpen(false)}>Batal</Button>
                <Button type="submit">Buat Booking</Button>
             </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CardTableProps {
    orders: Order[]
    expandedId: string | null
    editingOrder: Order | null
    onRowClick: (order: Order) => void
    setEditingOrder: (order: Order) => void
    onSave: () => void
    onDelete: (id: string) => void
    onGenerateInvoice: (order: Order) => void
    teamMembers: TeamMemberSimple[]
}


function CardTable({ orders, expandedId, editingOrder, onRowClick, setEditingOrder, onSave, onDelete, onGenerateInvoice, teamMembers }: CardTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE)
  if (currentPage > totalPages && totalPages > 0) {
     setCurrentPage(totalPages)
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const totalAmount = orders.reduce((sum, order) => {
    const value = parseInt(order.amount.replace(/[^0-9]/g, ""))
    return sum + value
  }, 0)

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalAmount)

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-background/50 p-6">
        <h3 className="mb-4 text-xl font-semibold text-foreground">Daftar Pesanan</h3>
        
        {/* Desktop Table View */}
        <div className="hidden md:block rounded-md h-[calc(100vh-420px)] min-h-[300px] overflow-y-auto relative no-scrollbar">
            <Table>
            <TableHeader className="sticky top-0 z-10 bg-background border-b">
                <TableRow>
                <TableHead className="w-[120px]">ID Pesanan</TableHead>
                <TableHead>Klien</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Tanggal Acara</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                    Belum ada pesanan.
                    </TableCell>
                </TableRow>
                ) : (
                currentOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status]?.icon || CircleDashed
                    const isExpanded = expandedId === order.id
                    
                    return (
                    <Fragment key={order.id}>
                    <TableRow 
                        className={cn(
                            "transition-colors cursor-pointer",
                            isExpanded ? "bg-muted/50 border-b-0" : "hover:bg-muted/40"
                        )}
                        onClick={() => onRowClick(order)}
                    >
                        <TableCell className="font-medium text-muted-foreground">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.client}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{order.contact || "-"}</TableCell>
                        <TableCell className="text-muted-foreground w-[200px]">
                           {new Date(order.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                        {order.location ? (
                            order.mapsUrl ? (
                                <a 
                                    href={order.mapsUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {order.location}
                                </a>
                            ) : (
                                    <span className="flex items-center text-muted-foreground">
                                    <MapPin className="mr-1 h-3 w-3 opacity-50" />
                                    {order.location}
                                    </span>
                            )
                        ) : (
                            "-"
                        )}
                        </TableCell>
                        <TableCell>{order.package}</TableCell>
                        <TableCell>
                        <Badge variant="secondary" className={`${statusConfig[order.status]?.color || "bg-gray-100 text-gray-800"} rounded-full px-2 py-1 text-xs font-semibold border-0`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[order.status]?.label || order.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{order.amount}</TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center h-8 w-8">
                                <motion.div
                                    initial={false}
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </motion.div>
                            </div>
                        </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row Content (Form) */}
                    <AnimatePresence>
                    {isExpanded && editingOrder && (
                        <TableRow className="bg-muted/30 border-t-0 hover:bg-muted/30">
                            <TableCell colSpan={9} className="p-0 border-0">
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <OrderEditForm 
                                        editingOrder={editingOrder}
                                        setEditingOrder={setEditingOrder}
                                        onSave={onSave}
                                        onDelete={onDelete}
                                        onGenerateInvoice={onGenerateInvoice}
                                        teamMembers={teamMembers}
                                    />
                                </motion.div>
                            </TableCell>
                        </TableRow>
                    )}
                    </AnimatePresence>
                    </Fragment>
                    )
                })
                )}
            </TableBody>
            {orders.length > 0 && (
                <TableFooter>
                <TableRow>
                    <TableCell colSpan={7} className="text-right font-semibold">
                    Total Estimasi (Semua)
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground">{formattedTotal}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                </TableFooter>
            )}
            </Table>
        </div>

        {/* Mobile Card List View */}
        {/* Mobile Card List View */}
        <div className="md:hidden space-y-2">
            {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Belum ada pesanan.</div>
            ) : (
                currentOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status]?.icon || CircleDashed
                    const isExpanded = expandedId === order.id
                    
                    return (
                        <div key={order.id} className="bg-background border rounded-lg overflow-hidden shadow-sm">
                            <div 
                                className="p-2.5 cursor-pointer active:bg-muted/50 transition-colors"
                                onClick={() => onRowClick(order)}
                            >
                                <div className="flex justify-between items-start mb-1.5">
                                    <div className="space-y-0">
                                        <div className="text-[10px] font-medium text-muted-foreground leading-none mb-0.5">{order.id}</div>
                                        <div className="font-bold text-sm leading-tight">{order.client}</div>
                                    </div>
                                    <Badge variant="secondary" className={`${statusConfig[order.status]?.color || "bg-gray-100 text-gray-800"} rounded-full px-1.5 py-0 text-[10px] font-semibold border-0 h-5 min-w-[max-content]`}>
                                        <StatusIcon className="mr-1 h-3 w-3" />
                                        {statusConfig[order.status]?.label || order.status}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarIcon className="h-3 w-3 opacity-70" />
                                            {new Date(order.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3 w-3 opacity-70" />
                                            <span className="truncate max-w-[120px]">{order.location || "-"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between font-medium text-foreground pt-1 border-t mt-1.5 border-dashed">
                                        <span className="text-[10px] text-muted-foreground">{order.package}</span>
                                        <span className="text-sm">{order.amount}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <AnimatePresence>
                            {isExpanded && editingOrder && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t bg-muted/10"
                                >
                                    <OrderEditForm 
                                        editingOrder={editingOrder}
                                        setEditingOrder={setEditingOrder}
                                        onSave={onSave}
                                        onDelete={onDelete}
                                        onGenerateInvoice={onGenerateInvoice}
                                        teamMembers={teamMembers}
                                        isMobile={true}
                                    />
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                    )
                })
            )}
        </div>
        
        {/* Mobile Total Summary */}
        <div className="md:hidden rounded-lg border bg-card text-card-foreground shadow-sm p-4 mt-4">
             <div className="flex items-center justify-between">
                 <span className="font-semibold text-sm">Total Estimasi (Semua)</span>
                 <span className="font-bold text-base">{formattedTotal}</span>
             </div>
        </div>

        {/* Pagination Controls */}
        <div className="py-4">
             <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                     href="#" 
                     onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                     }}
                     className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === page}
                      onClick={(e) => {
                         e.preventDefault()
                         setCurrentPage(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                     href="#" 
                     onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                     }}
                     className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="text-center text-xs text-muted-foreground mt-2">
                Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, orders.length)} dari {orders.length} pesanan
            </div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">Daftar semua pesanan aktif dan selesai.</p>
    </div>
  )
}

function OrderEditForm({ 
    editingOrder, 
    setEditingOrder, 
    onSave, 
    onDelete,
    onGenerateInvoice,
    teamMembers,
    isMobile = false
}: { 
    editingOrder: Order, 
    setEditingOrder: (order: Order) => void, 
    onSave: () => void, 
    onDelete: (id: string) => void,
    onGenerateInvoice: (order: Order) => void,
    teamMembers: TeamMemberSimple[],
    isMobile?: boolean
}) {
    // Determine sizing classes based on isMobile prop
    // Use grid-cols-2 for mobile to save vertical space
    const containerClass = isMobile ? "p-3 grid gap-3 grid-cols-2" : "p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3";
    
    // State for new allocation (controlled inputs)
    const [newItem, setNewItem] = useState<{name: string, role: string, fee: string, member_id?: string}>({ name: "", role: "", fee: "", member_id: "" });

    const spaceClass = isMobile ? "space-y-0.5" : "space-y-2";
    // Mobile spans 2 columns by default unless specified otherwise
    const fullWidthClass = isMobile ? "col-span-2" : "";

    // Helper to add allocation
    const handleAddAllocation = () => {
         if (newItem.name && newItem.role && newItem.fee) {
            const newAlloc: Allocation = {
                id: Math.random().toString(36).substr(2, 9),
                name: newItem.name,
                role: newItem.role,
                fee: newItem.fee.startsWith("Rp") ? newItem.fee : `Rp ${newItem.fee}`,
                member_id: newItem.member_id
            }
            setEditingOrder({
                ...editingOrder,
                allocations: [...(editingOrder.allocations || []), newAlloc]
            })
            // Reset inputs
            setNewItem({ name: "", role: "", fee: "", member_id: "" })
        }
    }
    const labelClass = isMobile ? "text-[10px] uppercase tracking-wider text-muted-foreground/70" : "";
    const inputClass = isMobile ? "h-8 text-sm px-2" : "";
    const btnClass = isMobile ? "h-8 text-xs px-2" : "h-9";

    return (
        <div className={containerClass}>
            <div className={`${spaceClass} ${fullWidthClass}`}>
                <Label className={labelClass}>Klien</Label>
                <Input 
                className={inputClass}
                value={editingOrder.client} 
                onChange={(e) => setEditingOrder({...editingOrder, client: e.target.value})}
                />
            </div>
            <div className={`${spaceClass} ${fullWidthClass}`}>
                <Label className={labelClass}>Kontak</Label>
                <Input 
                    className={inputClass}
                    value={editingOrder.contact || ""} 
                    onChange={(e) => setEditingOrder({...editingOrder, contact: e.target.value})}
                    placeholder="0812..."
                />
            </div>
            {/* Split Date & Package on Mobile */}
            <div className={`${spaceClass} flex flex-col`}>
                <Label className={labelClass}>Tanggal</Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-2 text-left font-normal",
                            !editingOrder.date && "text-muted-foreground",
                            inputClass
                        )}
                    >
                        {editingOrder.date ? format(new Date(editingOrder.date), isMobile ? "dd/MM/yy" : "PPP") : <span>Pilih</span>}
                        <CalendarIcon className={`ml-auto opacity-50 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={editingOrder.date ? new Date(editingOrder.date) : undefined}
                        onSelect={(date) => date && setEditingOrder({ ...editingOrder, date: format(date, "yyyy-MM-dd") })}
                        initialFocus
                    />
                </PopoverContent>
                </Popover>
            </div>
            <div className={spaceClass}>
                <Label className={labelClass}>Paket</Label>
                <Select 
                value={editingOrder.package} 
                onValueChange={(value) => setEditingOrder({ ...editingOrder, package: value })}
                >
                <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Wedding Silver">Wed Silver</SelectItem>
                    <SelectItem value="Wedding Gold">Wed Gold</SelectItem>
                    <SelectItem value="Wedding Platinum">Wed Platinum</SelectItem>
                    <SelectItem value="Pre-Wedding">Pre-Wed</SelectItem>
                    <SelectItem value="Graduation">Graduation</SelectItem>
                    <SelectItem value="Newborn">Newborn</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                </SelectContent>
                </Select>
            </div>
            
            <div className={`${spaceClass} ${isMobile ? 'col-span-2' : ''}`}>
                <Label className={labelClass}>Label Lokasi</Label>
                <LocationPicker 
                value={editingOrder.location}
                onChange={(val) => setEditingOrder({ ...editingOrder, location: val })}
                />
            </div>
            <div className={`${spaceClass} ${isMobile ? 'col-span-2' : ''}`}>
                <Label className={labelClass}>Link Google Maps</Label>
                <Input 
                className={inputClass}
                value={editingOrder.mapsUrl || ""}
                onChange={(e) => setEditingOrder({ ...editingOrder, mapsUrl: e.target.value })}
                placeholder="https://maps.app.goo.gl/..."
                />
            </div>
            <div className={`${spaceClass} ${isMobile ? 'col-span-2' : ''}`}>
                <Label className={labelClass}>Total</Label>
                <Input 
                className={inputClass}
                value={editingOrder.amount}
                onChange={(e) => setEditingOrder({ ...editingOrder, amount: e.target.value })}
                />
            </div>
            
            {/* Team Allocation Modal Trigger */}
            <div className={`col-span-2 md:col-span-3 flex justify-between items-center bg-muted/20 ${isMobile ? 'p-2' : 'p-3'} rounded-lg border border-dashed`}>
                <div className={`text-muted-foreground ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
                    <span className="font-medium text-foreground">Tim: </span>
                    {editingOrder.allocations?.length ? `${editingOrder.allocations.length} org` : "0 org"}
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-1.5 ${btnClass} h-7`}>
                            <Plus className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> {isMobile ? "Tim" : "Kelola Tim"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90%] max-w-[400px] sm:max-w-[600px] rounded-xl max-h-[85vh] overflow-y-auto overflow-x-hidden">
                        <DialogHeader>
                            <DialogTitle>Kelola Tim & Pembagian</DialogTitle>
                            <DialogDescription>
                                Tambahkan anggota tim untuk project ini. Hitungan profit akan otomatis dikalkulasi.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                             {/* Add New Allocation */}
                            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end border-b pb-4">
                                <div className="flex-1 space-y-1">
                                    <Label className="text-xs">Nama Anggota</Label>
                                    <Select 
                                        value={newItem.name} 
                                        onValueChange={(val) => {
                                            const member = teamMembers.find(t => t.name === val);
                                            setNewItem({
                                                ...newItem,
                                                name: val,
                                                role: member ? member.role : newItem.role,
                                                member_id: member?.id // Store ID
                                            })
                                        }}
                                    >
                                        <SelectTrigger className="h-9">
                                             <SelectValue placeholder="Pilih Anggota" />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {teamMembers.map((member) => (
                                                  <SelectItem key={member.id} value={member.name}>
                                                      {member.name}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label className="text-xs">Peran (Role)</Label>
                                    <Input 
                                        id="new-team-role" 
                                        placeholder="Fotografer / Editor" 
                                        className="h-9"
                                        value={newItem.role}
                                        onChange={(e) => setNewItem({...newItem, role: e.target.value})}
                                    />
                                </div>
                                <div className="w-full sm:w-[150px] space-y-1">
                                    <Label className="text-xs">Fee (Rp)</Label>
                                    <Input 
                                        id="new-team-fee" 
                                        placeholder="1.000.000" 
                                        className="h-9"
                                        value={newItem.fee}
                                        onChange={(e) => setNewItem({...newItem, fee: e.target.value})}
                                    />
                                </div>
                                <Button 
                                    className="w-full sm:w-10 sm:p-0"
                                    onClick={() => {
                                        if (newItem.name && newItem.role && newItem.fee) {
                                            const newAlloc: Allocation = {
                                                id: Math.random().toString(36).substr(2, 9),
                                                name: newItem.name,
                                                role: newItem.role,
                                                fee: newItem.fee.startsWith("Rp") ? newItem.fee : `Rp ${newItem.fee}`
                                            }
                                            setEditingOrder({
                                                ...editingOrder,
                                                allocations: [...(editingOrder.allocations || []), newAlloc]
                                            })
                                            // Reset inputs
                                            setNewItem({ name: "", role: "", fee: "" })
                                        }
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="ml-2 sm:hidden">Tambahkan</span>
                                </Button>
                            </div>

                            {/* Allocation List */}
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {(editingOrder.allocations || []).length === 0 ? (
                                    <div className="text-center text-sm text-muted-foreground py-8 border-dashed border rounded-md">
                                        Belum ada anggota tim yang ditambahkan.
                                    </div>
                                ) : (
                                    (editingOrder.allocations || []).map((alloc) => (
                                        <div key={alloc.id} className="flex items-center justify-between text-sm bg-muted/40 p-2 rounded-md group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {alloc.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium truncate max-w-[100px] sm:max-w-none">{alloc.name}</div>
                                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-none bg-transparent pl-0 text-muted-foreground font-normal truncate max-w-[100px]">{alloc.role}</Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="font-mono font-medium">{alloc.fee}</div>
                                                <Button
                                                    variant="ghost" 
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => setEditingOrder({
                                                        ...editingOrder,
                                                        allocations: editingOrder.allocations?.filter(a => a.id !== alloc.id)
                                                    })}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-muted/50 -mx-6 -mb-6 p-4 text-sm space-y-2">
                             <div className="flex justify-between items-center text-muted-foreground">
                                <span>Total Omset Project:</span>
                                <span>
                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                                        parseInt(editingOrder.amount.replace(/[^0-9]/g, "") || "0")
                                    )}
                                </span>
                             </div>
                             <div className="flex justify-between items-center text-red-500/80">
                                <span>Total Pengeluaran Tim:</span>
                                <span>
                                    - {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                                            (editingOrder.allocations || []).reduce((acc, curr) => acc + parseInt(curr.fee.replace(/[^0-9]/g, "") || "0"), 0)
                                    )}
                                </span>
                             </div>
                             <div className="border-t pt-2 flex justify-between items-center font-bold text-base">
                                <span>Profit Bersih (Enviel):</span>
                                <span className="text-green-600">
                                     {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                                        parseInt(editingOrder.amount.replace(/[^0-9]/g, "") || "0") - 
                                        (editingOrder.allocations || []).reduce((acc, curr) => acc + parseInt(curr.fee.replace(/[^0-9]/g, "") || "0"), 0)
                                     )}
                                </span>
                             </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            
            {/* Action Buttons */}
            <div className={`col-span-2 md:col-span-3 flex justify-end gap-2 mt-1 pt-2 border-t ${isMobile ? 'grid grid-cols-3' : ''}`}>
                <Button variant="ghost" size="sm" onClick={() => onDelete(editingOrder.id)} className={`text-red-500 hover:text-red-600 hover:bg-red-50 ${isMobile ? 'col-span-1 px-0' : 'mr-auto'}`}>
                    <Trash2 className={`mr-2 h-4 w-4 ${isMobile ? 'mr-0 h-4 w-4' : ''}`} /> {isMobile ? "" : "Hapus"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onGenerateInvoice(editingOrder)} className={isMobile ? 'col-span-1 px-0' : ''}>
                    <FileText className={`mr-2 h-4 w-4 ${isMobile ? 'mr-0 h-4 w-4' : ''}`} /> {isMobile ? "" : "Invoice"}
                </Button>
                <Button size="sm" onClick={onSave} className={isMobile ? 'col-span-1 px-0' : ''}>
                    <Save className={`mr-2 h-4 w-4 ${isMobile ? 'h-3 w-3' : ''}`} /> {isMobile ? "Simpan" : "Simpan Perubahan"}
                </Button>
            </div>
        </div>
    )
}

function LocationPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  
  // Debounce search
  const handleSearch = async (query: string) => {
      onChange(query)
      if (query.length < 3) return
      
      setLoading(true)
      try {
         const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
         const data = await res.json()
         setSuggestions(data.map((item: { display_name: string }) => item.display_name))
         setOpen(true)
      } catch (error) {
         console.error("Failed to fetch location", error)
      } finally {
         setLoading(false)
      }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Input 
          id="location"
          placeholder="Cari lokasi atau alamat (Real-time)..."
          value={value}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => value.length > 2 && setOpen(true)}
          className="pr-10"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
           {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
        </div>
      </div>
      
      {/* Autocomplete Suggestions */}
      {open && suggestions.length > 0 && (
         <PopoverContent className="p-0 w-[400px] max-w-[90vw]" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="p-2">
               <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">Hasil Pencarian</div>
               <div className="space-y-1">
                  {suggestions.map((suggestion, idx) => (
                  <button
                     key={idx}
                     className="w-full text-left px-2 py-2 text-sm hover:bg-muted rounded-sm flex items-start gap-2 transition-colors"
                     onClick={() => {
                        onChange(suggestion)
                        setOpen(false)
                     }}
                  >
                     <MapPin className="h-3 w-3 mt-0.5 text-red-500 shrink-0" />
                     <span className="line-clamp-2">{suggestion}</span>
                  </button>
                  ))}
               </div>
               <div className="border-t mt-2 pt-2 px-2 text-[10px] text-muted-foreground bg-muted/30 -mx-2 -mb-2 pb-2">
                  * Powered by OpenStreetMap (Free & Accurate)
               </div>
            </div>
         </PopoverContent>
      )}
    </Popover>
  )
}
