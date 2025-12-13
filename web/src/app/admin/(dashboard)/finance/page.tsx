"use client"

import { useState } from "react"
import { format, subMonths, isSameMonth, parseISO } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { 
  DollarSign, 
  TrendingDown, 
  Download,
  Plus,
  FileSpreadsheet,
  Tags,
  X,
  CreditCard,
  Wallet
} from "lucide-react"
import { toast } from "sonner"
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { supabase } from "@/lib/supabaseClient"
import { useEffect } from "react"

interface Expense {
  id: string
  description: string
  amount: number
  category: string // joined name
  date: string
  type: string
}

interface Category {
  id: string
  name: string
}

const data = [
  { name: 'Jan', revenue: 45000000, profit: 32000000, expense: 13000000 },
  { name: 'Feb', revenue: 52000000, profit: 38000000, expense: 14000000 },
  { name: 'Mar', revenue: 48000000, profit: 35000000, expense: 13000000 },
  { name: 'Apr', revenue: 61000000, profit: 45000000, expense: 16000000 },
  { name: 'May', revenue: 55000000, profit: 39000000, expense: 16000000 },
  { name: 'Jun', revenue: 75000000, profit: 55000000, expense: 20000000 },
];

export default function FinancePage() {
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([])
  const [metrics, setMetrics] = useState({
      revenue: 0,
      expenses: 0,
      netProfit: 0,
      teamExpenses: 0,
      opsExpenses: 0
  })
  const [chartData, setChartData] = useState<any[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)

     // 1. Fetch Expenses Categories
     const { data: catData } = await supabase.from('expense_categories').select('*').order('name')
     if (catData) setCategories(catData)

     // 2. Fetch Expenses (Limit 1000 for client-side pagination support)
     const { data: expData } = await supabase.from('expenses').select('*, expense_categories(name)').order('date', { ascending: false }).limit(1000)
     
     if (expData) {
         const mapped = expData.map((e: any) => ({
             id: e.id,
             description: e.description,
             category: e.expense_categories?.name || "Uncategorized",
             date: format(new Date(e.date), "dd MMM yyyy"), // Display format
             rawDate: e.date, // For calculation
             amount: e.amount,
             type: "expense" // or 'team_fee' logic if column exists
         }))
         setExpenses(mapped) // Use setExpenses for the table
         
         // 3. AGGREGATION
         // Fetch all orders (confirmed/completed) for Revenue (Last 6 Months)
         const { data: orders } = await supabase
            .from('orders')
            .select('total_amount, created_at')
            .neq('status', 'cancelled')
            .gte('created_at', subMonths(new Date(), 6).toISOString())

         // Calculate Totals using fetched orders and expenses (filtered to 6mo)
         let totalRev = 0
         let totalExp = 0
         let totalTeamExp = 0
         let totalOpsExp = 0
         
         orders?.forEach(o => totalRev += Number(o.total_amount || 0))

         const sixMonthsAgo = subMonths(new Date(), 6)
         
         // Filter expenses for metrics (ensure date is within 6 months)
         const recentExpensesForMetrics = expData.filter(e => new Date(e.date) >= sixMonthsAgo)
         
         recentExpensesForMetrics.forEach(e => {
            const amt = Number(e.amount || 0)
            totalExp += amt
            const catName = e.expense_categories?.name?.toLowerCase() || ""
            if (catName.includes('fee') || catName.includes('gaji') || catName.includes('talent')) {
                totalTeamExp += amt
            } else {
                totalOpsExp += amt
            }
         })

         setMetrics({
            revenue: totalRev,
            expenses: totalExp,
            netProfit: totalRev - totalExp,
            teamExpenses: totalTeamExp,
            opsExpenses: totalOpsExp
         })

         // Generate Chart Data (Last 6 Months)
         const months = []
         for (let i = 5; i >= 0; i--) {
            const d = subMonths(new Date(), i)
            const monthName = format(d, 'MMM', { locale: idLocale })
            
            // Revenue for Month
            const rev = orders?.filter(o => isSameMonth(parseISO(o.created_at), d))
                .reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0
            
            // Expenses for Month
            const exp = recentExpensesForMetrics.filter(e => isSameMonth(parseISO(e.date), d))
                .reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0

            months.push({
                name: monthName,
                revenue: rev,
                profit: rev - exp,
                expenses: exp
            })
         }
         setChartData(months)
     }

    } catch (err) {
      console.error(err)
      toast.error("Gagal memuat data keuangan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
     fetchData()
  }, [])

  const handleAddCategory = async () => {
    if (newCategoryName) {
      const { error } = await supabase.from('expense_categories').insert({ name: newCategoryName })
      if (!error) {
         setNewCategoryName("")
         fetchData() // Refresh
      } else {
         toast.error("Gagal menambah kategori")
      }
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Hapus kategori ini?")) {
       const { error } = await supabase.from('expense_categories').delete().eq('id', id)
       if (!error) {
           fetchData()
           toast.success("Kategori dihapus")
       } else {
           toast.error("Gagal menghapus kategori")
       }
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* ... Header ... */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Keuangan</h2>
          <p className="text-muted-foreground hidden sm:block">Monitor profit bersih, kotor, dan pengeluaran tim.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Manage Categories Button */}
          <Dialog open={isCategoryManageOpen} onOpenChange={setIsCategoryManageOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs sm:h-9 sm:text-sm">
                <Tags className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                 <DialogTitle>Kelola Kategori Pengeluaran</DialogTitle>
                 <DialogDescription>Tambah atau hapus kategori.</DialogDescription>
               </DialogHeader>
               <div className="space-y-4 py-4">
                  <div className="flex gap-2">
                     <Input placeholder="Nama kategori..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                     <Button onClick={handleAddCategory} size="icon"><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 rounded-lg border p-3 bg-muted/20 min-h-[100px] max-h-[200px] overflow-y-auto">
                      {categories.map((cat) => (
                        <Badge key={cat.id} variant="secondary" className="flex items-center gap-1">
                          {cat.name}
                          <div role="button" onClick={() => handleDeleteCategory(cat.id)} className="ml-1 rounded-full p-0.5 hover:bg-red-200 cursor-pointer"><X className="h-3 w-3" /></div>
                        </Badge>
                      ))}
                  </div>
               </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="h-8 text-xs sm:h-9 sm:text-sm">
            <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> CSV
          </Button>
          <AddExpenseDialog categories={categories} onSuccess={fetchData} />
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* GROSS REVENUE */}
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-100 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-medium truncate text-blue-600 dark:text-blue-400">Total Omset (Kotor)</CardTitle>
            <Wallet className="h-3 w-3 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold truncate">
               {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(metrics.revenue)}
            </div>
            <p className="text-[10px] text-muted-foreground">6 Bulan Terakhir</p>
          </CardContent>
        </Card>

        {/* TEAM EXPENSES */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-medium truncate text-muted-foreground">Pengeluaran Tim</CardTitle>
            <CreditCard className="h-3 w-3 text-red-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold truncate">
               {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(metrics.teamExpenses)}
            </div>
            <p className="text-[10px] text-muted-foreground">Fee & Talent</p>
          </CardContent>
        </Card>

        {/* OPERATIONAL EXPENSES */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-medium truncate text-muted-foreground">Operasional</CardTitle>
            <TrendingDown className="h-3 w-3 text-orange-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold truncate">
               {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(metrics.opsExpenses)}
            </div>
            <p className="text-[10px] text-muted-foreground">Sewa, Alat, Marketing</p>
          </CardContent>
        </Card>

        {/* NET PROFIT */}
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-green-100 dark:border-green-900 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-bold truncate text-green-700 dark:text-green-400">Profit Bersih (Net)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400 truncate">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(metrics.netProfit)}
            </div>
            <p className="text-[10px] text-green-600/80 font-medium">
               {metrics.revenue > 0 ? (metrics.netProfit / metrics.revenue * 100).toFixed(1) : 0}% Margin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Performa Keuangan</CardTitle>
                <CardDescription>Perbandingan Omset vs Profit Bersih 6 bulan terakhir.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(value) => `${value/1000000}jt`} 
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <Tooltip 
                                formatter={(value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(value)}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="revenue" name="Omset" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="profit" name="Profit Bersih" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        
        {/* ... Payment Composition Chart ... */}
        {/* Keeping original Composition chart implementation (static or can be updated similarly) */}
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Komposisi Pengeluaran</CardTitle>
                <CardDescription>Distribusi biaya operasional vs tim.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="h-[300px] w-full flex flex-col justify-center items-center gap-4">
                     {/* Dynamic Progress Bars */}
                     <div className="w-full space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-muted-foreground">Fee Tim (Freelance)</span>
                                <span>{metrics.expenses > 0 ? ((metrics.teamExpenses / metrics.expenses) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-red-400" style={{ width: `${metrics.expenses > 0 ? (metrics.teamExpenses / metrics.expenses) * 100 : 0}%` }} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-muted-foreground">Operasional</span>
                                <span>{metrics.expenses > 0 ? ((metrics.opsExpenses / metrics.expenses) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-orange-400" style={{ width: `${metrics.expenses > 0 ? (metrics.opsExpenses / metrics.expenses) * 100 : 0}%` }} />
                            </div>
                        </div>
                     </div>
                     
                     <div className="p-4 bg-muted/20 rounded-lg text-xs text-muted-foreground w-full mt-4">
                         💡 <strong>Insight:</strong> {metrics.teamExpenses > metrics.opsExpenses ? "Pengeluaran terbesar adalah untuk Fee Tim." : "Pengeluaran terbesar adalah Operasional."}
                     </div>
                 </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card className="col-span-1">
           <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
               <CardTitle>Riwayat Transaksi</CardTitle>
               <CardDescription>Gabungan pengeluaran tim dan operasional.</CardDescription>
            </div>
            <FileSpreadsheet className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses
                  .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                  .map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                        {expense.description}
                        {expense.type === 'team_fee' && <Badge variant="outline" className="ml-2 text-[10px] h-4 px-1">Auto</Badge>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-muted-foreground">
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{expense.date}</TableCell>
                    <TableCell className="text-right font-medium">{parseInt(expense.amount.toString()).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="mt-4">
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
                    
                    {Array.from({ length: Math.ceil(expenses.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
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
                            // Calculate total pages
                            const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE)
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                        }}
                        className={currentPage === Math.ceil(expenses.length / ITEMS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                    </PaginationItem>
                </PaginationContent>
                </Pagination>
                <div className="text-center text-xs text-muted-foreground mt-2">
                    Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, expenses.length)} dari {expenses.length} transaksi
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AddExpenseDialog({ categories, onSuccess }: { categories: Category[], onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [desc, setDesc] = useState("")
  const [amount, setAmount] = useState("")
  const [catId, setCatId] = useState("")

  const handleSave = async () => {
     if (!desc || !amount) return
     
     const { error } = await supabase.from('expenses').insert({
        description: desc,
        amount: parseFloat(amount),
        category_id: catId || null
     })

     if (!error) {
        setIsOpen(false)
        setDesc("")
        setAmount("")
        setCatId("")
        toast.success("Pengeluaran dicatat")
        onSuccess()
     } else {
        toast.error("Gagal mencatat")
     }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 text-xs sm:h-9 sm:text-sm">
           <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Catat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
           <DialogTitle>Tambah Pengeluaran</DialogTitle>
           <DialogDescription>Catat pengeluaran operasional.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="grid gap-2">
              <Label>Judul</Label>
              <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Contoh: Sewa Studio" />
           </div>
           <div className="grid gap-2">
              <Label>Jumlah</Label>
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" />
           </div>
           <div className="grid gap-2">
              <Label>Kategori</Label>
              <Select value={catId} onValueChange={setCatId}>
                 <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                 </SelectTrigger>
                 <SelectContent>
                    {categories.map(c => (
                       <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                 </SelectContent>
              </Select>
           </div>
        </div>
        <DialogFooter>
           <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
