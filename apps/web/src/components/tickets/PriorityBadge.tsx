import { TicketPriority } from '@/types/tickets'

interface PriorityBadgeProps {
  priority: TicketPriority
}

const styles = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
} as const

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  )
}
