import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    console.log("=== Chat Test API ===")

    // 환경 변수 직접 확인
    const envCheck = {
      apiKey: process.env.OPENAI_API_KEY,
      assistantId: process.env.OPENAI_ASSISTANT_ID,
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter((key) => key.includes("OPENAI")),
    }

    console.log("Environment check:", {
      ...envCheck,
      apiKey: envCheck.apiKey ? `${envCheck.apiKey.substring(0, 10)}...` : "undefined",
      assistantId: envCheck.assistantId ? `${envCheck.assistantId.substring(0, 10)}...` : "undefined",
    })

    if (!envCheck.apiKey) {
      return NextResponse.json(
        {
          error: "API 키가 설정되지 않았습니다",
          debug: envCheck,
        },
        { status: 500 },
      )
    }

    if (!envCheck.assistantId) {
      return NextResponse.json(
        {
          error: "Assistant ID가 설정되지 않았습니다",
          debug: envCheck,
        },
        { status: 500 },
      )
    }

    // OpenAI 클라이언트 테스트
    try {
      const { default: OpenAI } = await import("openai")
      const openai = new OpenAI({
        apiKey: envCheck.apiKey,
      })

      // 간단한 API 테스트
      const models = await openai.models.list()
      console.log("OpenAI API connection successful, models count:", models.data.length)

      return NextResponse.json({
        success: true,
        message: "OpenAI API 연결 성공",
        debug: {
          modelsCount: models.data.length,
          apiKeyValid: true,
          assistantIdExists: true,
        },
      })
    } catch (openaiError) {
      console.error("OpenAI API test failed:", openaiError)
      return NextResponse.json(
        {
          error: "OpenAI API 연결 실패",
          debug: {
            openaiError: openaiError instanceof Error ? openaiError.message : "Unknown error",
            apiKeyExists: !!envCheck.apiKey,
            apiKeyFormat: envCheck.apiKey?.startsWith("sk-"),
          },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Chat test API error:", error)
    return NextResponse.json(
      {
        error: "테스트 API 오류",
        debug: {
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : "No stack trace",
        },
      },
      { status: 500 },
    )
  }
}
