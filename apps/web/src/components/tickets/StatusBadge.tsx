import { cn } from '@/lib/utils'

type TicketStatus = 'new' | 'open' | 'in_progress' | 'resolved' | 'closed'

interface StatusBadgeProps {
  status: TicketStatus
  className?: string
}

const statusConfig = {
  new: {
    label: 'New',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  open: {
    label: 'Open',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  closed: {
    label: 'Closed',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
