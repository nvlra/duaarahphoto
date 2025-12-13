"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { supabase } from "@/lib/supabaseClient"
import { startOfMonth, subMonths, format, parseISO, isSameMonth } from "date-fns"
import { id as idLocale } from "date-fns/locale"


export default function AdminDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  interface ChartData {
     month: string;
     clients: number;
  }

  interface Booking {
      id: string; // or number, depends on usage. We generate random one in old code, but should use real ID.
      client_name: string;
      package_name: string;
      event_date: string;
      status: string;
  }

  const [stats, setStats] = useState({
      revenue: 0,
      revenueGrowth: 0,
      activeProjects: 0,
      activeGrowth: 0,
      newClients: 0,
      clientGrowth: 0
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [bookedDays, setBookedDays] = useState<Date[]>([])
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])

  // Refactored Fetch
  useEffect(() => {
      const load = async () => {
          const today = new Date()
          const thisMonthStart = startOfMonth(today)
          const lastMonthStart = startOfMonth(subMonths(today, 1))
          
          // FETCH ORDERS
          // Fixed: Added client_name, package_name, event_date to select
          const { data: orders } = await supabase
            .from('orders')
            .select('id, total_amount, created_at, status, event_date, client_name, package_name')
            .neq('status', 'cancelled')
          
          const ordersSafe = orders || []

          const currentMonthRevenue = ordersSafe
            .filter(o => new Date(o.created_at) >= thisMonthStart)
            .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
          
          const lastMonthRevenue = ordersSafe
            .filter(o => {
                const d = new Date(o.created_at)
                return d >= lastMonthStart && d < thisMonthStart
            })
            .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
          
          const revGrowth = lastMonthRevenue > 0 
             ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
             : 0

          const activeCount = ordersSafe.filter(o => ['pending', 'confirmed'].includes(o.status)).length

          // FETCH CLIENTS
          const { data: clients } = await supabase.from('clients').select('created_at')
          const clientsSafe = clients || []
          const newClientsCount = clientsSafe.filter(c => new Date(c.created_at) >= thisMonthStart).length

          setStats({
              revenue: currentMonthRevenue,
              revenueGrowth: revGrowth,
              activeProjects: activeCount,
              activeGrowth: 0, 
              newClients: newClientsCount,
              clientGrowth: 0
          })

          // Chart
          const months: ChartData[] = []
          for (let i = 11; i >= 0; i--) {
             const d = subMonths(today, i)
             const mName = format(d, 'MMM', { locale: idLocale })
             const count = ordersSafe.filter(o => isSameMonth(parseISO(o.created_at), d)).length
             months.push({ month: mName, clients: count })
          }
          setChartData(months)

          // Calendar using event_date
          const bookings = ordersSafe.filter(o => o.event_date).map(o => new Date(o.event_date))
          setBookedDays(bookings)
          
           // Recent Bookings (Upcoming)
          const upcoming: Booking[] = ordersSafe
            .filter(o => o.event_date && new Date(o.event_date) >= today)
            .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
            .slice(0, 3)
            .map(o => ({
                id: o.id || Math.random().toString(),
                client_name: o.client_name || "Klien",
                package_name: o.package_name || "-", 
                event_date: o.event_date,
                status: o.status
            }))
          setRecentBookings(upcoming)
      }
      load()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
      </div>
      
      <div>
         <div className="grid gap-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Revenue */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
               <CardHeader className="pb-2 p-3 sm:p-6">
                  <div className="flex flex-row items-center justify-between space-y-0">
                     <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                        Pendapatan
                     </CardTitle>
                     <div className="p-1.5 sm:p-2 bg-muted rounded-lg">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-foreground" />
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1">
                     <div className="space-y-1">
                        <div className="text-lg sm:text-3xl font-bold">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(stats.revenue)}
                        </div>
                        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                           <span className={`font-medium mr-1 sm:mr-2 ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                           </span>
                           <span>bln lalu</span>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
            
            {/* Card 2: Active Projects */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
               <CardHeader className="pb-2 p-3 sm:p-6">
                  <div className="flex flex-row items-center justify-between space-y-0">
                     <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                        Proyek Aktif
                     </CardTitle>
                     <div className="p-1.5 sm:p-2 bg-muted rounded-lg">
                        <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-foreground" />
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1">
                     <div className="space-y-1">
                        <div className="text-lg sm:text-3xl font-bold">{stats.activeProjects}</div>
                        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                           <span className="text-green-600 font-medium mr-1 sm:mr-2 flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" /> Active
                           </span>
                           <span>saat ini</span>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
            
            {/* Card 3: New Clients */}
            <Card className="shadow-sm hover:shadow-md transition-shadow col-span-2 sm:col-span-1 lg:col-span-1">
               <CardHeader className="pb-2 p-3 sm:p-6">
                  <div className="flex flex-row items-center justify-between space-y-0">
                     <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                        Klien Baru
                     </CardTitle>
                     <div className="p-1.5 sm:p-2 bg-muted rounded-lg">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-foreground" />
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1">
                     <div className="space-y-1">
                        <div className="text-lg sm:text-3xl font-bold">+{stats.newClients}</div>
                        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                           <span className="text-green-600 font-medium mr-1 sm:mr-2">
                              Bulan Ini
                           </span>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Client Statistics Chart */}
        <Card className="col-span-1 lg:col-span-4 border shadow-sm dark:bg-zinc-950/50">
          <CardHeader>
            <CardTitle>Statistik Order</CardTitle>
            <CardDescription>
               Jumlah order yang masuk setiap bulan tahun ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                     <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="clients" stroke="#3b82f6" fillOpacity={1} fill="url(#colorClients)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Calendar & Upcoming */}
         <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
            <Card className="border shadow-sm dark:bg-zinc-950/50">
               <CardHeader className="pb-3">
                  <CardTitle>Jadwal Studio</CardTitle>
                  <CardDescription>Kalender booking dan sesi foto mendatang.</CardDescription>
               </CardHeader>
               <CardContent className="flex justify-center p-4">
                  <Calendar
                     mode="single"
                     selected={date}
                     onSelect={setDate}
                     className="rounded-md border bg-background"
                     modifiers={{ booked: bookedDays }}
                     modifiersClassNames={{ 
                        booked: "bg-primary/20 text-primary font-bold hover:bg-primary/30 rounded-md" 
                     }}
                  />
               </CardContent>
            </Card>

            <Card className="border shadow-sm dark:bg-zinc-950/50 flex-1">
                <CardHeader className="pb-3">
                   <CardTitle>Booking Mendatang</CardTitle>
                   <CardDescription>Sesi foto yang akan datang minggu ini.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                      {recentBookings.length === 0 ? (
                          <div className="text-sm text-muted-foreground text-center py-4">Tidak ada booking mendatang.</div>
                      ) : (
                          recentBookings.map((booking) => (
                             <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                   <p className="font-medium text-sm leading-none">{booking.client_name}</p>
                                   <p className="text-xs text-muted-foreground">{booking.package_name}</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-sm font-medium">{format(new Date(booking.event_date), "dd MMM")}</p>
                                   <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'} className="text-[10px] h-5 px-1.5">
                                      {booking.status}
                                   </Badge>
                                </div>
                             </div>
                          ))
                      )}
                   </div>
                </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
