import { LucideIcon } from 'lucide-react'

type AdminBadgeProps = {
  children: React.ReactNode
  color?: 'yellow' | 'blue' | 'red' | 'green' | 'purple' | 'pink' | 'cyan'
  icon?: LucideIcon
}

const colorClasses = {
  yellow: 'bg-[#050a14] border-[#facc15] text-[#facc15]',
  blue: 'bg-[#050a14] border-[#3b82f6] text-[#3b82f6]',
  red: 'bg-[#050a14] border-red-500/60 text-red-400',
  green: 'bg-[#050a14] border-emerald-500/60 text-emerald-400',
  purple: 'bg-[#050a14] border-purple-500/60 text-purple-400',
  pink: 'bg-[#050a14] border-pink-500/60 text-pink-400',
  cyan: 'bg-[#050a14] border-cyan-500/60 text-cyan-400',
}

export default function AdminBadge({ children, color = 'yellow', icon: Icon }: AdminBadgeProps) {
  return (
    <span className={`px-2.5 py-0.5 rounded-[2px] border text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow ${colorClasses[color]}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  )
}
