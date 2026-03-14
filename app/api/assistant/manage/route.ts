import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function POST(req: NextRequest) {
  try {
    const { name, instructions, model } = await req.json()

    if (!name || !instructions) {
      return NextResponse.json({ error: "Name and instructions are required" }, { status: 400 })
    }

    const assistant = await openai.beta.assistants.create({
      name: name,
      instructions: instructions,
      model: model || "gpt-4-turbo",
      tools: [{ type: "code_interpreter" }],
    })

    return NextResponse.json(assistant)
  } catch (error) {
    console.error("Assistant creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create assistant",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const assistantId = searchParams.get("id")

    if (assistantId) {
      const assistant = await openai.beta.assistants.retrieve(assistantId)
      return NextResponse.json(assistant)
    } else {
      const assistants = await openai.beta.assistants.list()
      return NextResponse.json(assistants.data)
    }
  } catch (error) {
    console.error("Assistant fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch assistant(s)",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const assistantId = searchParams.get("id")

    if (!assistantId) {
      return NextResponse.json({ error: "Assistant ID is required" }, { status: 400 })
    }

    const response = await openai.beta.assistants.del(assistantId)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Assistant deletion error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete assistant",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
