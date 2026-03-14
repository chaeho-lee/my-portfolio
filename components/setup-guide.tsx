"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SetupGuide() {
  const envVars = [
    {
      name: "OPENAI_API_KEY",
      description: "OpenAI API 키",
      required: true,
      example: "sk-...",
    },
    {
      name: "OPENAI_ASSISTANT_ID",
      description: "사용할 Assistant ID",
      required: true,
      example: "asst_...",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            설정 가이드
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>챗봇을 사용하기 위해서는 다음 환경 변수들이 설정되어야 합니다.</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">필수 환경 변수</h3>
            {envVars.map((envVar) => (
              <div key={envVar.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{envVar.name}</code>
                    {envVar.required && <Badge variant="destructive">필수</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">미설정</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{envVar.description}</p>
                <p className="text-xs text-gray-500">예시: {envVar.example}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">설정 방법</h3>
            <div className="space-y-2">
              <p className="text-sm">
                1. 프로젝트 루트에 <code className="bg-gray-100 px-1 rounded">.env.local</code> 파일 생성
              </p>
              <p className="text-sm">2. 다음 내용을 추가:</p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here`}
              </pre>
              <p className="text-sm">3. 개발 서버 재시작</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                OpenAI API 키 발급
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://platform.openai.com/assistants" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Assistant 생성
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
