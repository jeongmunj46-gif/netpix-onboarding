'use client'

import Link from 'next/link'
import { LucideIcon, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  href: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  description?: string
}

const colorConfig = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconBg: 'bg-blue-400/20',
    shadow: 'shadow-blue-500/20',
    hover: 'hover:shadow-blue-500/30',
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    iconBg: 'bg-emerald-400/20',
    shadow: 'shadow-emerald-500/20',
    hover: 'hover:shadow-emerald-500/30',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    iconBg: 'bg-amber-400/20',
    shadow: 'shadow-amber-500/20',
    hover: 'hover:shadow-amber-500/30',
  },
  red: {
    bg: 'bg-gradient-to-br from-rose-500 to-red-600',
    iconBg: 'bg-rose-400/20',
    shadow: 'shadow-rose-500/20',
    hover: 'hover:shadow-rose-500/30',
  },
  purple: {
    bg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconBg: 'bg-violet-400/20',
    shadow: 'shadow-violet-500/20',
    hover: 'hover:shadow-violet-500/30',
  },
}

export function StatCard({ title, value, icon: Icon, href, color, description }: StatCardProps) {
  const config = colorConfig[color]

  return (
    <Link href={href}>
      <Card className={cn(
        'group relative overflow-hidden border-0 cursor-pointer transition-all duration-300',
        config.bg,
        'shadow-lg',
        config.shadow,
        'hover:-translate-y-1 hover:shadow-xl',
        config.hover
      )}>
        <CardContent className="p-6 text-white">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className={cn('p-2.5 rounded-xl', config.iconBg)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <div className="mt-4">
              <p className="text-white/80 text-sm font-medium">{title}</p>
              <p className="text-3xl font-bold mt-1 tracking-tight">{value}<span className="text-lg ml-0.5">건</span></p>
              {description && (
                <p className="text-white/60 text-xs mt-2">{description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
