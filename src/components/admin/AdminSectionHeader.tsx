import { LucideIcon } from 'lucide-react'

type AdminSectionHeaderProps = {
  children?: React.ReactNode
  icon?: LucideIcon
  iconColor?: string
  right?: React.ReactNode
  className?: string
}

export default function AdminSectionHeader({
  children,
  icon: Icon,
  iconColor = 'text-[#facc15]',
  right,
  className = '',
}: AdminSectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
        {Icon && <Icon className={iconColor} size={16} />}
        {children}
      </h2>
      {right}
    </div>
  )
}
