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
  { id: 2, name: '정상문', role: 'director' },
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
  | '신규'
  | '재상담필요'
  | '연락안됨'
  | '상담완료'
  | '접수완료'
  | '설치완료'
  | '취소'

export type Carrier = 'SKB' | 'KT' | 'LG'
export type InternetSpeed = '100M' | '500M' | '1G'

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
  '신규': 'bg-blue-100 text-blue-800',
  '재상담필요': 'bg-orange-100 text-orange-800',
  '연락안됨': 'bg-red-100 text-red-800',
  '상담완료': 'bg-green-100 text-green-800',
  '접수완료': 'bg-purple-100 text-purple-800',
  '설치완료': 'bg-emerald-100 text-emerald-800',
  '취소': 'bg-gray-100 text-gray-800',
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
