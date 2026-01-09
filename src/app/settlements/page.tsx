'use client'

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
import { Checkbox } from '@/components/ui/checkbox'
import { Calculator, TrendingUp, CheckCircle, Clock } from 'lucide-react'

// 임시 데이터
const settlements = [
  {
    id: 1,
    install_date: '2025-08-30',
    gift_card: 580000,
    back_price: 300000,
    sales_commission: 350000,
    customer_support: 0,
    ad_support: 190000,
    margin: 0,
    settlement_confirmed: true,
    settlement_date: '2025-09-09',
    amount_confirmed: true,
    vendor: '위텍스',
    partner: '이사대학',
  },
  {
    id: 2,
    install_date: '2025-08-19',
    gift_card: 900000,
    back_price: 350000,
    sales_commission: 0,
    customer_support: 0,
    ad_support: 550000,
    margin: 0,
    settlement_confirmed: true,
    settlement_date: '2025-09-09',
    amount_confirmed: true,
    vendor: '위텍스',
    partner: '이사대학',
  },
  {
    id: 3,
    install_date: '2025-12-31',
    gift_card: 300000,
    back_price: 300000,
    sales_commission: 80000,
    customer_support: 0,
    ad_support: 77273,
    margin: 0,
    settlement_confirmed: false,
    settlement_date: null,
    amount_confirmed: false,
    vendor: '접수원료',
    partner: '',
  },
]

// 통계 계산
const stats = {
  totalMargin: 1682,
  totalMarginVat: 3036819,
  totalCustomers: 11,
  targetAchieved: 27,
}

export default function SettlementsPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value)
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
                  <p className="text-sm text-blue-100">마진 (부가세별도)</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalMargin)}원</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">11/27부터 총 고객수</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}명</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">목표 달성 수치</p>
                  <p className="text-2xl font-bold">{stats.targetAchieved}건</p>
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
                  <p className="text-2xl font-bold">3건</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 정산 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">정산 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>설치일</TableHead>
                    <TableHead className="text-right">상품권</TableHead>
                    <TableHead className="text-right">백매가</TableHead>
                    <TableHead className="text-right">판매수수료</TableHead>
                    <TableHead className="text-right">고객지원금</TableHead>
                    <TableHead className="text-right">광고비지원</TableHead>
                    <TableHead className="text-right">마진</TableHead>
                    <TableHead className="text-center">정산확인</TableHead>
                    <TableHead>정산날짜</TableHead>
                    <TableHead className="text-center">금액확정</TableHead>
                    <TableHead>거래처</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map((settlement) => (
                    <TableRow key={settlement.id}>
                      <TableCell>{settlement.install_date}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(settlement.gift_card)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(settlement.back_price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(settlement.sales_commission)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(settlement.customer_support)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(settlement.ad_support)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(settlement.margin)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            settlement.settlement_confirmed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {settlement.settlement_confirmed ? '정산완료' : '접수원료'}
                        </Badge>
                      </TableCell>
                      <TableCell>{settlement.settlement_date || '-'}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={settlement.amount_confirmed} disabled />
                      </TableCell>
                      <TableCell>{settlement.vendor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 안내 */}
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
