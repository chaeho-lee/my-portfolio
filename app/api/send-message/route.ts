// app/api/send-message/route.ts
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json(
        { success: false, error: "message 필드에 문자열을 넣어 주세요." },
        { status: 400 },
      )
    }

    const message = body.message.trim()

    // 여기에서 OpenAI 호출 등 실제 로직을 넣을 수 있음
    // 지금은 테스트용으로 에코만 반환
    return NextResponse.json({
      success: true,
      receivedMessage: message,
      length: message.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("sendMessage API error:", error)
    return NextResponse.json(
      { success: false, error: "서버 내부 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}