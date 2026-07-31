import { LucideIcon } from 'lucide-react'

type AdminPageHeaderProps = {
  icon: LucideIcon
  iconColor?: string
  title: string
  subtitle?: React.ReactNode
  badges?: React.ReactNode
  actions?: React.ReactNode
  stats?: React.ReactNode
}

export default function AdminPageHeader({
  icon: Icon,
  iconColor = 'text-[#facc15]',
  title,
  subtitle,
  badges,
  actions,
  stats,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#1e293b]">
      <div>
        {badges && (
          <div className="flex items-center gap-2 mb-2 flex-wrap">{badges}</div>
        )}
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
          <Icon className={iconColor} size={28} /> {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-gray-300 font-bold uppercase tracking-wide mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap shrink-0">
        {stats}
        {actions}
      </div>
    </div>
  )
}
