'use client'

import { useState } from 'react'
import { Header } from '@/components/layout'
import { ScriptCard } from '@/components/scripts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Star } from 'lucide-react'
import { Script } from '@/types'
import { cn } from '@/lib/utils'

// 스크립트 카테고리
const categories = [
  '전체',
  '첫 인사',
  '요금 안내',
  '이사 문의',
  '재상담',
  '설치 안내',
  '클레임 대응',
]

// 임시 데이터 (나중에 Supabase에서 가져올 예정)
const mockScripts: Script[] = [
  {
    id: 1,
    category: '첫 인사',
    sort_order: 1,
    title: '(상담 시) 문자 상담 희망 - 넷픽스',
    text_script: `안녕하세요
저희 넷픽스에서 연락 드렸는데, 문자 상담 희망하신다고 요청주셔서 문자 먼저 보내드립니다!
혹시 고객님께서 희망하시는 통신사, 인터넷 속도가 있으실까요?^^

대표번호: 010-8188-7497`,
    kakao_script: null,
    related_links: [
      { label: '레인보우컨설팅', url: 'https://goodmorningrainbow.com/anew/index.php' },
    ],
    related_phones: [
      { label: '대표번호', number: '010-8188-7497' },
    ],
    is_favorite: true,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 2,
    category: '첫 인사',
    sort_order: 2,
    title: '(부재 시) 부재중 고객 안내 - 넷픽스',
    text_script: `안녕하세요
저희 넷픽스에서 연락 드렸는데, 받지 않으신다 연락드리는 것 같아 이리 먼저 문자 보내드립니다^^
언제든 편하신 시간에 회 연락주시면 최대지원금+최상의 서비스로 도움드리겠습니다!

대표번호: 010-8188-7497`,
    kakao_script: null,
    related_links: [],
    related_phones: [
      { label: '대표번호', number: '010-8188-7497' },
    ],
    is_favorite: false,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 3,
    category: '첫 인사',
    sort_order: 3,
    title: '(상담 시) 문자 상담 희망 - 이사대학 통신팀',
    text_script: `[이사대학 통신팀]
안녕하세요
고객님 이사대학 통신팀입니다.
견적 문의주셔서 연락 드렸는데, 문자 상담 희망하신다고 요청주셔서 문자 먼저 보내드립니다!!
혹시 고객님께서 희망하시는 통신사, 인터넷 속도가 있으실까요?^^

대표번호: 010-8188-7497`,
    kakao_script: null,
    related_links: [],
    related_phones: [
      { label: '대표번호', number: '010-8188-7497' },
    ],
    is_favorite: false,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 4,
    category: '설치 안내',
    sort_order: 1,
    title: '(계약 시) 물어볼 것들',
    text_script: null,
    kakao_script: `이름:
설치주소(동호수까지):
사전문의하에 재화(은행명):
통신사:
상품:
결제방법:
설치희망:
비고(설치 희망일):`,
    related_links: [],
    related_phones: [],
    is_favorite: true,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 5,
    category: '설치 안내',
    sort_order: 2,
    title: '(접수 완료 후) 주의사항 / 마무리 멘트',
    text_script: `이렇게주셔서 감사하드리며, 오늘도 좋은 하루되세요^^

고객님 상담에 앞서 아래내용을 활용주시면 정확하고 빠른 사전을 안내 가능합니다!

<요청>
1. 개통신 신규 or 변경
2. 희망통신사
3. 신청상품 명칭 (인/전)
4. 결합 가능 번호(수/명):
5. 인터넷 속도 (100m/500m/1G)
6. TV 서비스(O/X)

*이외 추가 문의사항은 말씀주시면 답변드리겠습니다!`,
    kakao_script: null,
    related_links: [],
    related_phones: [],
    is_favorite: false,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 6,
    category: '요금 안내',
    sort_order: 1,
    title: 'KT 가용조회',
    text_script: null,
    kakao_script: null,
    related_links: [
      { label: 'KT 가용조회', url: 'https://help.kt.com/serviceinfo/SearchHomePhone.do' },
    ],
    related_phones: [],
    is_favorite: false,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 7,
    category: '요금 안내',
    sort_order: 2,
    title: 'SKB 가용조회 (해당 주소지에 설치되는지 확인)',
    text_script: null,
    kakao_script: null,
    related_links: [
      { label: 'SKB 가용조회', url: 'https://www.bworld.co.kr/myb/product/join/address/svcAvaSearch.do' },
    ],
    related_phones: [],
    is_favorite: false,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 8,
    category: '요금 안내',
    sort_order: 3,
    title: 'LG 가용조회 (해당 주소지에 설치되는지 확인)',
    text_script: null,
    kakao_script: null,
    related_links: [
      { label: 'LG 가용조회', url: 'https://www.lguplus.com/support/online/coverage-check' },
    ],
    related_phones: [],
    is_favorite: false,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

export default function ScriptsPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [scripts, setScripts] = useState(mockScripts)

  const filteredScripts = scripts.filter((script) => {
    const matchesCategory = selectedCategory === '전체' || script.category === selectedCategory
    const matchesSearch =
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.text_script?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.kakao_script?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFavorite = !showFavoritesOnly || script.is_favorite

    return matchesCategory && matchesSearch && matchesFavorite
  })

  const handleToggleFavorite = (id: number) => {
    setScripts((prev) =>
      prev.map((script) =>
        script.id === id ? { ...script, is_favorite: !script.is_favorite } : script
      )
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="상담 스크립트" description="상황별 멘트를 확인하고 바로 복사해서 사용하세요" />

      <div className="p-6 space-y-6">
        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="스크립트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="shrink-0"
          >
            <Star className={cn('h-4 w-4 mr-2', showFavoritesOnly && 'fill-white')} />
            즐겨찾기만
          </Button>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-2">
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

        {/* 스크립트 목록 */}
        {filteredScripts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredScripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
