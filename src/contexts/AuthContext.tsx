'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { User, UserRole, ROLE_PERMISSIONS } from '@/types'
import { supabase } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  user: User | null
  users: User[]
  setUser: (user: User) => void
  login: (name: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasPermission: (page: 'consultation' | 'contract' | 'settlement' | 'admin', action: 'read' | 'write') => boolean
  isLoading: boolean
  isAuthenticated: boolean
  refreshUsers: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 공개 페이지 (로그인 불필요)
const PUBLIC_PATHS = ['/login', '/register']

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUserState] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Supabase에서 사용자 목록 불러오기
  const refreshUsers = useCallback(async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('is_approved', true)
      .order('id')

    if (data) {
      const mappedUsers: User[] = data.map(u => ({
        id: u.id,
        name: u.name,
        role: u.role as UserRole,
      }))
      setUsers(mappedUsers)
    }
  }, [])

  // 초기 로드 - localStorage에서 사용자 복원
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)

      // 승인된 사용자 목록 불러오기
      await refreshUsers()

      // localStorage에서 저장된 사용자 ID 확인
      const savedUserId = localStorage.getItem('currentUserId')

      if (savedUserId) {
        // Supabase에서 해당 사용자 정보 확인
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', parseInt(savedUserId))
          .eq('is_approved', true)
          .single()

        if (userData) {
          setUserState({
            id: userData.id,
            name: userData.name,
            role: userData.role as UserRole,
          })
        } else {
          // 유효하지 않은 사용자 - localStorage 정리
          localStorage.removeItem('currentUserId')
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [refreshUsers])

  // 인증 상태 확인 후 리다이렉트
  useEffect(() => {
    if (isLoading) return

    const isPublicPath = PUBLIC_PATHS.includes(pathname)

    if (!user && !isPublicPath) {
      // 로그인 안 됨 + 비공개 페이지 -> 로그인 페이지로
      router.push('/login')
    } else if (user && isPublicPath) {
      // 로그인 됨 + 공개 페이지 -> 대시보드로
      router.push('/')
    }
  }, [user, isLoading, pathname, router])

  // 로그인
  const login = async (name: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('name', name)
      .eq('password', password)
      .single()

    if (error || !userData) {
      return { success: false, error: '이름 또는 비밀번호가 일치하지 않습니다.' }
    }

    if (!userData.is_approved) {
      return { success: false, error: '관리자 승인 대기 중입니다.' }
    }

    const loggedInUser: User = {
      id: userData.id,
      name: userData.name,
      role: userData.role as UserRole,
    }

    setUserState(loggedInUser)
    localStorage.setItem('currentUserId', userData.id.toString())

    // 사용자 목록 새로고침
    await refreshUsers()

    return { success: true }
  }

  // 로그아웃
  const logout = () => {
    setUserState(null)
    localStorage.removeItem('currentUserId')
    router.push('/login')
  }

  // 사용자 변경 (Sidebar에서 전환)
  const setUser = (newUser: User) => {
    setUserState(newUser)
    localStorage.setItem('currentUserId', newUser.id.toString())
  }

  // 권한 체크
  const hasPermission = (
    page: 'consultation' | 'contract' | 'settlement' | 'admin',
    action: 'read' | 'write'
  ): boolean => {
    if (!user) return false
    return ROLE_PERMISSIONS[user.role][page][action]
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        setUser,
        login,
        logout,
        hasPermission,
        isLoading,
        isAuthenticated: !!user,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
