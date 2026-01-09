'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Clock, Calendar, ArrowRight } from 'lucide-react'
import { Consultation } from '@/types'
import Link from 'next/link'

interface TodayScheduleProps {
  consultations: Consultation[]
}

const statusColors: Record<string, string> = {
  '신규': 'bg-blue-100 text-blue-700 border-blue-200',
  '재상담필요': 'bg-amber-100 text-amber-700 border-amber-200',
  '연락안됨': 'bg-rose-100 text-rose-700 border-rose-200',
  '상담완료': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  '접수완료': 'bg-violet-100 text-violet-700 border-violet-200',
  '설치완료': 'bg-teal-100 text-teal-700 border-teal-200',
  '취소': 'bg-slate-100 text-slate-700 border-slate-200',
}

export function TodaySchedule({ consultations }: TodayScheduleProps) {
  const formatTime = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            오늘 재상담 예정
          </CardTitle>
          <Link
            href="/consultations?filter=followup"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            전체 보기
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {consultations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-500">오늘 예정된 재상담이 없습니다</p>
            <p className="text-xs text-slate-400 mt-1">새로운 상담을 등록해보세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultations.map((consultation, index) => (
              <div
                key={consultation.id}
                className="group flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {consultation.customer_name}
                    </p>
                    <Badge className={`text-[10px] px-2 py-0.5 border ${statusColors[consultation.status] || statusColors['신규']}`}>
                      {consultation.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    <span className="text-slate-400">{consultation.phone}</span>
                    <span className="mx-1.5 text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">{consultation.product_summary || '상품 미정'}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="px-3 py-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600">
                      {formatTime(consultation.follow_up_date)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
