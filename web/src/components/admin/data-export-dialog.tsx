"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface DataExportDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onExport: (range: { type: 'all' | 'range', from?: Date, to?: Date }) => void
  title?: string
  description?: string
}

export function DataExportDialog({ 
  isOpen, 
  onOpenChange, 
  onExport,
  title = "Export Data CSV",
  description = "Pilih rentang data yang ingin diexport."
}: DataExportDialogProps) {
  const [exportType, setExportType] = useState<'all' | 'range'>('all')
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(),
  })

  const handleExport = () => {
    onExport({
        type: exportType,
        from: exportType === 'range' ? date.from : undefined,
        to: exportType === 'range' ? date.to : undefined
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <RadioGroup value={exportType} onValueChange={(v) => setExportType(v as 'all' | 'range')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Semua Data (Keseluruhan)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="range" id="range" />
              <Label htmlFor="range">Rentang Tanggal</Label>
            </div>
          </RadioGroup>

          {exportType === 'range' && (
            <div className="grid gap-2 pl-6">
                <div className="grid gap-1">
                    <Label className="text-xs">Dari Tanggal</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal h-9",
                            !date.from && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date.from ? format(date.from, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date.from}
                            onSelect={(d) => setDate(prev => ({ ...prev, from: d }))}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid gap-1">
                    <Label className="text-xs">Sampai Tanggal</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal h-9",
                            !date.to && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date.to ? format(date.to, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date.to}
                            onSelect={(d) => setDate(prev => ({ ...prev, to: d }))}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Download .CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
