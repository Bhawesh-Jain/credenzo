// DatePicker component
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "./ui/calendar"

interface DatePickerProps {
  date: Date | undefined
  onChange: (date: Date | undefined) => void
  minYear?: number
}

export function DatePicker({ date, onChange, minYear = 0 }: DatePickerProps) {
  const currentYear = new Date().getFullYear()
  const yearAgo = currentYear - minYear
  const maxDate = new Date()
  maxDate.setFullYear(yearAgo)
  maxDate.setHours(23, 59, 59, 999) // End of the day

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick your birth date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
          fromYear={1900}
          toDate={maxDate}
          disabled={(date) => date > maxDate}
        />
      </PopoverContent>
    </Popover>
  )
}