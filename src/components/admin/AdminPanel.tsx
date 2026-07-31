import { LucideIcon } from 'lucide-react'

type AdminPanelProps = {
  children: React.ReactNode
  className?: string
  headerIcon?: LucideIcon
  headerIconColor?: string
  title?: React.ReactNode
  headerRight?: React.ReactNode
  padding?: boolean
}

export default function AdminPanel({
  children,
  className = '',
  headerIcon: HeaderIcon,
  headerIconColor = 'text-[#facc15]',
  title,
  headerRight,
  padding = true,
}: AdminPanelProps) {
  return (
    <div className={`habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] shadow-2xl ${padding ? 'p-6' : ''} ${className}`}>
      {title && (
        <div className="habbo-box-header flex justify-between items-center">
          <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            {HeaderIcon && <HeaderIcon className={headerIconColor} size={16} />}
            {title}
          </h2>
          {headerRight}
        </div>
      )}
      {children}
    </div>
  )
}
