'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Loader2 } from 'lucide-react'

// 공개 페이지 (로그인 불필요)
const PUBLIC_PATHS = ['/login', '/register']

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth()
  const pathname = usePathname()

  const isPublicPath = PUBLIC_PATHS.includes(pathname)

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-500 text-sm">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 공개 페이지 (로그인/회원가입)
  if (isPublicPath) {
    return <>{children}</>
  }

  // 로그인 필요한 페이지 - user가 없으면 AuthContext에서 리다이렉트 처리
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-500 text-sm">로그인 페이지로 이동 중...</p>
        </div>
      </div>
    )
  }

  // 로그인된 사용자 - Sidebar 포함 레이아웃
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
