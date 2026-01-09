'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  Database,
  Download,
  Upload,
  Check,
  X,
  Shield,
  Trash2,
  Clock,
  UserCheck,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { UserRole, ROLE_LABELS } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface DBUser {
  id: number
  name: string
  role: UserRole
  is_approved: boolean
  created_at: string
}

export default function AdminPage() {
  const { user: currentUser, hasPermission, refreshUsers } = useAuth()
  const [allUsers, setAllUsers] = useState<DBUser[]>([])
  const [pendingUsers, setPendingUsers] = useState<DBUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const canWrite = hasPermission('admin', 'write')

  // 사용자 목록 불러오기
  const fetchUsers = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      const approved = data.filter(u => u.is_approved) as DBUser[]
      const pending = data.filter(u => !u.is_approved) as DBUser[]
      setAllUsers(approved)
      setPendingUsers(pending)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 사용자 승인
  const approveUser = async (userId: number) => {
    setActionLoading(userId)
    await supabase
      .from('users')
      .update({ is_approved: true })
      .eq('id', userId)
    await fetchUsers()
    await refreshUsers()
    setActionLoading(null)
  }

  // 사용자 거부 (삭제)
  const rejectUser = async (userId: number) => {
    setActionLoading(userId)
    await supabase
      .from('users')
      .delete()
      .eq('id', userId)
    await fetchUsers()
    setActionLoading(null)
  }

  // 권한 변경
  const changeRole = async (userId: number, newRole: UserRole) => {
    setActionLoading(userId)
    await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)
    await fetchUsers()
    await refreshUsers()
    setActionLoading(null)
  }

  // 사용자 삭제
  const deleteUser = async (userId: number) => {
    if (!confirm('정말 이 사용자를 삭제하시겠습니까?')) return
    setActionLoading(userId)
    await supabase
      .from('users')
      .delete()
      .eq('id', userId)
    await fetchUsers()
    await refreshUsers()
    setActionLoading(null)
  }

  return (
    <div className="min-h-screen">
      <Header title="관리자 설정" description="시스템 설정 및 데이터를 관리하세요" />

      <div className="p-6 space-y-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              사용자 관리
            </TabsTrigger>
            <TabsTrigger value="scripts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              스크립트 관리
            </TabsTrigger>
            <TabsTrigger value="guidelines" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              가이드라인 관리
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              데이터 관리
            </TabsTrigger>
          </TabsList>

          {/* 사용자 관리 */}
          <TabsContent value="users" className="space-y-6">
            {/* 승인 대기 */}
            {pendingUsers.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-amber-800">승인 대기 ({pendingUsers.length}명)</CardTitle>
                  </div>
                  <CardDescription>
                    새로 가입한 사용자를 승인하거나 거부할 수 있습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <span className="text-amber-700 font-bold">{u.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{u.name}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(u.created_at).toLocaleDateString('ko-KR')} 가입 신청
                            </p>
                          </div>
                        </div>
                        {canWrite && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveUser(u.id)}
                              disabled={actionLoading === u.id}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              {actionLoading === u.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  승인
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectUser(u.id)}
                              disabled={actionLoading === u.id}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              거부
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 승인된 사용자 목록 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <CardTitle>승인된 사용자 ({allUsers.length}명)</CardTitle>
                </div>
                <CardDescription>
                  사용자의 권한 레벨을 변경하거나 삭제할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allUsers.map((u) => (
                      <div
                        key={u.id}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-lg border',
                          currentUser?.id === u.id && 'bg-blue-50 border-blue-200'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center',
                            u.role === 'c-level' && 'bg-purple-100',
                            u.role === 'director' && 'bg-blue-100',
                            u.role === 'staff' && 'bg-slate-100'
                          )}>
                            <Shield className={cn(
                              'h-5 w-5',
                              u.role === 'c-level' && 'text-purple-600',
                              u.role === 'director' && 'text-blue-600',
                              u.role === 'staff' && 'text-slate-500'
                            )} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-800">{u.name}</p>
                              {currentUser?.id === u.id && (
                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">나</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{ROLE_LABELS[u.role]}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {canWrite && (
                            <>
                              <Select
                                value={u.role}
                                onValueChange={(value) => changeRole(u.id, value as UserRole)}
                                disabled={actionLoading === u.id || currentUser?.id === u.id}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="c-level">C레벨</SelectItem>
                                  <SelectItem value="director">부서장</SelectItem>
                                  <SelectItem value="staff">담당자</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteUser(u.id)}
                                disabled={actionLoading === u.id || currentUser?.id === u.id}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

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
                      스크립트 관리 기능은 추후 업데이트 예정입니다.
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
                      가이드라인 관리 기능은 추후 업데이트 예정입니다.
                    </p>
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
      </div>
    </div>
  )
}
