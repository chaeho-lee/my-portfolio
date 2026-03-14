"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Trash2, Copy, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Assistant {
  id: string
  name: string
  instructions: string
  model: string
  created_at: number
}

export default function AssistantManager() {
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [newAssistant, setNewAssistant] = useState({
    name: "",
    instructions: "",
    model: "gpt-4-turbo",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchAssistants()
  }, [])

  const fetchAssistants = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/assistant/manage")
      if (response.ok) {
        const data = await response.json()
        setAssistants(data)
      } else {
        const errorData = await response.json()
        toast({
          title: "오류",
          description: errorData.error || "Assistant 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch assistants:", error)
      toast({
        title: "오류",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createAssistant = async () => {
    if (!newAssistant.name || !newAssistant.instructions) {
      toast({
        title: "입력 오류",
        description: "이름과 지시사항을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/assistant/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssistant),
      })

      if (response.ok) {
        const assistant = await response.json()
        setAssistants((prev) => [...prev, assistant])
        setNewAssistant({ name: "", instructions: "", model: "gpt-4-turbo" })
        toast({
          title: "성공",
          description: "Assistant가 성공적으로 생성되었습니다.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "생성 실패",
          description: errorData.error || "Assistant 생성에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to create assistant:", error)
      toast({
        title: "오류",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const deleteAssistant = async (assistantId: string) => {
    if (!confirm("정말로 이 Assistant를 삭제하시겠습니까?")) {
      return
    }

    try {
      const response = await fetch(`/api/assistant/manage?id=${assistantId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAssistants((prev) => prev.filter((a) => a.id !== assistantId))
        toast({
          title: "삭제 완료",
          description: "Assistant가 성공적으로 삭제되었습니다.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "삭제 실패",
          description: errorData.error || "Assistant 삭제에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete assistant:", error)
      toast({
        title: "오류",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (text: string, assistantId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(assistantId)
      setTimeout(() => setCopiedId(null), 2000)
      toast({
        title: "복사 완료",
        description: "Assistant ID가 클립보드에 복사되었습니다.",
      })
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "클립보드 복사에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />새 Assistant 만들기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">이름</label>
            <Input
              value={newAssistant.name}
              onChange={(e) => setNewAssistant((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Assistant 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">모델</label>
            <Select
              value={newAssistant.model}
              onValueChange={(value) => setNewAssistant((prev) => ({ ...prev, model: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">지시사항</label>
            <Textarea
              value={newAssistant.instructions}
              onChange={(e) => setNewAssistant((prev) => ({ ...prev, instructions: e.target.value }))}
              placeholder="Assistant의 역할과 행동 방식을 설명하세요"
              rows={4}
            />
          </div>

          <Button
            onClick={createAssistant}
            disabled={isCreating || !newAssistant.name || !newAssistant.instructions}
            className="w-full"
          >
            {isCreating ? "생성 중..." : "Assistant 생성"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            기존 Assistants
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500 text-center py-4">로딩 중...</p>
          ) : assistants.length === 0 ? (
            <p className="text-gray-500 text-center py-4">생성된 Assistant가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {assistants.map((assistant) => (
                <div key={assistant.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{assistant.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {assistant.model}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteAssistant(assistant.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{assistant.instructions}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-gray-400 font-mono">{assistant.id}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(assistant.id, assistant.id)}
                    >
                      {copiedId === assistant.id ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    생성일: {new Date(assistant.created_at * 1000).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
