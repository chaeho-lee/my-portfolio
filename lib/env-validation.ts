export function validateEnvironment() {
  const requiredEnvVars = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_ASSISTANT_ID: process.env.OPENAI_ASSISTANT_ID,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }

  return requiredEnvVars as Record<keyof typeof requiredEnvVars, string>
}

export function getOpenAIConfig() {
  try {
    const env = validateEnvironment()
    return {
      apiKey: env.OPENAI_API_KEY,
      assistantId: env.OPENAI_ASSISTANT_ID,
    }
  } catch (error) {
    console.error("Environment validation failed:", error)
    throw error
  }
}
