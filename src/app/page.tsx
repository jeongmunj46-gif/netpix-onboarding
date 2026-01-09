'use client'

import { Header } from '@/components/layout'
import { StatCard, QuickLinks, TodaySchedule } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, CalendarCheck, Wrench, CheckCircle, TrendingUp, Target } from 'lucide-react'
import { Consultation } from '@/types'

// 임시 데이터 (나중에 Supabase에서 가져올 예정)
const mockStats = {
  todayConsultations: 12,
  pendingFollowUps: 3,
  scheduledInstalls: 5,
  weeklyCompleted: 8,
}

const mockTodaySchedule: Consultation[] = [
  {
    id: 1,
    created_at: '2024-01-08',
    updated_at: '2024-01-08',
    status: '재상담필요',
    customer_name: '홍길동',
    phone: '010-1234-5678',
    first_consultation_date: '2024-01-05',
    follow_up_date: '2024-01-08T14:00:00',
    moving_date: '2024-01-15',
    desired_install_date: '2024-01-15',
    carrier: 'SKB',
    speed: '500M',
    has_tv: true,
    tv_plan: '스탠다드',
    product_summary: 'SKB 500M + TV 스탠다드',
    consultation_note: '이사 관련 상담',
    memo: null,
    consultant: '정상담',
  },
  {
    id: 2,
    created_at: '2024-01-07',
    updated_at: '2024-01-08',
    status: '재상담필요',
    customer_name: '김철수',
    phone: '010-9876-5432',
    first_consultation_date: '2024-01-06',
    follow_up_date: '2024-01-08T16:00:00',
    moving_date: null,
    desired_install_date: '2024-01-20',
    carrier: 'KT',
    speed: '1G',
    has_tv: false,
    tv_plan: null,
    product_summary: 'KT 1G 인터넷',
    consultation_note: '기가 인터넷 문의',
    memo: null,
    consultant: '정상담',
  },
]

export default function DashboardPage() {
  const today = new Date()
  const greeting = today.getHours() < 12 ? '좋은 아침이에요' : today.getHours() < 18 ? '좋은 오후예요' : '좋은 저녁이에요'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Header title="대시보드" description="오늘의 업무 현황을 한눈에 확인하세요" />

      <div className="p-6 space-y-6">
        {/* 환영 메시지 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">{greeting}!</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">오늘도 화이팅하세요</h2>
            <p className="mt-3 text-blue-100 max-w-lg">
              오늘의 할 일을 확인하고 체계적으로 업무를 처리해보세요.
              신규 상담이 <span className="text-white font-semibold">{mockStats.todayConsultations}건</span> 대기 중입니다.
            </p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="오늘의 상담"
            value={mockStats.todayConsultations}
            icon={Phone}
            href="/consultations?filter=today"
            color="blue"
            description="오늘 등록된 상담"
          />
          <StatCard
            title="재상담 필요"
            value={mockStats.pendingFollowUps}
            icon={CalendarCheck}
            href="/consultations?filter=followup"
            color="yellow"
            description="오늘 재상담 예정"
          />
          <StatCard
            title="설치 예정"
            value={mockStats.scheduledInstalls}
            icon={Wrench}
            href="/contracts?filter=scheduled"
            color="purple"
            description="이번 주 설치 예정"
          />
          <StatCard
            title="이번 주 완료"
            value={mockStats.weeklyCompleted}
            icon={CheckCircle}
            href="/consultations?filter=completed"
            color="green"
            description="설치 완료 건수"
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 오늘 재상담 예정 */}
          <div className="lg:col-span-2">
            <TodaySchedule consultations={mockTodaySchedule} />
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
              이번 주 상담 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600">목표 달성률</span>
                  <span className="text-sm font-semibold text-slate-900">8 / 10건</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 relative"
                    style={{ width: '80%' }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="text-right pl-6 border-l border-slate-200">
                <div className="flex items-center gap-1 justify-end">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">80%</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">목표 달성</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div className="text-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <p className="text-2xl font-bold text-slate-800">12</p>
                <p className="text-xs text-slate-500 mt-1">전체 상담</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
                <p className="text-2xl font-bold text-emerald-600">8</p>
                <p className="text-xs text-emerald-600/70 mt-1">개통 완료</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors">
                <p className="text-2xl font-bold text-amber-600">3</p>
                <p className="text-xs text-amber-600/70 mt-1">진행 중</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors">
                <p className="text-2xl font-bold text-rose-600">1</p>
                <p className="text-xs text-rose-600/70 mt-1">취소</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
