'use client'

import { Bell, Search, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="flex items-center justify-between h-16 px-6">
        {/* 제목 영역 */}
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-3">
          {/* 날짜 */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">{today}</span>
          </div>

          {/* 검색 */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="검색..."
              className="pl-9 w-64 h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-300 transition-all rounded-lg"
            />
          </div>

          {/* 알림 */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-lg hover:bg-slate-100"
          >
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
