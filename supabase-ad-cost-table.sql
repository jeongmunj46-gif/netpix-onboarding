-- 거래처별 DB 광고비 테이블
-- Supabase SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS ad_costs (
  id SERIAL PRIMARY KEY,
  vendor_name TEXT NOT NULL UNIQUE,
  cost_per_db INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE ad_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all users" ON ad_costs
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON ad_costs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON ad_costs
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON ad_costs
  FOR DELETE USING (true);

-- consultations 테이블에 거래처 필드 추가 (없으면)
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS vendor TEXT;
