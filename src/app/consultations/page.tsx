'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Textarea } from '@/components/ui/textarea'
import { Search, Plus, Phone, Calendar, Edit, Trash2, Loader2 } from 'lucide-react'
import { Consultation, ConsultationStatus, STATUS_COLORS, Carrier, InternetSpeed } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

// 상태 목록
const statuses: ConsultationStatus[] = [
  '신규',
  '재상담필요',
  '연락안됨',
  '상담완료',
  '접수완료',
  '설치완료',
  '취소',
]

// 통신사 목록
const carriers: Carrier[] = ['SKB', 'KT', 'LG']

// 인터넷 속도 목록
const speeds: InternetSpeed[] = ['100M', '500M', '1G']

type FormData = Partial<Consultation>

export default function ConsultationsPage() {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'all'>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Supabase에서 상담 목록 불러오기
  const fetchConsultations = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: '오류',
        description: '상담 목록을 불러오는데 실패했습니다.',
        variant: 'destructive',
      })
    } else {
      setConsultations(data as Consultation[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchConsultations()
  }, [])

  // 필터링된 상담 목록
  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.customer_name.includes(searchQuery) ||
      consultation.phone.includes(searchQuery) ||
      consultation.product_summary?.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 새 상담 추가 / 수정
  const handleSave = async () => {
    if (!formData.customer_name || !formData.phone) {
      toast({
        title: '입력 오류',
        description: '고객명과 연락처는 필수입니다.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)

    if (editingId) {
      // 수정
      const { error } = await supabase
        .from('consultations')
        .update({
          status: formData.status,
          customer_name: formData.customer_name,
          phone: formData.phone,
          first_consultation_date: formData.first_consultation_date,
          follow_up_date: formData.follow_up_date || null,
          moving_date: formData.moving_date || null,
          desired_install_date: formData.desired_install_date || null,
          carrier: formData.carrier || null,
          speed: formData.speed || null,
          has_tv: formData.has_tv || false,
          tv_plan: formData.tv_plan || null,
          product_summary: formData.product_summary || null,
          consultation_note: formData.consultation_note || null,
          memo: formData.memo || null,
          consultant: formData.consultant || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId)

      if (error) {
        toast({
          title: '수정 실패',
          description: '상담 정보 수정에 실패했습니다.',
          variant: 'destructive',
        })
      } else {
        toast({ title: '수정 완료', description: '상담 정보가 수정되었습니다.' })
        await fetchConsultations()
      }
    } else {
      // 추가
      const { error } = await supabase
        .from('consultations')
        .insert({
          status: formData.status || '신규',
          customer_name: formData.customer_name,
          phone: formData.phone,
          first_consultation_date: formData.first_consultation_date || new Date().toISOString().split('T')[0],
          follow_up_date: formData.follow_up_date || null,
          moving_date: formData.moving_date || null,
          desired_install_date: formData.desired_install_date || null,
          carrier: formData.carrier || null,
          speed: formData.speed || null,
          has_tv: formData.has_tv || false,
          tv_plan: formData.tv_plan || null,
          product_summary: formData.product_summary || null,
          consultation_note: formData.consultation_note || null,
          memo: formData.memo || null,
          consultant: user?.name || null,
        })

      if (error) {
        toast({
          title: '등록 실패',
          description: '상담 등록에 실패했습니다.',
          variant: 'destructive',
        })
      } else {
        toast({ title: '등록 완료', description: '새 상담이 등록되었습니다.' })
        await fetchConsultations()
      }
    }

    setIsSaving(false)
    setIsDialogOpen(false)
    setEditingId(null)
    setFormData({})
  }

  // 상담 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id)

    if (error) {
      toast({
        title: '삭제 실패',
        description: '상담 삭제에 실패했습니다.',
        variant: 'destructive',
      })
    } else {
      toast({ title: '삭제 완료', description: '상담이 삭제되었습니다.' })
      await fetchConsultations()
    }
  }

  // 수정 모달 열기
  const handleEdit = (consultation: Consultation) => {
    setFormData(consultation)
    setEditingId(consultation.id)
    setIsDialogOpen(true)
  }

  // 새 상담 모달 열기
  const handleNew = () => {
    setFormData({ status: '신규', consultant: user?.name || '' })
    setEditingId(null)
    setIsDialogOpen(true)
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen">
      <Header title="상담 관리" description="고객 상담 기록을 관리하세요" />

      <div className="p-6 space-y-6">
        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="고객명, 연락처, 상품으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ConsultationStatus | 'all')}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            새 상담 등록
          </Button>
        </div>

        {/* 상담 목록 테이블 */}
        <div className="bg-white rounded-lg border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">날짜</TableHead>
                  <TableHead className="w-28">상태</TableHead>
                  <TableHead>고객명</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>상품</TableHead>
                  <TableHead>상담내용</TableHead>
                  <TableHead className="w-24">재상담일</TableHead>
                  <TableHead className="w-20">담당자</TableHead>
                  <TableHead className="w-20">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {searchQuery || statusFilter !== 'all'
                        ? '검색 결과가 없습니다'
                        : '등록된 상담이 없습니다. 새 상담을 등록해주세요.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id} className="hover:bg-gray-50">
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(consultation.first_consultation_date)}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[consultation.status]}>
                          {consultation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{consultation.customer_name}</TableCell>
                      <TableCell>
                        <a
                          href={`tel:${consultation.phone}`}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          {consultation.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm">{consultation.product_summary || '-'}</TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                        {consultation.consultation_note || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {consultation.follow_up_date ? (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Calendar className="h-3 w-3" />
                            {formatDate(consultation.follow_up_date)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{consultation.consultant || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(consultation)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(consultation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* 상담 등록/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? '상담 수정' : '새 상담 등록'}</DialogTitle>
            <DialogDescription>
              고객 상담 정보를 입력하세요. * 표시는 필수 항목입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* 기본 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">고객명 *</label>
                <Input
                  value={formData.customer_name || ''}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="홍길동"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">연락처 *</label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-1234-5678"
                />
              </div>
            </div>

            {/* 상태 및 담당자 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">상태</label>
                <Select
                  value={formData.status || '신규'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as ConsultationStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">담당자</label>
                <Input
                  value={formData.consultant || ''}
                  onChange={(e) => setFormData({ ...formData, consultant: e.target.value })}
                  placeholder="담당자명"
                />
              </div>
            </div>

            {/* 상품 정보 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">통신사</label>
                <Select
                  value={formData.carrier || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, carrier: value as Carrier })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((carrier) => (
                      <SelectItem key={carrier} value={carrier}>
                        {carrier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">인터넷 속도</label>
                <Select
                  value={formData.speed || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, speed: value as InternetSpeed })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {speeds.map((speed) => (
                      <SelectItem key={speed} value={speed}>
                        {speed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">상품 요약</label>
                <Input
                  value={formData.product_summary || ''}
                  onChange={(e) => setFormData({ ...formData, product_summary: e.target.value })}
                  placeholder="SKB 500M+TV"
                />
              </div>
            </div>

            {/* 날짜 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">재상담 예정일</label>
                <Input
                  type="date"
                  value={formData.follow_up_date?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">설치 희망일</label>
                <Input
                  type="date"
                  value={formData.desired_install_date?.split('T')[0] || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, desired_install_date: e.target.value })
                  }
                />
              </div>
            </div>

            {/* 상담 내용 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">상담 내용</label>
              <Textarea
                value={formData.consultation_note || ''}
                onChange={(e) => setFormData({ ...formData, consultation_note: e.target.value })}
                placeholder="상담 내용을 입력하세요..."
                rows={3}
              />
            </div>

            {/* 비고 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">비고</label>
              <Input
                value={formData.memo || ''}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                placeholder="추가 메모"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                editingId ? '수정' : '등록'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
