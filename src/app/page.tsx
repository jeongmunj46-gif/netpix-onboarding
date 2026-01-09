'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { StatCard, QuickLinks, TodaySchedule } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, CalendarCheck, Wrench, CheckCircle, TrendingUp, Target, Loader2, Users } from 'lucide-react'
import { Consultation, ROLE_PERMISSIONS } from '@/types'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Supabase에서 상담 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setConsultations(data as Consultation[])
      }
      setIsLoading(false)
    }

    fetchData()
  }, [])

  // 통계 계산
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayStr = today.toISOString().split('T')[0]

  // 오늘 재상담 예정
  const todayFollowUps = consultations.filter(c => {
    if (!c.follow_up_date) return false
    return c.follow_up_date.split('T')[0] === todayStr
  })

  // 이번 주 설치 예정
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  const weeklyScheduled = consultations.filter(c => {
    if (!c.desired_install_date || c.status !== '계약완료') return false
    const installDate = new Date(c.desired_install_date)
    return installDate >= weekStart && installDate < weekEnd
  }).length

  // 계약 완료
  const completedCount = consultations.filter(c => c.status === '계약완료').length

  // 주간 현황
  const weeklyStats = {
    total: consultations.length,
    completed: completedCount,
    inProgress: consultations.filter(c => ['신규', '재상담필요', '상담완료'].includes(c.status)).length,
    noInterest: consultations.filter(c => c.status === '의향없음/타업체').length,
  }

  // 담당자별 통계 계산
  const consultantStats = (() => {
    const statsMap = new Map<string, {
      name: string
      total: number
      contracts: number
      completed: number
      cancelled: number
    }>()

    consultations.forEach(c => {
      const name = c.consultant || '미배정'
      if (!statsMap.has(name)) {
        statsMap.set(name, { name, total: 0, contracts: 0, completed: 0, cancelled: 0 })
      }
      const stat = statsMap.get(name)!
      stat.total++
      if (c.status === '계약완료') stat.contracts++
      if (c.status === '계약완료' && c.desired_install_date) stat.completed++ // 설치일 있으면 완료로 간주
      if (c.status === '의향없음/타업체') stat.cancelled++
    })

    return Array.from(statsMap.values()).filter(s => s.name !== '미배정').sort((a, b) => b.contracts - a.contracts)
  })()

  // C레벨/팀장인지 확인
  const canViewStats = user?.role && ['c-level', 'director'].includes(user.role)

  const now = new Date()
  const greeting = now.getHours() < 12 ? '좋은 아침이에요' : now.getHours() < 18 ? '좋은 오후예요' : '좋은 저녁이에요'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Header title="대시보드" description="오늘의 업무 현황을 한눈에 확인하세요" />

      <div className="p-6 space-y-6">
        {/* 환영 메시지 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">
              {greeting}, {user?.name || '사용자'}님!
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">오늘도 화이팅하세요</h2>
            <p className="mt-3 text-blue-100 max-w-lg">
              오늘의 할 일을 확인하고 체계적으로 업무를 처리해보세요.
              {isLoading ? (
                <span className="ml-1">데이터 로딩 중...</span>
              ) : (
                <>
                  {' '}전체 상담 <span className="text-white font-semibold">{consultations.length}건</span>,
                  오늘 재상담 예정 <span className="text-white font-semibold">{todayFollowUps.length}건</span>
                </>
              )}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="전체 상담"
                value={consultations.length}
                icon={Phone}
                href="/consultations"
                color="blue"
                description="등록된 전체 상담"
              />
              <StatCard
                title="재상담 예정"
                value={todayFollowUps.length}
                icon={CalendarCheck}
                href="/consultations"
                color="yellow"
                description="오늘 재상담 예정"
              />
              <StatCard
                title="설치 예정"
                value={weeklyScheduled}
                icon={Wrench}
                href="/contracts"
                color="purple"
                description="이번 주 설치 예정"
              />
              <StatCard
                title="설치 완료"
                value={completedCount}
                icon={CheckCircle}
                href="/settlements"
                color="green"
                description="전체 설치 완료"
              />
            </div>

            {/* 메인 콘텐츠 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 오늘 재상담 예정 */}
              <div className="lg:col-span-2">
                <TodaySchedule consultations={todayFollowUps} />
              </div>

              {/* 빠른 링크 */}
              <div>
                <QuickLinks />
              </div>
            </div>

            {/* 주간 현황 */}
            <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  전체 상담 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-600">설치 완료율</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {weeklyStats.completed} / {weeklyStats.total}건
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 relative"
                        style={{ width: `${weeklyStats.total > 0 ? (weeklyStats.completed / weeklyStats.total) * 100 : 0}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right pl-6 border-l border-slate-200">
                    <div className="flex items-center gap-1 justify-end">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {weeklyStats.total > 0 ? Math.round((weeklyStats.completed / weeklyStats.total) * 100) : 0}%
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">완료율</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
                  <div className="text-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <p className="text-2xl font-bold text-slate-800">{weeklyStats.total}</p>
                    <p className="text-xs text-slate-500 mt-1">전체 상담</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
                    <p className="text-2xl font-bold text-emerald-600">{weeklyStats.completed}</p>
                    <p className="text-xs text-emerald-600/70 mt-1">설치 완료</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors">
                    <p className="text-2xl font-bold text-amber-600">{weeklyStats.inProgress}</p>
                    <p className="text-xs text-amber-600/70 mt-1">진행 중</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <p className="text-2xl font-bold text-slate-600">{weeklyStats.noInterest}</p>
                    <p className="text-xs text-slate-600/70 mt-1">의향없음</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 담당자별 통계 (C레벨/팀장만 표시) */}
            {canViewStats && consultantStats.length > 0 && (
              <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    담당자별 실적
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {consultantStats.map((stat) => {
                      const conversionRate = stat.total > 0 ? Math.round((stat.contracts / stat.total) * 100) : 0
                      const cancelRate = stat.total > 0 ? Math.round((stat.cancelled / stat.total) * 100) : 0

                      return (
                        <div
                          key={stat.name}
                          className="p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-slate-800">{stat.name}</h4>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {conversionRate}% 전환
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <p className="text-lg font-bold text-blue-600">{stat.total}</p>
                              <p className="text-xs text-blue-600/70">총 상담</p>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded-lg">
                              <p className="text-lg font-bold text-purple-600">{stat.contracts}</p>
                              <p className="text-xs text-purple-600/70">계약</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <p className="text-lg font-bold text-green-600">{stat.completed}</p>
                              <p className="text-xs text-green-600/70">설치완료</p>
                            </div>
                            <div className="text-center p-2 bg-slate-50 rounded-lg">
                              <p className="text-lg font-bold text-slate-600">{cancelRate}%</p>
                              <p className="text-xs text-slate-600/70">취소율</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
