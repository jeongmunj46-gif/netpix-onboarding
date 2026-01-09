'use client'

import { Header } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Clock, CheckCircle } from 'lucide-react'

// 임시 데이터
const contracts = [
  {
    id: 1,
    customer_name: '곽나희',
    phone: '010-2500-2225',
    carrier: 'SKB',
    product_name: '100MB+이코노미',
    support_amount: 43,
    extra_support: 5,
    scheduled_date: '2024-01-19',
    desired_install_date: '2024-01-30',
    status: '접수대기',
  },
  {
    id: 2,
    customer_name: '강영서',
    phone: '010-4152-5172',
    carrier: 'SKB',
    product_name: 'SKB 100MB',
    support_amount: 17,
    extra_support: 3,
    scheduled_date: '2024-01-25',
    desired_install_date: '2024-02-20',
    status: '접수완료',
  },
]

const statusColors: Record<string, string> = {
  '접수대기': 'bg-yellow-100 text-yellow-800',
  '접수완료': 'bg-blue-100 text-blue-800',
  '설치예정': 'bg-purple-100 text-purple-800',
  '설치완료': 'bg-green-100 text-green-800',
}

export default function ContractsPage() {
  const getDaysUntil = (date: string) => {
    const today = new Date()
    const targetDate = new Date(date)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen">
      <Header title="계약 관리" description="접수대기 및 설치 예정 계약을 관리하세요" />

      <div className="p-6 space-y-6">
        {/* 상태 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">접수대기</p>
                <p className="text-2xl font-bold">1건</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">접수완료</p>
                <p className="text-2xl font-bold">1건</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">설치예정</p>
                <p className="text-2xl font-bold">0건</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">설치완료</p>
                <p className="text-2xl font-bold">0건</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 계약 목록 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">진행 중인 계약</h2>
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{contract.customer_name}</h3>
                      <Badge className={statusColors[contract.status]}>{contract.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">연락처</p>
                        <p className="font-medium">{contract.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">통신사/상품</p>
                        <p className="font-medium">
                          {contract.carrier} {contract.product_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">지원금</p>
                        <p className="font-medium">
                          {contract.support_amount}
                          {contract.extra_support > 0 && ` +${contract.extra_support}`}만원
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">설치 희망일</p>
                        <p className="font-medium">
                          {contract.desired_install_date}
                          <span className="text-blue-600 ml-1">
                            (D-{getDaysUntil(contract.desired_install_date)})
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    상세보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            💡 <strong>팁:</strong> 상담 관리에서 &quot;개통완료&quot; 상태로 변경하면 자동으로 계약 관리로
            이동됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
