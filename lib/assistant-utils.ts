import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function createAssistant(name: string, instructions: string, model = "gpt-4-turbo") {
  const assistant = await openai.beta.assistants.create({
    name: name,
    instructions: instructions,
    model: model,
    tools: [{ type: "code_interpreter" }],
  })

  return assistant
}

export async function listAssistants() {
  const assistants = await openai.beta.assistants.list()
  return assistants.data
}

export async function getAssistant(assistantId: string) {
  const assistant = await openai.beta.assistants.retrieve(assistantId)
  return assistant
}

export async function updateAssistant(assistantId: string, updates: any) {
  const assistant = await openai.beta.assistants.update(assistantId, updates)
  return assistant
}

export async function deleteAssistant(assistantId: string) {
  const response = await openai.beta.assistants.del(assistantId)
  return response
}
