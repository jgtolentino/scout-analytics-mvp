import * as React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  value: [Date, Date]
  onChange: (range: [Date, Date]) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [startDate, endDate] = value

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value)
    onChange([newStartDate, endDate])
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value)
    onChange([startDate, newEndDate])
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex gap-2">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={format(startDate, "yyyy-MM-dd")}
            onChange={handleStartDateChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">End Date</label>
          <input
            type="date"
            value={format(endDate, "yyyy-MM-dd")}
            onChange={handleEndDateChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )
}