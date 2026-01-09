'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, ROLE_PERMISSIONS, DEFAULT_USERS } from '@/types'

interface AuthContextType {
  user: User | null
  users: User[]
  setUser: (user: User) => void
  hasPermission: (page: 'consultation' | 'contract' | 'settlement' | 'admin', action: 'read' | 'write') => boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [users] = useState<User[]>(DEFAULT_USERS)
  const [isLoading, setIsLoading] = useState(true)

  // localStorage에서 사용자 불러오기
  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId')
    if (savedUserId) {
      const foundUser = users.find(u => u.id === parseInt(savedUserId))
      if (foundUser) {
        setUserState(foundUser)
      }
    }
    setIsLoading(false)
  }, [users])

  // 사용자 변경
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
    <AuthContext.Provider value={{ user, users, setUser, hasPermission, isLoading }}>
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
