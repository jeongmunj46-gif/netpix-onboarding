'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Phone,
  FileText,
  Calculator,
  MessageSquare,
  BookOpen,
  Settings,
  ChevronLeft,
  Menu,
  Sparkles,
  User,
  ChevronDown,
  Shield,
  Lock,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { ROLE_LABELS } from '@/types'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  description: string
  badge?: number
  highlight?: boolean
}

const navigation: NavItem[] = [
  {
    name: '대시보드',
    href: '/',
    icon: LayoutDashboard,
    description: '오늘의 업무 현황',
  },
  {
    name: '상담 관리',
    href: '/consultations',
    icon: Phone,
    description: '고객 상담 기록',
  },
  {
    name: '계약 관리',
    href: '/contracts',
    icon: FileText,
    description: '접수/설치 진행',
  },
  {
    name: '정산 관리',
    href: '/settlements',
    icon: Calculator,
    description: '수수료/마진 관리',
  },
]

const resources: NavItem[] = [
  {
    name: '상담 스크립트',
    href: '/scripts',
    icon: MessageSquare,
    description: '상황별 멘트 복사',
    highlight: true,
  },
  {
    name: '업무 가이드',
    href: '/guidelines',
    icon: BookOpen,
    description: '필수 주의사항',
    highlight: true,
  },
]

const admin: NavItem[] = [
  {
    name: '관리자 설정',
    href: '/admin',
    icon: Settings,
    description: '시스템 설정',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, users, setUser, hasPermission, logout } = useAuth()

  // 페이지별 권한 체크
  const getPagePermission = (href: string): 'full' | 'readonly' | 'none' => {
    if (!user) return 'none'

    if (href === '/settlements') {
      if (hasPermission('settlement', 'write')) return 'full'
      if (hasPermission('settlement', 'read')) return 'readonly'
      return 'none'
    }
    if (href === '/admin') {
      if (hasPermission('admin', 'write')) return 'full'
      if (hasPermission('admin', 'read')) return 'readonly'
      return 'none'
    }
    return 'full'
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href
    const Icon = item.icon
    const permission = getPagePermission(item.href)

    // 접근 불가
    if (permission === 'none') {
      return (
        <div
          className={cn(
            'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm cursor-not-allowed opacity-50',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? `${item.name} (접근 불가)` : '접근 권한이 없습니다'}
        >
          <div className="flex items-center justify-center text-slate-300">
            <Lock className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-slate-400">{item.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded">접근불가</span>
              </div>
              <p className="text-xs truncate mt-0.5 text-slate-300">{item.description}</p>
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        href={item.href}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          item.highlight && !isActive && 'text-blue-600 hover:bg-blue-50',
          collapsed && 'justify-center px-2'
        )}
        title={collapsed ? item.name : undefined}
      >
        <div className={cn(
          'flex items-center justify-center',
          isActive ? 'text-white' : item.highlight ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'
        )}>
          <Icon className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                'truncate font-medium',
                isActive ? 'text-white' : ''
              )}>{item.name}</span>
              {item.badge && item.badge > 0 && (
                <span className={cn(
                  'inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-semibold rounded-full',
                  isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                )}>
                  {item.badge}
                </span>
              )}
              {item.highlight && !isActive && (
                <Sparkles className="h-3 w-3 text-amber-500" />
              )}
              {permission === 'readonly' && (
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded">읽기전용</span>
              )}
            </div>
            <p className={cn(
              'text-xs truncate mt-0.5',
              isActive ? 'text-blue-100' : 'text-slate-400'
            )}>{item.description}</p>
          </div>
        )}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white/95 backdrop-blur-sm border-r border-slate-200/80 transition-all duration-300 shadow-sm',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/80">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm tracking-tight">넷픽스 통신팀</h1>
              <p className="text-xs text-slate-400">업무 관리 시스템</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-lg hover:bg-slate-100"
        >
          {collapsed ? <Menu className="h-4 w-4 text-slate-500" /> : <ChevronLeft className="h-4 w-4 text-slate-500" />}
        </Button>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* 업무 관리 */}
        <div>
          {!collapsed && (
            <h2 className="px-3 mb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              업무 관리
            </h2>
          )}
          <div className="space-y-1.5">
            {navigation.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* 자료실 */}
        <div>
          {!collapsed && (
            <h2 className="px-3 mb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              자료실
            </h2>
          )}
          <div className="space-y-1.5">
            {resources.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* 설정 */}
        <div>
          {!collapsed && (
            <h2 className="px-3 mb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              설정
            </h2>
          )}
          <div className="space-y-1.5">
            {admin.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* 푸터 - 사용자 선택 UI */}
      <div className="p-3 border-t border-slate-200/80">
        {!collapsed ? (
          <div className="relative">
            {/*
              사용자 선택 버튼
              - 클릭하면 사용자 목록이 펼쳐짐
              - 현재 선택된 사용자와 권한 레벨 표시
            */}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 transition-all"
            >
              {/* 사용자 아바타 */}
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                <User className="h-4 w-4 text-white" />
              </div>

              {/* 사용자 정보 */}
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-slate-700">
                  {user?.name || '사용자 선택'}
                </p>
                {user && (
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {ROLE_LABELS[user.role]}
                  </p>
                )}
              </div>

              {/* 드롭다운 화살표 */}
              <ChevronDown className={cn(
                'h-4 w-4 text-slate-400 transition-transform',
                userMenuOpen && 'rotate-180'
              )} />
            </button>

            {/*
              사용자 선택 드롭다운 메뉴
              - userMenuOpen이 true일 때만 표시
              - 각 사용자를 클릭하면 해당 사용자로 전환
            */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-2">
                  <p className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase">
                    사용자 전환
                  </p>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setUser(u)
                        setUserMenuOpen(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        user?.id === u.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-slate-50 text-slate-600'
                      )}
                    >
                      {/* 권한 레벨별 색상 아이콘 */}
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        u.role === 'c-level' && 'bg-purple-100',
                        u.role === 'director' && 'bg-blue-100',
                        u.role === 'staff' && 'bg-slate-100'
                      )}>
                        <Shield className={cn(
                          'h-4 w-4',
                          u.role === 'c-level' && 'text-purple-600',
                          u.role === 'director' && 'text-blue-600',
                          u.role === 'staff' && 'text-slate-500'
                        )} />
                      </div>

                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-slate-400">{ROLE_LABELS[u.role]}</p>
                      </div>

                      {/* 현재 선택된 사용자 표시 */}
                      {user?.id === u.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
                {/* 로그아웃 버튼 */}
                <div className="border-t border-slate-200 p-2">
                  <button
                    onClick={() => {
                      logout()
                      setUserMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 접힌 상태에서는 아이콘만 표시 */
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex justify-center p-2 rounded-lg hover:bg-slate-100"
            title={user?.name || '사용자 선택'}
          >
            <User className="h-5 w-5 text-slate-500" />
          </button>
        )}
      </div>
    </aside>
  )
}
