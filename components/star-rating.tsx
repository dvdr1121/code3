"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1 sm:gap-2">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            className={cn(
              "transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
              "p-0.5 sm:p-1",
            )}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 transition-colors",
                starValue <= value ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30",
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
