-- 상담 수정 히스토리 테이블
-- Supabase SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS consultation_history (
  id SERIAL PRIMARY KEY,
  consultation_id INTEGER NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT
);

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_history_consultation_id ON consultation_history(consultation_id);
CREATE INDEX IF NOT EXISTS idx_history_changed_at ON consultation_history(changed_at DESC);

-- RLS 정책 (모든 인증된 사용자가 읽기/쓰기 가능)
ALTER TABLE consultation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all users" ON consultation_history
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON consultation_history
  FOR INSERT WITH CHECK (true);
