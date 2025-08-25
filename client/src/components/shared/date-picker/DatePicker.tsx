"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

interface DatePickerProps {
  label: string
  isRequired?: boolean
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
}

export function DatePicker({ 
  label, 
  isRequired = false, 
  selected, 
  onSelect 
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(undefined)

  // Use external selected value if provided, otherwise use internal state
  const currentDate = selected !== undefined ? selected : internalDate

  console.log("date", currentDate)
  console.log("open", open)
  console.log("selected prop", selected)
  console.log("onSelect prop", onSelect)

  const handleDateSelect = (date: Date | undefined) => {
    console.log("Date selected:", date)
    
    if (onSelect) {
      // If onSelect is provided, use it (controlled component)
      onSelect(date)
    } else {
      // Otherwise use internal state (uncontrolled component)
      setInternalDate(date)
    }
    
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-3 relative">
      <Label htmlFor="date" className="px-1">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {/* Simple test - manual toggle */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="w-48 justify-between font-normal"
          onClick={(e) => {
            console.log("Button clicked, current open state:", open)
            console.log("Event:", e)
            e.preventDefault()
            e.stopPropagation()
            setOpen(!open)
            console.log("Setting open to:", !open)
          }}
        >
          {currentDate ? currentDate.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
        
        {/* Manual dropdown instead of Popover */}
        {open && (
          <div 
            className="absolute top-full left-0 mt-1 z-[9999] bg-white border border-gray-200 rounded-md shadow-lg p-3"
            onMouseDown={(e) => {
              console.log("Calendar container clicked")
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => {
                console.log("Calendar onSelect called with:", date)
                handleDateSelect(date)
              }}
              disabled={(date) => {
                // Disable future dates (for date of birth)
                const today = new Date()
                today.setHours(23, 59, 59, 999)
                return date > today || date < new Date('1900-01-01')
              }}
              onDayClick={(date, modifiers, e) => {
                console.log("Day clicked event:", date, modifiers)
                e?.preventDefault?.()
                e?.stopPropagation?.()
              }}
            />
          </div>
        )}
      </div>
      
      {/* Backup: Try with Popover but simpler */}
      {/* <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-48 justify-between font-normal"
          >
            Popover Test
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Simple popover content</div>
        </PopoverContent>
      </Popover> */}
    </div>
  )
}
