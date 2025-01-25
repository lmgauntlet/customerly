import { cn } from '@/lib/utils'
import Image from 'next/image'

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

  const dimensions = {
    sm: 16,
    md: 32,
    lg: 48
  }

  const imageUrl = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`

  // In test environment or for SVG images, use Next.js Image
  if (process.env.NODE_ENV === 'test' || imageUrl.endsWith('.svg') || imageUrl.includes('dicebear')) {
    return (
      <div 
        className={cn(
          'rounded-full overflow-hidden flex-shrink-0',
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={dimensions[size]}
          height={dimensions[size]}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // For non-SVG images in production, use Next.js Image
  return (
    <div 
      className={cn(
        'rounded-full overflow-hidden flex-shrink-0',
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={name}
        width={dimensions[size]}
        height={dimensions[size]}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
