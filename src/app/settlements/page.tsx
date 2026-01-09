'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Calculator, TrendingUp, CheckCircle, Clock, Loader2, Plus, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Consultation } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export default function SettlementsPage() {
  const { hasPermission } = useAuth()
  const [completedContracts, setCompletedContracts] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const canWrite = hasPermission('settlement', 'write')

  // 설치완료된 계약 불러오기
  const fetchCompletedContracts = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('consultations')
      .select('*')
      .eq('status', '설치완료')
      .order('desired_install_date', { ascending: false })

    if (data) {
      setCompletedContracts(data as Consultation[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCompletedContracts()
  }, [])

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
  }

  // 통계 계산
  const stats = {
    totalCompleted: completedContracts.length,
    thisMonth: completedContracts.filter(c => {
      if (!c.desired_install_date) return false
      const date = new Date(c.desired_install_date)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length,
  }

  return (
    <div className="min-h-screen">
      <Header title="정산 관리" description="마진, 수수료, 정산 내역을 관리하세요" />

      <div className="p-6 space-y-6">
        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calculator className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-sm text-blue-100">설치 완료</p>
                  <p className="text-2xl font-bold">{stats.totalCompleted}건</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">이번 달 설치</p>
                  <p className="text-2xl font-bold">{stats.thisMonth}건</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">정산 완료</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">정산 대기</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 설치완료 목록 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">설치 완료 내역</CardTitle>
            {canWrite && (
              <Button size="sm" disabled>
                <Plus className="h-4 w-4 mr-1" />
                정산 추가 (준비 중)
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : completedContracts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>설치 완료된 계약이 없습니다.</p>
                <p className="text-sm mt-2">계약 관리에서 &quot;설치완료&quot; 상태로 변경하면 여기에 표시됩니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>설치일</TableHead>
                      <TableHead>고객명</TableHead>
                      <TableHead>연락처</TableHead>
                      <TableHead>통신사</TableHead>
                      <TableHead>상품</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead className="text-center">정산상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell>{formatDate(contract.desired_install_date)}</TableCell>
                        <TableCell className="font-medium">{contract.customer_name}</TableCell>
                        <TableCell>
                          <a href={`tel:${contract.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contract.phone}
                          </a>
                        </TableCell>
                        <TableCell>{contract.carrier || '-'}</TableCell>
                        <TableCell>{contract.product_summary || '-'}</TableCell>
                        <TableCell>{contract.consultant || '-'}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            정산대기
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            💡 <strong>안내:</strong> 정산 기능은 설치완료된 계약을 기반으로 표시됩니다.
            상세 정산 관리 기능(마진, 수수료 등)은 추후 업데이트 예정입니다.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            ⚠️ <strong>주의:</strong> 상품권 포함안하도록 주의 (총액에서 별도로 계산 추가해야함) /
            상품권은 고객에게 바로 지급됨
          </p>
        </div>
      </div>
    </div>
  )
}
