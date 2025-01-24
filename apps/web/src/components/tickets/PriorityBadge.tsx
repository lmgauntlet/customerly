import { cn } from '@/lib/utils'

type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

interface PriorityBadgeProps {
  priority: TicketPriority
  className?: string
}

const priorityConfig = {
  low: {
    label: 'Low',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  },
  medium: {
    label: 'Medium',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  high: {
    label: 'High',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  },
  urgent: {
    label: 'Urgent',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]

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
