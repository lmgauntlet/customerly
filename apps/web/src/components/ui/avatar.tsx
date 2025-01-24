import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  email: string
  avatarUrl?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ name, email, avatarUrl, className, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  // If SVG URL is provided, render it directly in an img tag
  if (avatarUrl?.endsWith('.svg') || avatarUrl?.includes('dicebear')) {
    return (
      <div className={cn('rounded-full overflow-hidden flex-shrink-0', sizeClasses[size], className)}>
        <img
          src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`}
          alt={name}
          className="w-full h-full"
        />
      </div>
    )
  }

  // For non-SVG images, use a div with background image
  return (
    <div
      className={cn(
        'rounded-full overflow-hidden flex-shrink-0 bg-cover bg-center bg-no-repeat',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundImage: `url(${avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`})`
      }}
      title={name}
    />
  )
}
