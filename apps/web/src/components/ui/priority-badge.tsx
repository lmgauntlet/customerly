import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Priority = "low" | "medium" | "high" | "urgent"

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

const priorityColors: Record<Priority, { bg: string; text: string }> = {
  low: { bg: "bg-green-100", text: "text-green-800" },
  medium: { bg: "bg-blue-100", text: "text-blue-800" },
  high: { bg: "bg-orange-100", text: "text-orange-800" },
  urgent: { bg: "bg-red-100", text: "text-red-800" },
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const colors = priorityColors[priority]
  return (
    <Badge
      variant="secondary"
      className={cn(
        "capitalize",
        colors.bg,
        colors.text,
        "border-0",
        className
      )}
    >
      {priority}
    </Badge>
  )
}
