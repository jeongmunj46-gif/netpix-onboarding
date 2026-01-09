'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { GuidelineCard } from '@/components/guidelines'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, CheckCircle2 } from 'lucide-react'
import { Guideline, GuidelineImportance } from '@/types'

// 가이드라인 카테고리
const categories = ['전체', '고객유형', '상품', '결합할인', '해지', '기타']

// 중요도 필터
const importanceFilters: { value: GuidelineImportance | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'required', label: '필수' },
  { value: 'recommended', label: '권장' },
  { value: 'reference', label: '참고' },
]

// 임시 데이터 - 스크린샷의 26개 항목 기반
const mockGuidelines: Guideline[] = [
  {
    id: 1,
    category: '고객유형',
    sort_order: 1,
    title: '외국인 고객은 비자 종류마다 가입 할 수 있는지 여부가 다르다! 알파벳 뒤에 숫자가 붙는다',
    description: '불가: B1, C2 / 가능: D7, F4 등',
    importance: 'required',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 2,
    category: '고객유형',
    sort_order: 2,
    title: '미성년자 가입은 보호자 동의하여도 온라인 판매 특성상 신청이 불가하다',
    description: null,
    importance: 'required',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 3,
    category: '상품',
    sort_order: 3,
    title: '결합된 사람은 인터넷을 쓰고 있으면 인터넷 할인을 받을 수 없다 / 유유선 결합을 쓴다',
    description: null,
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 4,
    category: '상품',
    sort_order: 4,
    title: '인터넷만 한 후 티비가입 시 판매수당/사은품 추가로 안 나옴',
    description: null,
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 5,
    category: '상품',
    sort_order: 5,
    title: '다산텔의 경우는 인, 인+티의 차액만큼 더주는게 아니라 별도로 금액이 있고 티비 2대하면 티비 대당 월요금이 더 저렴하고 판매수당이 적다',
    description: null,
    importance: 'reference',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 6,
    category: '상품',
    sort_order: 6,
    title: 'LG헬로비전은 더 적정하게 금액이 있고 모든 통신사 결합이 가능하다 대신 가능한 지역이 있음으로 확인하고 안내해야한다',
    description: null,
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 7,
    category: '결합할인',
    sort_order: 7,
    title: '카드 할인은 레인보우컨설팅에서 확인 할 수 있으며, 사용량에 따라 인터넷 요금이 할인된다 단, 제외)공공금, 관리비 등',
    description: null,
    importance: 'reference',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 8,
    category: '상품',
    sort_order: 8,
    title: '요금 변경 및 요금 절감 상담 후 10개월 이후(M+9개월이 맞으나, 편의상 10개월로 지정한다) 채널 수가 적고 달 나오는 요금제로 낮춰주면 좋다. 만약 10개월 이전에 변경하게 될 경우 환수가 되니, 변경 안하도록 안내해야한다',
    description: null,
    importance: 'required',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 9,
    category: '해지',
    sort_order: 9,
    title: 'LGU+의 기사 신고제도는 문제에 안할 경우 설치기사가 신고하면 포상제도가 있기 때문에 안약 방법을 진행하게 될 경우 이 생기게 된다면 LG는 공짜하다',
    description: null,
    importance: 'required',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 10,
    category: '해지',
    sort_order: 10,
    title: '통신사의 모니터링 기본적으로 통신사 해지한 이후로도 약 1년정도 해당 고객의 정보를 모니터링 하고 있다. 그렇기 때문에 범법을 절대 쓰면 안된다',
    description: null,
    importance: 'required',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 11,
    category: '고객유형',
    sort_order: 11,
    title: '재가입이 아닌 경우 1년이상이 지난 고객의 경우 동일 명의로 재가입하게 되어도 신규 가입으로 판단',
    description: '단(SK), 와이즈이 리테이트가 나온다',
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 12,
    category: '해지',
    sort_order: 12,
    title: '환수 가입 후 1년안에 해약하게 될 경우 리테이트 및 지급 수에 따른 금액만큼 환수되어, 1년이 지나이후 해지할 경우 고객에게만 위약금이 청구된다',
    description: null,
    importance: 'required',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 13,
    category: '결합할인',
    sort_order: 13,
    title: '가족 해지 후 가입 / 남편(SK),와이즈(LGU+) 남편에게 결합이 SKB 인터넷을 해지한 후 위약금의 결합된 위약금을 주고 변경하면 와이즈 명 남편(SK),와이즈(SK)인데 남편명의의 인터넷 SKB를 해지한 후 와이즈명으로 SKB를 가입한 경우 환수가 이루어진다. / 같은통신사는 문제없다',
    description: null,
    importance: 'required',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 14,
    category: '상품',
    sort_order: 14,
    title: '알뜰폰은 고객의 경우 알뜰폰은 요금제 마다 인터넷과의 결합이 가능한 요금제를 있어 확인을 해야해야한다',
    description: 'https://blog.naver.com/jkccc1120/224012246890',
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 15,
    category: '기타',
    sort_order: 15,
    title: '지역티브(skylife같은거)의 고객이 만약 인터넷만 우리쪽에 가입하시고 티비는 유지하다고 안내 시 한 전적으로 지원금을 주지않으므 단기 약정 형태의 요금이 비싸고 지원금이 적다는것을 손해임을 알려주도 계약할 경우 수락해야함',
    description: null,
    importance: 'reference',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 16,
    category: '해지',
    sort_order: 16,
    title: '1년약정은 간혹 가능하다고 담 별안다고 고객이 있다 그런 경우는 2년. 통신사에서 안내 시 한 전적으로 지원금을 주지않으므 단기 약정 형태의 요금이 비싸고 지원금이 적다는것을 손해임을 알려주고 수락해야함',
    description: null,
    importance: 'reference',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 17,
    category: '해지',
    sort_order: 17,
    title: '해지위약금이 가장 적용때는 1년-1년반정도 되었을때 가장 적게 나오고 오히려 기간이 얼마 남지 않았을 때 더 많이 나온다 (환인 혜택을 더 많이 받았기 때문이다)',
    description: null,
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 18,
    category: '상품',
    sort_order: 18,
    title: 'OSS라고 약정이 끝난서 가지가 있는 타 통신사의 단말기 회수신청을 하여 회수하게 되면 추가 리베이트는 나온다 (통신사 변경 고객에게)',
    description: null,
    importance: 'reference',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 19,
    category: '결합할인',
    sort_order: 19,
    title: '중고MNP 혹은 유심정책 예로서 고객이 SK 사용중이고 인터넷도 SKB 사용을 하고 가정하고 휴대폰의 통신사 약정기간이 끝났다면 기존SK 인터넷 해지하고 휴대폰+인터넷도 모두 변경 수 다만 유심은 보내주면 휴대폰만 깔끔하게 된다 (유심 바뀌기위 통신사 변경) 대신)명의하지만 결합을 꼭 확인해야하고 휴대폰에 단 통신사 약정이 걸려있기때문에 휴대폰 기기변경 가능하나 통신사 변경은 불가 하다. 변경 시 환수 / LG같이 이야기해야 법적지원금이 나온다',
    description: null,
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 20,
    category: '결합할인',
    sort_order: 20,
    title: '결신인 인터넷 설치 후 고객은 직접 대리점 혹은 판매점에서가 결합과 같이 나와있는 가족관계증명서 들을 통한 상담을 해야한다. /혹은 통신사 고객센터에 전화하여 결합은 가능하다 / 풍페이지에 가는것도 박매 에서도 신청합니다는것도',
    description: null,
    importance: 'reference',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 21,
    category: '기타',
    sort_order: 21,
    title: '약정 주인터넷 무조건 약정 3년만 있다. / 휴대폰은 2년 (바뀌지 않마았는지 확인해야함)',
    description: null,
    importance: 'required',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 22,
    category: '상품',
    sort_order: 22,
    title: '넷플릭스, 디즈니+등의 IPTV들은 동일 조건에 따라 쓰는 보다 요금제에 녹여 가입하는 것 보다 저렴하다',
    description: null,
    importance: 'reference',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 23,
    category: '해지',
    sort_order: 23,
    title: '1년 환수조건 채우고 위약금 남부 후 해지하면 3개월간 동일 통신사 재가입이 불가능하다 단 KT, SKY는 9개월 이내 재가입 불가능하다',
    description: null,
    importance: 'required',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 24,
    category: '결합할인',
    sort_order: 24,
    title: '결합 구성원중에서 인터넷이 있으면 SK, KT는 패밀리 결합 / LG는 인터넷끼리 모아 할인을 적용하면 된다',
    description: null,
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 25,
    category: '상품',
    sort_order: 25,
    title: 'KT는 데이터 많이 쓰는 고객에게 권리하고 8만원 이상 요금제 사용 시 프리미엄성결합을 하여, 1인가족의 경우 선택약정 25%, 결합할인 -2만원, 인터넷 할인까지 하여 통신사 이동을 권해보자',
    description: null,
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 26,
    category: '기타',
    sort_order: 26,
    title: '유심동판 SK 4개월, KT LG 6개월 요금제 유지기간 있음 *처음에는 고 요금제로 가입 후 일정 기간 후 연락드려서 요금제 하락 안내',
    description: null,
    importance: 'recommended',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

export default function GuidelinesPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedImportance, setSelectedImportance] = useState<GuidelineImportance | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  // localStorage에서 체크 상태 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('guideline-checks')
    if (saved) {
      setCheckedItems(new Set(JSON.parse(saved)))
    }
  }, [])

  // 체크 상태 저장
  const handleToggleCheck = (id: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem('guideline-checks', JSON.stringify(Array.from(next)))
      return next
    })
  }

  const filteredGuidelines = mockGuidelines.filter((guideline) => {
    const matchesCategory = selectedCategory === '전체' || guideline.category === selectedCategory
    const matchesImportance =
      selectedImportance === 'all' || guideline.importance === selectedImportance
    const matchesSearch =
      guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guideline.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesImportance && matchesSearch
  })

  const progress = (checkedItems.size / mockGuidelines.length) * 100

  return (
    <div className="min-h-screen">
      <Header
        title="업무 가이드"
        description="영업 전 필수 주의사항을 확인하세요. 체크하면서 학습 진도를 체크할 수 있어요."
      />

      <div className="p-6 space-y-6">
        {/* 학습 진도 */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              나의 학습 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-100">학습 진도</span>
                  <span className="text-sm font-medium">
                    {checkedItems.size} / {mockGuidelines.length} 완료
                  </span>
                </div>
                <div className="h-3 bg-blue-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{Math.round(progress)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="가이드라인 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 self-center mr-2">카테고리:</span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 self-center mr-2">중요도:</span>
            {importanceFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedImportance === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedImportance(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 가이드라인 목록 */}
        {filteredGuidelines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGuidelines.map((guideline, index) => (
              <GuidelineCard
                key={guideline.id}
                guideline={guideline}
                index={index + 1}
                checked={checkedItems.has(guideline.id)}
                onToggleCheck={handleToggleCheck}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
