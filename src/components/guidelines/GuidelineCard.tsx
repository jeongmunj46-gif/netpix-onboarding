'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Guideline, IMPORTANCE_COLORS, IMPORTANCE_LABELS } from '@/types'
import { AlertTriangle, Lightbulb, Info } from 'lucide-react'

interface GuidelineCardProps {
  guideline: Guideline
  index: number
  checked: boolean
  onToggleCheck: (id: number) => void
}

const importanceIcons = {
  required: AlertTriangle,
  recommended: Lightbulb,
  reference: Info,
}

export function GuidelineCard({ guideline, index, checked, onToggleCheck }: GuidelineCardProps) {
  const Icon = importanceIcons[guideline.importance]

  return (
    <Card className={`transition-all ${checked ? 'bg-gray-50 opacity-70' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* 체크박스 */}
          <div className="pt-1">
            <Checkbox
              checked={checked}
              onCheckedChange={() => onToggleCheck(guideline.id)}
              className="h-5 w-5"
            />
          </div>

          {/* 번호 */}
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">{index}</span>
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className={IMPORTANCE_COLORS[guideline.importance]}>
                <Icon className="h-3 w-3 mr-1" />
                {IMPORTANCE_LABELS[guideline.importance]}
              </Badge>
              {guideline.category && (
                <Badge variant="outline" className="text-xs">
                  {guideline.category}
                </Badge>
              )}
            </div>
            <p className={`text-sm text-gray-800 ${checked ? 'line-through' : ''}`}>
              {guideline.title}
            </p>
            {guideline.description && (
              <p className="text-xs text-gray-500 mt-2">{guideline.description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
