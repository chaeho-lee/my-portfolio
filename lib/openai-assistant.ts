import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export class AssistantChat {
  private assistantId: string
  private threadId: string | null = null

  constructor(assistantId: string) {
    this.assistantId = assistantId
  }

  async createThread(): Promise<string> {
    const thread = await openai.beta.threads.create()
    this.threadId = thread.id
    return thread.id
  }

  async addMessage(content: string): Promise<void> {
    if (!this.threadId) {
      await this.createThread()
    }

    await openai.beta.threads.messages.create(this.threadId!, {
      role: "user",
      content: content,
    })
  }

  async runAssistant(): Promise<string> {
    if (!this.threadId) {
      throw new Error("No thread created")
    }

    const run = await openai.beta.threads.runs.create(this.threadId, {
      assistant_id: this.assistantId,
    })

    // 실행 완료까지 대기
    let runStatus = await openai.beta.threads.runs.retrieve(this.threadId, run.id)

    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(this.threadId, run.id)
    }

    if (runStatus.status === "completed") {
      const messages = await openai.beta.threads.messages.list(this.threadId)
      const lastMessage = messages.data[0]

      if (lastMessage.role === "assistant" && lastMessage.content[0].type === "text") {
        return lastMessage.content[0].text.value
      }
    }

    throw new Error("Assistant run failed")
  }

  async getMessages(): Promise<ChatMessage[]> {
    if (!this.threadId) {
      return []
    }

    const messages = await openai.beta.threads.messages.list(this.threadId)

    return messages.data.reverse().map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content[0].type === "text" ? msg.content[0].text.value : "",
      timestamp: new Date(msg.created_at * 1000),
    }))
  }

  getThreadId(): string | null {
    return this.threadId
  }

  setThreadId(threadId: string): void {
    this.threadId = threadId
  }
}
