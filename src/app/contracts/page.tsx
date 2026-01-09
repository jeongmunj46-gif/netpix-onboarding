'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Clock, CheckCircle, Phone, Loader2, Edit } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Consultation, STATUS_COLORS } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

// 계약 관련 상태만 필터링
const CONTRACT_STATUSES = ['계약완료']

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Consultation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // 상담에서 계약 상태인 것만 불러오기
  const fetchContracts = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .in('status', CONTRACT_STATUSES)
      .order('desired_install_date', { ascending: true })

    if (error) {
      toast({
        title: '오류',
        description: '계약 목록을 불러오는데 실패했습니다.',
        variant: 'destructive',
      })
    } else {
      setContracts(data as Consultation[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  // 상태별 카운트
  const statusCounts = {
    계약완료: contracts.filter(c => c.status === '계약완료').length,
  }

  const getDaysUntil = (date: string | null) => {
    if (!date) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(date)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    })
  }

  // 상태 변경
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedContract) return
    setIsSaving(true)

    const { error } = await supabase
      .from('consultations')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedContract.id)

    if (error) {
      toast({
        title: '오류',
        description: '상태 변경에 실패했습니다.',
        variant: 'destructive',
      })
    } else {
      toast({ title: '완료', description: '상태가 변경되었습니다.' })
      await fetchContracts()
      setIsDialogOpen(false)
    }
    setIsSaving(false)
  }

  // 설치일 변경
  const handleDateChange = async (newDate: string) => {
    if (!selectedContract) return
    setIsSaving(true)

    const { error } = await supabase
      .from('consultations')
      .update({
        desired_install_date: newDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedContract.id)

    if (error) {
      toast({
        title: '오류',
        description: '날짜 변경에 실패했습니다.',
        variant: 'destructive',
      })
    } else {
      toast({ title: '완료', description: '설치 예정일이 변경되었습니다.' })
      setSelectedContract({ ...selectedContract, desired_install_date: newDate })
      await fetchContracts()
    }
    setIsSaving(false)
  }

  return (
    <div className="min-h-screen">
      <Header title="계약 관리" description="접수완료 및 설치완료 계약을 관리하세요" />

      <div className="p-6 space-y-6">
        {/* 상태 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">계약완료</p>
                <p className="text-2xl font-bold">{statusCounts.계약완료}건</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">이번 주 설치</p>
                <p className="text-2xl font-bold">
                  {contracts.filter(c => {
                    const days = getDaysUntil(c.desired_install_date)
                    return days !== null && days >= 0 && days <= 7
                  }).length}건
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">전체</p>
                <p className="text-2xl font-bold">{contracts.length}건</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 계약 목록 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">진행 중인 계약</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : contracts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>진행 중인 계약이 없습니다.</p>
                <p className="text-sm mt-2">상담 관리에서 &quot;접수완료&quot; 상태로 변경하면 여기에 표시됩니다.</p>
              </CardContent>
            </Card>
          ) : (
            contracts.map((contract) => {
              const daysUntil = getDaysUntil(contract.desired_install_date)
              return (
                <Card key={contract.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{contract.customer_name}</h3>
                          <Badge className={STATUS_COLORS[contract.status]}>{contract.status}</Badge>
                          {daysUntil !== null && daysUntil <= 3 && daysUntil >= 0 && (
                            <Badge className="bg-red-100 text-red-800">D-{daysUntil}</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">연락처</p>
                            <a href={`tel:${contract.phone}`} className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contract.phone}
                            </a>
                          </div>
                          <div>
                            <p className="text-gray-500">통신사/상품</p>
                            <p className="font-medium">
                              {contract.carrier || '-'} {contract.product_summary || ''}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">인터넷 속도</p>
                            <p className="font-medium">{contract.speed || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">설치 희망일</p>
                            <p className="font-medium">
                              {contract.desired_install_date ? (
                                <>
                                  {formatDate(contract.desired_install_date)}
                                  {daysUntil !== null && (
                                    <span className={`ml-1 ${daysUntil < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                      ({daysUntil < 0 ? `${Math.abs(daysUntil)}일 지남` : `D-${daysUntil}`})
                                    </span>
                                  )}
                                </>
                              ) : '-'}
                            </p>
                          </div>
                        </div>
                        {contract.consultation_note && (
                          <p className="text-sm text-gray-500 mt-2 truncate">
                            메모: {contract.consultation_note}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedContract(contract)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        관리
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            💡 <strong>팁:</strong> 상담 관리에서 &quot;접수완료&quot; 상태로 변경하면 자동으로 계약 관리에
            표시됩니다.
          </p>
        </div>
      </div>

      {/* 계약 상세/관리 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>계약 관리</DialogTitle>
            <DialogDescription>
              {selectedContract?.customer_name}님의 계약 정보를 관리합니다.
            </DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">고객명</p>
                  <p className="font-medium">{selectedContract.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">연락처</p>
                  <p className="font-medium">{selectedContract.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">상태 변경</label>
                <Select
                  value={selectedContract.status}
                  onValueChange={handleStatusChange}
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="접수완료">접수완료</SelectItem>
                    <SelectItem value="설치완료">설치완료</SelectItem>
                    <SelectItem value="취소">취소</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">설치 예정일</label>
                <Input
                  type="date"
                  value={selectedContract.desired_install_date?.split('T')[0] || ''}
                  onChange={(e) => handleDateChange(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
