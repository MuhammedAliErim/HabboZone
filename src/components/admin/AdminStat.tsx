import { LucideIcon } from 'lucide-react'

type AdminStatProps = {
  label: string
  value: React.ReactNode
  icon?: LucideIcon
  iconColor?: string
  valueColor?: string
}

export default function AdminStat({
  label,
  value,
  icon: Icon,
  iconColor = 'text-[#facc15]',
  valueColor = 'text-white',
}: AdminStatProps) {
  return (
    <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
      {Icon && <Icon className={iconColor} size={18} />}
      <div>
        <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">
          {label}
        </span>
        <span className={`text-sm font-black uppercase ${valueColor}`}>{value}</span>
      </div>
    </div>
  )
}
