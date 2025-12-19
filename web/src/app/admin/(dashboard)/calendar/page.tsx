"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  parseISO 
} from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Package, 
  Clock,
  ExternalLink,
  Download
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/components/ui/ios-toast"
import { cn } from "@/lib/utils"

interface OrderEvent {
  id: string
  client_name: string
  event_date: string
  location: string
  maps_url?: string
  package_name: string
  status: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<OrderEvent[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('id, client_name, event_date, location, maps_url, package_name, status')
        .neq('status', 'cancelled')
        .order('event_date', { ascending: true })

      if (error) throw error
      if (data) {
          setEvents(data as OrderEvent[])
      }
    } catch (err) {
      console.error(err)
      toast.error("Gagal memuat jadwal")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [currentDate])

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const jumpToToday = () => setCurrentDate(new Date())

  const getEventsForDay = (date: Date) => {
    return events.filter(event => event.event_date && isSameDay(parseISO(event.event_date), date))
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (event: OrderEvent) => {
    const start = event.event_date.replace(/-/g, '')
    // Assume all day event or explicit time if we had it. For now, all day.
    const dates = `${start}/${start}` 
    
    const details = `Client: ${event.client_name}\nPackage: ${event.package_name}\nID: ${event.id}`
    const location = event.location || ""
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Job: ${event.client_name}`)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`
  }

  // Generate ICS File
  const downloadIcs = (event: OrderEvent) => {
    const start = event.event_date.replace(/-/g, '')
    const title = `Job: ${event.client_name}`
    const description = `Client: ${event.client_name}\\nPackage: ${event.package_name}\\nID: ${event.id}`
    const location = event.location || ""

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${start}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', `${event.client_name}_event.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kalender Acara</h2>
          <p className="text-muted-foreground">Jadwal pemotretan dan acara mendatang.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "min-w-[180px] justify-start text-left font-normal",
                  !currentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(currentDate, 'MMMM yyyy', { locale: idLocale })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => date && setCurrentDate(date)}
                initialFocus
                locale={idLocale}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
              />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-0">
           {/* Days Header */}
           <div className="grid grid-cols-7 border-b bg-muted/50">
             {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => (
               <div key={day} className="py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-muted-foreground">
                 {day}
               </div>
             ))}
           </div>
           
           {/* Calendar Grid */}
           <div className="grid grid-cols-7 auto-rows-[50px] sm:auto-rows-[120px] divide-x divide-y bg-background">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isToday = isSameDay(day, new Date())
                
                return (
                  <div 
                    key={day.toString()} 
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "relative p-1 sm:p-2 transition-colors hover:bg-muted/50 cursor-pointer flex flex-col gap-1 items-center sm:items-stretch",
                      !isCurrentMonth && "bg-muted/10 text-muted-foreground/50",
                      isToday && "bg-blue-50/50 dark:bg-blue-950/20"
                    )}
                  >
                    <div className="flex justify-center sm:justify-between items-start w-full">
                        <span className={cn(
                            "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full",
                            isToday && "bg-primary text-primary-foreground"
                        )}>
                            {format(day, 'd')}
                        </span>
                        {dayEvents.length > 0 && (
                             <Badge variant="secondary" className="text-[10px] px-1 h-5 hidden sm:flex">
                                 {dayEvents.length} Acara
                             </Badge>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-hidden space-y-1 mt-1 w-full">
                        {/* Mobile View: Dots only */}
                        <div className="flex sm:hidden flex-wrap gap-0.5 justify-center">
                            {dayEvents.slice(0, 4).map((_, i) => (
                                <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
                            ))}
                            {dayEvents.length > 4 && (
                                <span className="text-[8px] text-muted-foreground leading-none">+</span>
                            )}
                        </div>

                        {/* Desktop View: Text Labels */}
                        <div className="hidden sm:block space-y-1">
                            {dayEvents.slice(0, 3).map(event => (
                                <div key={event.id} className="text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded truncate border-l-2 border-primary">
                                    {event.client_name}
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="text-[10px] text-muted-foreground pl-1">
                                    +{dayEvents.length - 3} lainnya
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
                )
              })}
           </div>


        </CardContent>
      </Card>

      {/* Mobile Only Event List - Moved Outside Card */}
      <div className="sm:hidden space-y-4 pb-10">
        <h3 className="font-semibold text-lg px-1">Jadwal Bulan {format(currentDate, 'MMMM yyyy', { locale: idLocale })}</h3>
        {events
            .filter(e => {
                const eventDate = parseISO(e.event_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const isSelectedMonth = isSameMonth(eventDate, currentDate);
                
                // Hide past events logic
                return isSelectedMonth && eventDate >= today;
            })
            .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
            .length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                Tidak ada jadwal acara di bulan ini
                </div>
            ) : (
                <div className="flex flex-col bg-card border rounded-lg shadow-sm px-3">
                {events
                    .filter(e => {
                        const eventDate = parseISO(e.event_date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // Normalize today to midnight
                        
                        // Check if same month as selected calendar month
                        const isSelectedMonth = isSameMonth(eventDate, currentDate);
                        
                        // Check if event is passed (comparable for hiding)
                        // If displayed month is PAST month, maybe we show nothing? Or just history?
                        // User said "kalau udah lewat tanggalnya gaperlu ditampilin".
                        // Logic: Show if (SelectedMonth == EventMonth) AND (EventDate >= Today).
                        // Note: If user navigates to future month, EventDate >= Today is true.
                        // If user navigates to past month, EventDate >= Today is false (mostly).
                        // Let's perform simple: eventDate >= today.
                        
                        return isSelectedMonth && eventDate >= today;
                    })
                    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                    .map((event) => (
                    <div 
                        key={event.id} 
                        className="grid grid-cols-[3.5rem_1fr_auto] gap-3 py-3 border-b last:border-0 border-border/50 items-start"
                    >
                        {/* Date Column */}
                        <div className="font-bold text-sm text-muted-foreground/80 shrink-0 pt-0.5">
                            {format(parseISO(event.event_date), 'dd MMM', { locale: idLocale })}
                        </div>

                        {/* Content Column */}
                        <div className="min-w-0 flex flex-col gap-0.5">
                            <div className="font-medium text-sm truncate text-foreground">
                            {event.client_name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                                <span>{event.package_name}</span>
                                {event.location && (
                                <span className="opacity-70">
                                    <span className="mx-1.5">•</span>
                                    {event.location}
                                </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Status Column */}
                        <div className="pt-2">
                            <div 
                            className={cn(
                                "h-1.5 w-1.5 rounded-full", 
                                event.status === 'confirmed' ? "bg-green-500" : 
                                event.status === 'pending' ? "bg-yellow-500" : "bg-muted"
                            )} 
                            />
                        </div>
                    </div>
                    ))}
                </div>
            )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                 <CalendarIcon className="h-5 w-5 text-primary" />
                 {selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy', { locale: idLocale })}
            </DialogTitle>
            <DialogDescription>
                {selectedDayEvents.length > 0 
                  ? `${selectedDayEvents.length} acara terjadwal pada tanggal ini.`
                  : "Tidak ada acara terjadwal."}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
             <div className="space-y-4 py-2">
                {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map(event => (
                        <div key={event.id} className="group relative flex flex-col gap-3 rounded-lg border p-4 hover:bg-muted/40 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-semibold leading-none">{event.client_name}</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Package className="h-3 w-3" /> {event.package_name}
                                    </p>
                                </div>
                                <Badge variant={
                                    event.status === 'confirmed' ? 'default' : 
                                    event.status === 'completed' ? 'secondary' : 'outline'
                                }>
                                    {event.status}
                                </Badge>
                            </div>
                            
                            {event.location && (
                                <div 
                                    className="text-sm text-muted-foreground flex items-center justify-between bg-muted/50 p-2 rounded cursor-pointer hover:bg-muted/80 transition-colors group/loc"
                                    onClick={() => {
                                        const url = event.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
                                        window.open(url, '_blank');
                                    }}
                                    title="Buka di Google Maps"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover/loc:opacity-50" />
                                </div>
                            )}

                                <Button 
                                    className="w-full" size="sm"
                                    onClick={() => {
                                        const isApple = /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);
                                        if (isApple) {
                                            toast.success("Mendownload Event", "Membuka Apple Calendar...");
                                            downloadIcs(event);
                                        } else {
                                            toast.success("Membuka Google Calendar");
                                            window.open(getGoogleCalendarUrl(event), '_blank');
                                        }
                                    }}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" /> 
                                    Add to Calendar
                                </Button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <CalendarIcon className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-sm">Kosong</p>
                    </div>
                )}
             </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
