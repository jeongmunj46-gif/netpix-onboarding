'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, BookOpen, Plus, ChevronRight, Zap } from 'lucide-react'

const links = [
  {
    name: '상담 스크립트',
    href: '/scripts',
    icon: MessageSquare,
    description: '상황별 멘트 복사',
    color: 'from-blue-500 to-indigo-500',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    name: '업무 가이드',
    href: '/guidelines',
    icon: BookOpen,
    description: '필수 주의사항 확인',
    color: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    name: '새 상담 등록',
    href: '/consultations?new=true',
    icon: Plus,
    description: '고객 상담 기록',
    color: 'from-violet-500 to-purple-500',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
]

export function QuickLinks() {
  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          빠른 링크
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200"
            >
              <div className={`p-2.5 rounded-xl ${link.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`h-4 w-4 ${link.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">{link.name}</p>
                <p className="text-xs text-slate-400">{link.description}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
