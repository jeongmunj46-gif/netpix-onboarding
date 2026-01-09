/**
 * Supabase 클라이언트 설정
 *
 * 이 파일이 하는 일:
 * - Supabase 데이터베이스와 연결
 * - 모든 페이지에서 이 클라이언트를 사용해서 데이터를 저장/불러옴
 *
 * 사용 방법:
 * import { supabase } from '@/lib/supabase/client'
 * const { data } = await supabase.from('users').select('*')
 */

import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 연결 정보 가져오기
// .env.local 파일에 저장되어 있음
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Supabase 클라이언트 생성
// 이 클라이언트로 데이터베이스 작업을 수행
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
