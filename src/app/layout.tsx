import type { Metadata } from 'next'
import './globals.css'
import { AuthLayout } from '@/components/layout'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: '넷픽스 통신팀 업무 시스템',
  description: '이사대학 통신팀 신입 직원 업무 관리 시스템',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthProvider>
          <AuthLayout>
            {children}
          </AuthLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
