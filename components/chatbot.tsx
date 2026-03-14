"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, Send, X, Bot, User, Loader2, AlertCircle, Shield, RefreshCw } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatResponse {
  success: boolean
  response: string
  threadId: string
  metadata?: {
    runId: string
    attempts: number
    timestamp: string
  }
}

interface ChatError {
  error: string
  code: string
  details?: string
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "안녕하세요! 이채호의 포트폴리오 챗봇입니다. 저에 대해 궁금한 것이 있으시면 언제든 물어보세요! 😊",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageContent = input.trim()
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      console.log("Sending message to server...")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          threadId: threadId,
        }),
      })

      console.log("Server response status:", response.status)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("서버에서 올바르지 않은 응답을 받았습니다.")
      }

      const data: ChatResponse | ChatError = await response.json()

      if (!response.ok) {
        const errorData = data as ChatError
        console.log("Server error:", errorData)

        // 스레드 오류 처리 - 자동으로 새 대화 시작
        if (
          errorData.code === "THREAD_ERROR" ||
          errorData.code === "THREAD_CREATE_ERROR" ||
          errorData.code === "MESSAGE_ADD_ERROR"
        ) {
          console.log("Thread error detected, resetting thread...")
          setThreadId(null) // 스레드 ID 초기화

          // 새 대화 시작 메시지
          const resetMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "대화 연결에 문제가 있어 새로운 대화를 시작합니다. 다시 질문해주세요! 😊",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, resetMessage])
          return
        }

        // 다른 오류들에 대한 사용자 친화적 메시지
        const userFriendlyError = (() => {
          switch (errorData.code) {
            case "INVALID_API_KEY":
            case "INVALID_ASSISTANT_ID":
              return "서버 설정에 문제가 있습니다. 잠시 후 다시 시도해주세요."
            case "INVALID_MESSAGE":
              return "메시지를 입력해주세요."
            case "TIMEOUT":
              return "응답 시간이 초과되었습니다. 다시 시도해주세요."
            case "RUN_FAILED":
              return "AI 처리 중 오류가 발생했습니다. 다시 시도해주세요."
            default:
              return errorData.error || "알 수 없는 오류가 발생했습니다."
          }
        })()

        throw new Error(userFriendlyError)
      }

      const successData = data as ChatResponse
      console.log("Server response:", successData)

      if (successData.success && successData.response) {
        setThreadId(successData.threadId)

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: successData.response,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error("서버에서 올바른 응답을 받지 못했습니다.")
      }
    } catch (error) {
      console.log("Chat error:", error)
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      setError(errorMessage)

      // 오류 메시지를 채팅에 표시
      const errorChatMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `죄송합니다. ${errorMessage} 다시 시도해주세요.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorChatMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const resetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "대화를 초기화했습니다. 새로운 질문을 해주세요! 😊",
        timestamp: new Date(),
      },
    ])
    setThreadId(null)
    setError(null)
  }

  return (
    <>
      {/* 챗봇 토글 버튼 */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        size="icon"
        aria-label="챗봇 열기/닫기"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* 챗봇 창 */}
      {isOpen && (
        <Card
          ref={chatContainerRef}
          className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] flex flex-col shadow-xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
        >
          {/* 챗봇 헤더 */}
          <div className="bg-blue-600 dark:bg-blue-500 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <h3 className="font-medium">채호의 포트폴리오 챗봇</h3>
              <Shield size={14} className="opacity-75" title="서버에서 안전하게 처리됩니다" />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={resetChat}
                title="대화 초기화"
              >
                <RefreshCw size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* 보안 알림 */}
          <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-green-600 dark:text-green-400" />
              <p className="text-xs text-green-700 dark:text-green-300">모든 대화는 서버에서 안전하게 처리됩니다</p>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={clearError} className="h-6 w-6 p-0 ml-2">
                  <X size={12} />
                </Button>
              </div>
            </div>
          )}

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-900 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot size={12} className="text-blue-600 dark:text-blue-400" />
                  </div>
                )}

                <div className="max-w-[80%]">
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === "user" ? "text-right text-gray-500" : "text-left text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ml-2 flex-shrink-0">
                    <User size={12} className="text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                  <Bot size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" />
                    <p className="text-sm">AI가 답변을 생성하고 있습니다...</p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Enter로 전송, Shift+Enter로 줄바꿈</p>
          </form>
        </Card>
      )}
    </>
  )
}
