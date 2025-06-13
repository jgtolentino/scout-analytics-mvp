import * as React from "react"
import { Check, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((item) => item !== selectedValue))
    } else {
      onChange([...value, selectedValue])
    }
  }

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter((item) => item !== valueToRemove))
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn("justify-between w-full", className)}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-1 max-w-full">
          {value.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {value.slice(0, 3).map((item) => {
            const option = options.find((opt) => opt.value === item)
            return (
              <div
                key={item}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mr-1 mb-1 bg-secondary text-secondary-foreground"
              >
                {option?.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRemove(item)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleRemove(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            )
          })}
          {value.length > 3 && (
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mr-1 mb-1 bg-secondary text-secondary-foreground">
              +{value.length - 3} more
            </div>
          )}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {open && (
        <div className="absolute z-50 w-full mt-1 max-h-64 overflow-auto rounded-md border bg-popover p-0 text-popover-foreground shadow-md">
          <div className="p-1">
            <input 
              placeholder="Search..." 
              className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 px-2"
            />
          </div>
          <div className="p-1">
            {options.length === 0 && (
              <div className="py-6 text-center text-sm">No options found.</div>
            )}
            {options.map((option) => (
              <div
                key={option.value}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}