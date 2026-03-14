// Server-side only OpenAI client utility
import type OpenAI from "openai"

let openaiInstance: OpenAI | null = null

export async function getServerOpenAIClient(): Promise<OpenAI> {
  // Ensure server-side execution
  if (typeof window !== "undefined") {
    throw new Error("OpenAI client can only be used on server side")
  }

  if (!openaiInstance) {
    console.log("Initializing OpenAI client on server...")

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is required")
    }

    if (!apiKey.startsWith("sk-")) {
      throw new Error("Invalid OPENAI_API_KEY format")
    }

    // Dynamic import to ensure server-side only
    const { default: OpenAI } = await import("openai")

    openaiInstance = new OpenAI({
      apiKey: apiKey,
      // Explicitly disable browser usage
      dangerouslyAllowBrowser: false,
    })

    console.log("OpenAI client initialized successfully on server")
  }

  return openaiInstance
}

export function validateServerEnvironment() {
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server side")
  }

  const apiKey = process.env.OPENAI_API_KEY
  const assistantId = process.env.OPENAI_ASSISTANT_ID

  return {
    hasApiKey: !!apiKey,
    hasAssistantId: !!assistantId,
    apiKeyValid: apiKey?.startsWith("sk-") && apiKey.length > 20,
    assistantIdValid: assistantId?.startsWith("asst_") && assistantId.length > 10,
  }
}
