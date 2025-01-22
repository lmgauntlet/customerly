import { TicketStatus } from '@/types/tickets'

interface StatusBadgeProps {
  status: TicketStatus
}

const styles = {
  new: 'bg-blue-100 text-blue-700',
  open: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-gray-100 text-gray-700',
  closed: 'bg-gray-100 text-gray-700',
} as const

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  )
}
