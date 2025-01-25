import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "open" | "in_progress" | "resolved" | "closed"

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusColors: Record<Status, { bg: string; text: string }> = {
  open: { bg: "bg-blue-100", text: "text-blue-800" },
  in_progress: { bg: "bg-yellow-100", text: "text-yellow-800" },
  resolved: { bg: "bg-green-100", text: "text-green-800" },
  closed: { bg: "bg-gray-100", text: "text-gray-800" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = statusColors[status]
  const displayText = status.replace("_", " ")
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
      {displayText}
    </Badge>
  )
}
