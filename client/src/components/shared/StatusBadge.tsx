import * as React from "react"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type VariantProps } from "class-variance-authority"

export interface StatusBadgeProps
  extends React.ComponentProps<"span">,
    Omit<VariantProps<typeof badgeVariants>, "variant"> {
  statusText: string
  badgeColor?: string
  textColor?: string
  variant?: "default" | "secondary" | "destructive" | "outline" | "custom"
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ 
    statusText, 
    badgeColor, 
    textColor, 
    variant = "default", 
    className, 
    style,
    ...props 
  }, ref) => {
    const isCustom = variant === "custom" && (badgeColor || textColor)
    
    const customStyle = isCustom ? {
      backgroundColor: badgeColor || "transparent",
      color: textColor || "inherit",
      borderColor: badgeColor ? "transparent" : undefined,
      ...style
    } : style

    return (
      <Badge
        ref={ref}
        variant={isCustom ? undefined : variant}
        className={cn(
          isCustom && "border-transparent",
          className
        )}
        style={customStyle}
        {...props}
      >
        {statusText}
      </Badge>
    )
  }
)

StatusBadge.displayName = "StatusBadge"

export { StatusBadge }