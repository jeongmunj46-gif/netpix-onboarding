'use client'

import { Header } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  Database,
  Download,
  Upload,
} from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Header title="관리자 설정" description="시스템 설정 및 데이터를 관리하세요" />

      <div className="p-6 space-y-6">
        <Tabs defaultValue="scripts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scripts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              스크립트 관리
            </TabsTrigger>
            <TabsTrigger value="guidelines" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              가이드라인 관리
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              담당자 관리
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              데이터 관리
            </TabsTrigger>
          </TabsList>

          {/* 스크립트 관리 */}
          <TabsContent value="scripts">
            <Card>
              <CardHeader>
                <CardTitle>상담 스크립트 관리</CardTitle>
                <CardDescription>
                  상담 시 사용하는 스크립트를 추가, 수정, 삭제할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">총 8개의 스크립트가 등록되어 있습니다.</p>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      새 스크립트 추가
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      스크립트 관리 기능은 Supabase 연결 후 사용 가능합니다.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      현재는 임시 데이터로 표시되고 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 가이드라인 관리 */}
          <TabsContent value="guidelines">
            <Card>
              <CardHeader>
                <CardTitle>업무 가이드라인 관리</CardTitle>
                <CardDescription>
                  영업 필수 주의사항을 추가, 수정, 삭제할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">총 26개의 가이드라인이 등록되어 있습니다.</p>
                    <Button>
                      <BookOpen className="h-4 w-4 mr-2" />
                      새 가이드라인 추가
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      가이드라인 관리 기능은 Supabase 연결 후 사용 가능합니다.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      현재는 임시 데이터로 표시되고 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 담당자 관리 */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>담당자 관리</CardTitle>
                <CardDescription>
                  상담 담당자 목록을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">등록된 담당자 목록</p>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      담당자 추가
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['정상문', '정상담', '김직원', '이대리'].map((name) => (
                      <div
                        key={name}
                        className="p-4 bg-gray-50 rounded-lg text-center"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 font-bold">{name[0]}</span>
                        </div>
                        <p className="font-medium">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 데이터 관리 */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>데이터 관리</CardTitle>
                <CardDescription>
                  데이터 백업 및 복원을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Download className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">데이터 내보내기</h3>
                        <p className="text-sm text-gray-500">현재 데이터를 JSON 파일로 다운로드</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      JSON으로 내보내기
                    </Button>
                  </div>

                  <div className="p-6 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Upload className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold">데이터 가져오기</h3>
                        <p className="text-sm text-gray-500">JSON 파일에서 데이터 복원</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      JSON에서 가져오기
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    ⚠️ <strong>주의:</strong> 데이터 가져오기는 기존 데이터를 덮어씁니다. 중요한
                    데이터는 먼저 내보내기 하세요.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Supabase 연결 안내 */}
        <Card className="border-dashed border-2">
          <CardContent className="p-6 text-center">
            <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Supabase 연결이 필요합니다</h3>
            <p className="text-gray-500 mb-4">
              실제 데이터 저장 및 관리를 위해 Supabase 프로젝트를 연결해주세요.
            </p>
            <p className="text-sm text-gray-400">
              <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> 파일에 Supabase URL과
              API Key를 설정하세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
