// User (사용자) 타입
export type UserRole = 'c-level' | 'director' | 'staff'

export interface User {
  id: number
  name: string
  role: UserRole
}

export const ROLE_LABELS: Record<UserRole, string> = {
  'c-level': 'C레벨',
  'director': '부서장',
  'staff': '담당자',
}

// 권한 설정
export const ROLE_PERMISSIONS: Record<UserRole, {
  consultation: { read: boolean; write: boolean }
  contract: { read: boolean; write: boolean }
  settlement: { read: boolean; write: boolean }
  admin: { read: boolean; write: boolean }
}> = {
  'c-level': {
    consultation: { read: true, write: true },
    contract: { read: true, write: true },
    settlement: { read: true, write: true },
    admin: { read: true, write: true },
  },
  'director': {
    consultation: { read: true, write: true },
    contract: { read: true, write: true },
    settlement: { read: true, write: false }, // 읽기만
    admin: { read: true, write: false },
  },
  'staff': {
    consultation: { read: true, write: true },
    contract: { read: true, write: true },
    settlement: { read: false, write: false }, // 접근 불가
    admin: { read: false, write: false },
  },
}

// 기본 사용자 목록
export const DEFAULT_USERS: User[] = [
  { id: 1, name: '대표', role: 'c-level' },
  { id: 2, name: '팀장', role: 'director' },
  { id: 3, name: '신입직원', role: 'staff' },
]

// Consultation (상담) 타입
export interface Consultation {
  id: number
  created_at: string
  updated_at: string

  // 상태
  status: ConsultationStatus

  // 고객 정보
  customer_name: string
  phone: string

  // 날짜 정보
  first_consultation_date: string | null
  follow_up_date: string | null
  moving_date: string | null
  desired_install_date: string | null

  // 상품 정보
  carrier: Carrier | null
  speed: InternetSpeed | null
  has_tv: boolean
  tv_plan: string | null
  product_summary: string | null

  // 상담 내용
  consultation_note: string | null
  memo: string | null

  // 담당자
  consultant: string | null
}

export type ConsultationStatus =
  | '재상담필요'
  | '신규'
  | '계약완료'
  | '상담완료'
  | '의향없음/타업체'

export type Carrier = 'SKB' | 'KT' | 'LG' | 'SKT' | 'LGHELLOVISION' | 'KT SKYLIFE' | 'LG소호' | 'KT BIZ'

// 통신사 표시 정보 (메인 통신사는 별표)
export const CARRIER_OPTIONS: { value: Carrier; label: string; isMain: boolean }[] = [
  { value: 'SKB', label: '★ SKB', isMain: true },
  { value: 'KT', label: '★ KT', isMain: true },
  { value: 'LG', label: '★ LG', isMain: true },
  { value: 'SKT', label: 'SKT', isMain: false },
  { value: 'LGHELLOVISION', label: 'LG헬로비전', isMain: false },
  { value: 'KT SKYLIFE', label: 'KT스카이라이프', isMain: false },
  { value: 'LG소호', label: 'LG소호', isMain: false },
  { value: 'KT BIZ', label: 'KT BIZ', isMain: false },
]

// 통신사별 인터넷 속도
export const CARRIER_SPEEDS: Record<Carrier, string[]> = {
  'SKB': ['100M', '500M', '1G'],
  'KT': ['100M', '500M', '1G'],
  'LG': ['100M', '500M', '1G'],
  'SKT': ['100M', '500M', '1G'],
  'LGHELLOVISION': ['100M', '160M', '500M', '1G'],
  'KT SKYLIFE': ['100M', '200M', '500M', '1G'],
  'LG소호': ['100M', '500M', '1G'],
  'KT BIZ': ['100M', '500M', '1G'],
}

// 통신사별 TV 플랜
export const CARRIER_TV_PLANS: Record<Carrier, string[]> = {
  'SKB': ['이코노미', '스탠다드', 'ALL'],
  'KT': ['베이직', '라이트', '에센스', '모든G', '디즈니+모든G'],
  'LG': ['실속형', '기본형', '프리미엄', '프리미엄 플러스', '프리미엄 VOD', '넷플릭스', '디즈니', '프리미엄 환승구독2'],
  'SKT': ['이코노미', '스탠다드', 'ALL'],
  'LGHELLOVISION': ['알뜰형 HD', '이코노미UHD', '뉴베이직UHD', '뉴프리미엄UHD', '프로라이트IPTV', '프로맥스IPTV'],
  'KT SKYLIFE': ['30% 할인가 (위성&베이직IPTV)', '30% 할인가 (플러스IPTV)', '인터넷+베이직 (IPTV)', '인터넷+플러스 (IPTV)', '인터넷+ALL (위성)', '인터넷+포인트 (위성)', '인터넷+초이스 (위성)'],
  'LG소호': ['실속형', '기본형', '프리미엄'],
  'KT BIZ': ['베이직', '에센스', '모든G'],
}

export type InternetSpeed = string

// Contract (계약) 타입
export interface Contract {
  id: number
  consultation_id: number | null
  customer_name: string
  phone: string
  carrier: Carrier
  product_name: string | null
  support_amount: number
  extra_support: number
  scheduled_date: string | null
  desired_install_date: string | null
  status: ContractStatus
  created_at: string
  updated_at: string
}

export type ContractStatus =
  | '접수대기'
  | '접수완료'
  | '설치예정'
  | '설치완료'

// Settlement (정산) 타입
export interface Settlement {
  id: number
  contract_id: number | null
  receipt_datetime: string | null
  install_date: string | null
  gift_card: number
  back_price: number
  sales_commission: number
  customer_support: number
  ad_support: number
  margin: number
  vat_excluded: number
  settlement_confirmed: boolean
  settlement_date: string | null
  amount_confirmed: boolean
  vendor_matched: boolean
  memo: string | null
  settlement_account: string | null
  created_at: string
  updated_at: string
}

// Script (상담 스크립트) 타입
export interface Script {
  id: number
  category: string
  sort_order: number
  title: string
  text_script: string | null
  kakao_script: string | null
  related_links: RelatedLink[]
  related_phones: RelatedPhone[]
  is_favorite: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RelatedLink {
  label: string
  url: string
}

export interface RelatedPhone {
  label: string
  number: string
}

// Guideline (업무 가이드) 타입
export interface Guideline {
  id: number
  category: string | null
  sort_order: number
  title: string
  description: string | null
  importance: GuidelineImportance
  is_active: boolean
  created_at: string
  updated_at: string
}

export type GuidelineImportance = 'required' | 'recommended' | 'reference'

// Config (시스템 설정) 타입
export interface Config {
  id: number
  key: string
  value: unknown
  updated_at: string
}

// Dashboard 통계 타입
export interface DashboardStats {
  todayConsultations: number
  pendingFollowUps: number
  scheduledInstalls: number
  weeklyCompleted: number
  weeklyTarget: number
}

// 상태 색상 매핑
export const STATUS_COLORS: Record<ConsultationStatus, string> = {
  '재상담필요': 'bg-orange-100 text-orange-800',
  '신규': 'bg-blue-100 text-blue-800',
  '계약완료': 'bg-purple-100 text-purple-800',
  '상담완료': 'bg-green-100 text-green-800',
  '의향없음/타업체': 'bg-slate-100 text-slate-800',
}

// 중요도 색상 매핑
export const IMPORTANCE_COLORS: Record<GuidelineImportance, string> = {
  'required': 'bg-red-100 text-red-800',
  'recommended': 'bg-yellow-100 text-yellow-800',
  'reference': 'bg-gray-100 text-gray-800',
}

export const IMPORTANCE_LABELS: Record<GuidelineImportance, string> = {
  'required': '필수',
  'recommended': '권장',
  'reference': '참고',
}
