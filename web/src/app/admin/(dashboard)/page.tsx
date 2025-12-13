"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { DollarSign, ShoppingBag, Users, TrendingUp, MapPin } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

// Mock data for client statistics
const clientData = [
  { month: "Jan", clients: 12 },
  { month: "Feb", clients: 15 },
  { month: "Mar", clients: 18 },
  { month: "Apr", clients: 14 },
  { month: "May", clients: 20 },
  { month: "Jun", clients: 22 },
  { month: "Jul", clients: 19 },
  { month: "Aug", clients: 25 },
  { month: "Sep", clients: 23 },
  { month: "Oct", clients: 28 },
  { month: "Nov", clients: 26 },
  { month: "Dec", clients: 30 },
]


export default function AdminDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const isDesktop = useMediaQuery("(min-width: 1800px)") // Strictly show 2 months only on Full HD Desktop monitors (1920px), preventing tablet issues

  const bookedDays = [
    new Date(2025, 11, 15),
    new Date(2025, 11, 20),
    new Date(2025, 11, 23),
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
      </div>
      
      {/* Visual Header Section - Monochrome/Clean Style */}
      {/* Visual Header Section - Monochrome/Clean Style */}
      {/* Visual Header Section - Monochrome/Clean Style */}
      <div>
         <div className="grid gap-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
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
                        <div className="text-lg sm:text-3xl font-bold">Rp 45.2jt</div>
                        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                           <span className="text-green-600 font-medium mr-1 sm:mr-2">
                              +20.1%
                           </span>
                           <span>bln lalu</span>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
            
            {/* Card 2 */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
               <CardHeader className="pb-2 p-3 sm:p-6">
                  <div className="flex flex-row items-center justify-between space-y-0">
                     <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                        Aktif
                     </CardTitle>
                     <div className="p-1.5 sm:p-2 bg-muted rounded-lg">
                        <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-foreground" />
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1">
                     <div className="space-y-1">
                        <div className="text-lg sm:text-3xl font-bold">25</div>
                        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                           <span className="text-green-600 font-medium mr-1 sm:mr-2 flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" /> +5
                           </span>
                           <span>minggu ini</span>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
            
            {/* Card 3 - Make it full width on mobile or keep grid */}
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
                        <div className="text-lg sm:text-3xl font-bold">+12</div>
                        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                           <span className="text-green-600 font-medium mr-1 sm:mr-2">
                              Rising
                           </span>
                           <span>Growth</span>
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
            <CardTitle>Statistik Klien</CardTitle>
            <CardDescription>
               Jumlah klien yang dilayani setiap bulan tahun ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={clientData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                     <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                     itemStyle={{ color: '#fff' }}
                     formatter={(value: number) => [`${value} klien`, 'Jumlah']}
                  />
                  <Area name="Klien" type="monotone" dataKey="clients" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorClients)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>


        {/* Calendar & Events Section */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
           <Card className="h-full shadow-md">
            <CardHeader>
              <CardTitle>Jadwal Pemotretan</CardTitle>
              <CardDescription>
                Agenda mendatang Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mb-4"
                numberOfMonths={isDesktop ? 2 : 1}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                modifiers={{ booked: bookedDays }}
                modifiersClassNames={{ 
                    booked: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 font-bold rounded-md", 
                }}
                classNames={{
                    today: "bg-secondary text-secondary-foreground dark:bg-muted/50 font-bold rounded-md"
                }}
              />
              
              <div className="w-full space-y-3">
                 <h4 className="font-semibold text-sm">Event pada {date?.toDateString()}</h4>
                 <div className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="font-semibold text-foreground">Sarah & John Wedding</p>
                          <p className="text-xs text-muted-foreground mt-0.5">08:00 - 16:00 WIB</p>
                       </div>
                       <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                          Booked
                       </Badge>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t flex items-center justify-between">
                       <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          Hotel Mulia
                       </div>
                       <Button variant="secondary" size="sm" className="h-6 text-xs px-2" asChild>
                          <a href="https://maps.google.com/?q=Hotel+Mulia" target="_blank" rel="noreferrer">
                             Buka Peta
                          </a>
                       </Button>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
