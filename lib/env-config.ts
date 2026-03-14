// 환경 변수 로딩을 위한 유틸리티
export function getEnvConfig() {
  // 여러 방법으로 환경 변수 시도
  const apiKey =
    process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || globalThis.process?.env?.OPENAI_API_KEY

  const assistantId =
    process.env.OPENAI_ASSISTANT_ID ||
    process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID ||
    globalThis.process?.env?.OPENAI_ASSISTANT_ID

  console.log("Environment config check:")
  console.log("- API Key from process.env.OPENAI_API_KEY:", !!process.env.OPENAI_API_KEY)
  console.log("- Assistant ID from process.env.OPENAI_ASSISTANT_ID:", !!process.env.OPENAI_ASSISTANT_ID)
  console.log("- Final API Key:", !!apiKey)
  console.log("- Final Assistant ID:", !!assistantId)

  return {
    apiKey,
    assistantId,
    isValid: !!(apiKey && assistantId),
  }
}
