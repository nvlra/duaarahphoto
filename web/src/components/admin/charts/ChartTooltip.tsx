"use client"

import React from "react"

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  formatter?: (value: number) => string
}

export const ChartTooltip = ({ active, payload, label, formatter }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {label}
              </span>
            </div>
            {payload.map((item, index) => (
                <div key={index} className="col-span-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between py-1">
                     <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-muted-foreground">
                        <div 
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }} 
                        />
                        {item.name || "Value"} :
                     </span>
                     <span 
                        className="text-xs sm:text-sm font-bold font-mono"
                        style={{ color: item.color }}
                     >
                       {formatter ? formatter(item.value) : item.value}
                     </span>
                </div>
            ))}
        </div>
      </div>
    )
  }

  return null
}
