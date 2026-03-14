import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("=== Chat API Request ===");

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (!apiKey || !assistantId) {
      return NextResponse.json({ error: "API 키 또는 Assistant ID가 누락되었습니다." }, { status: 500 });
    }

    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });

    const body = await req.json();
    const { message, threadId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "메시지가 유효하지 않습니다." }, { status: 400 });
    }

    let currentThreadId = threadId;

    // 새 스레드 생성
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
      console.log("🧵 새 스레드 생성:", currentThreadId);
    }

    // 메시지 추가
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: message,
    });
    console.log("📨 메시지 추가 완료");

    // Assistant 실행
    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: assistantId,
    });
    console.log("▶️ Assistant 실행 시작:", run.id);

    // 실행 상태 확인 (polling)
    let runStatus = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const result = await openai.beta.threads.runs.retrieve(run.id, { thread_id: currentThreadId });

      if (result.status === "completed") {
        runStatus = result;
        break;
      }

      if (["failed", "cancelled", "expired"].includes(result.status)) {
        return NextResponse.json({ error: "AI 실행 실패", code: "RUN_FAILED" }, { status: 500 });
      }

      await new Promise((res) => setTimeout(res, 1000));
      attempts++;
    }

    if (!runStatus) {
      return NextResponse.json({ error: "AI 응답 지연", code: "TIMEOUT" }, { status: 408 });
    }

    // 마지막 assistant 메시지 가져오기
    const messages = await openai.beta.threads.messages.list(currentThreadId, { limit: 1 });
    const lastMessage = messages.data?.[0];

    if (
      !lastMessage ||
      lastMessage.role !== "assistant" ||
      lastMessage.content?.[0]?.type !== "text"
    ) {
      return NextResponse.json({ error: "AI 응답 없음", code: "NO_RESPONSE" }, { status: 500 });
    }

    const responseText = lastMessage.content[0].text.value;

    return NextResponse.json({
      success: true,
      response: responseText,
      threadId: currentThreadId,
    });
  } catch (err) {
    console.error("🔥 서버 내부 오류:", err);
    return NextResponse.json({ error: "서버 오류 발생", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
