import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("=== Environment Check - Server Side Only ===")

    // Ensure server-side execution
    if (typeof window !== "undefined") {
      return NextResponse.json(
        {
          isConfigured: false,
          message: "환경 체크는 서버에서만 실행될 수 있습니다.",
          error: "BROWSER_EXECUTION_ERROR",
        },
        { status: 500 },
      )
    }

    // Use server utility for validation
    const { validateServerEnvironment } = await import("@/lib/openai-server")
    const validation = validateServerEnvironment()

    console.log("Server environment validation:", validation)

    const isConfigured =
      validation.hasApiKey && validation.hasAssistantId && validation.apiKeyValid && validation.assistantIdValid

    return NextResponse.json({
      isConfigured,
      message: (() => {
        if (!validation.hasApiKey) return "서버에 OPENAI_API_KEY가 설정되지 않았습니다"
        if (!validation.apiKeyValid) return "서버의 OPENAI_API_KEY 형식이 올바르지 않습니다"
        if (!validation.hasAssistantId) return "서버에 OPENAI_ASSISTANT_ID가 설정되지 않았습니다"
        if (!validation.assistantIdValid) return "서버의 OPENAI_ASSISTANT_ID 형식이 올바르지 않습니다"
        return "서버 설정이 완료되었습니다. 챗봇을 사용할 수 있습니다."
      })(),
      serverInfo: {
        nodeEnv: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
        serverSide: typeof window === "undefined",
      },
      validation: {
        apiKeyExists: validation.hasApiKey,
        apiKeyValid: validation.apiKeyValid,
        assistantIdExists: validation.hasAssistantId,
        assistantIdValid: validation.assistantIdValid,
      },
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json(
      {
        isConfigured: false,
        message: "서버 환경 확인 중 오류가 발생했습니다",
        error: error instanceof Error ? error.message : "Unknown error",
        serverSide: typeof window === "undefined",
      },
      { status: 500 },
    )
  }
}
