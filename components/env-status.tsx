"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, EyeOff, ExternalLink, Shield, Server } from "lucide-react"

interface EnvStatus {
  isConfigured: boolean
  message: string
  serverInfo: {
    nodeEnv: string
    nodeVersion: string
    platform: string
    timestamp: string
  }
  validation: {
    apiKeyExists: boolean
    apiKeyValid: boolean
    assistantIdExists: boolean
    assistantIdValid: boolean
  }
}

export default function EnvStatus() {
  const [status, setStatus] = useState<EnvStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEnvStatus = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Checking server environment status...")

      const response = await fetch("/api/env-check", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Server environment status:", data)
        setStatus(data)
        setError(null)
      } else {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }))

        console.error("Server environment check failed:", errorData)
        setError(errorData.error || `서버 오류 ${response.status}`)
        setStatus(null)
      }
    } catch (error) {
      console.error("Environment check network error:", error)
      const errorMessage = error instanceof Error ? error.message : "네트워크 오류"
      setError(errorMessage)
      setStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkEnvStatus()
    // 30초마다 자동 체크
    const interval = setInterval(checkEnvStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading && !status) {
    return (
      <div className="fixed bottom-6 left-6 z-40">
        <Card className="w-80">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-sm">서버 상태 확인 중...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Card className="w-80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="w-4 h-4" />
              서버 상태
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={checkEnvStatus} disabled={isLoading} title="상태 새로고침">
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} title="상세 정보 토글">
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 보안 알림 */}
          <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">보안 모드</span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              API 키는 서버에서만 사용되며 브라우저에 노출되지 않습니다
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">서버 오류</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {status?.isConfigured ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">챗봇 상태</span>
            </div>
            <Badge variant={status?.isConfigured ? "default" : "destructive"}>
              {status?.isConfigured ? "활성" : "비활성"}
            </Badge>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {status?.message || "서버 상태를 확인할 수 없습니다"}
          </p>

          {showDetails && status && (
            <div className="space-y-2 text-xs">
              <div className="border-t pt-2">
                <p className="font-medium mb-2">서버 검증 정보:</p>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>API Key (서버):</span>
                    <span className={status.validation.apiKeyExists ? "text-green-600" : "text-red-600"}>
                      {status.validation.apiKeyExists && status.validation.apiKeyValid ? "✓ 유효" : "✗ 무효"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assistant ID (서버):</span>
                    <span className={status.validation.assistantIdExists ? "text-green-600" : "text-red-600"}>
                      {status.validation.assistantIdExists && status.validation.assistantIdValid ? "✓ 유효" : "✗ 무효"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>서버 환경:</span>
                    <span>{status.serverInfo.nodeEnv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Node.js:</span>
                    <span>{status.serverInfo.nodeVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>플랫폼:</span>
                    <span>{status.serverInfo.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>마지막 확인:</span>
                    <span>{new Date(status.serverInfo.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!status?.isConfigured && (
            <div className="mt-3 space-y-2">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>서버 설정 필요:</strong>
                  <br />
                  1. 서버의 .env.local 파일 확인
                  <br />
                  2. OPENAI_API_KEY=sk-... 설정
                  <br />
                  3. OPENAI_ASSISTANT_ID=asst_... 설정
                  <br />
                  4. 서버 재시작 필요
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => window.open("https://platform.openai.com/api-keys", "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  API 키 발급
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => window.open("https://platform.openai.com/assistants", "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Assistant 생성
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
