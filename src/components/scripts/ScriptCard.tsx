'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, MessageSquare, Star, ExternalLink, Phone } from 'lucide-react'
import { Script } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface ScriptCardProps {
  script: Script
  onToggleFavorite?: (id: number) => void
}

export function ScriptCard({ script, onToggleFavorite }: ScriptCardProps) {
  const [copiedText, setCopiedText] = useState(false)
  const [copiedKakao, setCopiedKakao] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = async (text: string | null, type: 'text' | 'kakao') => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      if (type === 'text') {
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 2000)
      } else {
        setCopiedKakao(true)
        setTimeout(() => setCopiedKakao(false), 2000)
      }
      toast({
        title: '복사 완료',
        description: '클립보드에 복사되었습니다.',
      })
    } catch {
      toast({
        title: '복사 실패',
        description: '복사에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {script.category}
            </Badge>
            <CardTitle className="text-base font-semibold">{script.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleFavorite?.(script.id)}
          >
            <Star
              className={`h-4 w-4 ${script.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 문자 스크립트 */}
        {script.text_script && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                문자 스크립트
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => copyToClipboard(script.text_script, 'text')}
              >
                {copiedText ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    복사
                  </>
                )}
              </Button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
              {script.text_script}
            </div>
          </div>
        )}

        {/* 카톡 스크립트 */}
        {script.kakao_script && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                카카오톡 스크립트
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                onClick={() => copyToClipboard(script.kakao_script, 'kakao')}
              >
                {copiedKakao ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    카톡 복사
                  </>
                )}
              </Button>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
              {script.kakao_script}
            </div>
          </div>
        )}

        {/* 관련 링크 */}
        {script.related_links && script.related_links.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-gray-500">관련 링크</span>
            <div className="flex flex-wrap gap-2">
              {script.related_links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 관련 전화번호 */}
        {script.related_phones && script.related_phones.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-gray-500">관련 연락처</span>
            <div className="flex flex-wrap gap-2">
              {script.related_phones.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${phone.number}`}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  {phone.label}: {phone.number}
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
