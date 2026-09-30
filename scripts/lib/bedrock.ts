import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const REGION = process.env.AWS_REGION || 'eu-central-1'
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'eu.anthropic.claude-sonnet-5-v1'

const client = new BedrockRuntimeClient({ region: REGION })

interface GenerateOptions {
  system?: string
  maxTokens?: number
  temperature?: number
}

interface BedrockResponse {
  content: Array<{ type: string, text: string }>
  usage?: { input_tokens: number, output_tokens: number }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function generateText(userMessage: string, opts: GenerateOptions = {}): Promise<{ text: string, inputTokens: number, outputTokens: number }> {
  const maxTokens = opts.maxTokens ?? 4096
  const temperature = opts.temperature ?? 0.4

  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    temperature,
    ...(opts.system && { system: opts.system }),
    messages: [
      { role: 'user', content: userMessage }
    ]
  }

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(body)
  })

  const maxAttempts = 4
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await client.send(command)
      const decoded = new TextDecoder().decode(response.body) as string
      const parsed = JSON.parse(decoded) as BedrockResponse

      const text = parsed.content?.map(c => c.text).join('') || ''
      return {
        text,
        inputTokens: parsed.usage?.input_tokens ?? 0,
        outputTokens: parsed.usage?.output_tokens ?? 0
      }
    } catch (err) {
      const error = err as { name?: string, message?: string }
      const retryable = error.name === 'ThrottlingException'
        || error.name === 'ServiceUnavailableException'
        || error.name === 'ModelStreamErrorException'
        || (error.message || '').includes('Too many requests')

      if (retryable && attempt < maxAttempts) {
        const backoff = 1000 * Math.pow(2, attempt - 1) + Math.random() * 500
        await sleep(backoff)
        continue
      }
      throw err
    }
  }

  throw new Error('Bedrock retries exhausted')
}

export async function generateJson<T>(userMessage: string, opts: GenerateOptions = {}): Promise<{ data: T, inputTokens: number, outputTokens: number }> {
  const { text, inputTokens, outputTokens } = await generateText(userMessage, opts)

  // Extract JSON between <json>...</json> tags, or fallback to raw JSON detection
  const tagMatch = text.match(/<json>([\s\S]*?)<\/json>/)
  const jsonStr = tagMatch ? tagMatch[1] : text.match(/\{[\s\S]*\}/)?.[0]

  if (!jsonStr) {
    throw new Error(`No JSON found in response. Raw text starts with: ${text.slice(0, 200)}`)
  }

  try {
    const data = JSON.parse(jsonStr.trim()) as T
    return { data, inputTokens, outputTokens }
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err}. Content: ${jsonStr.slice(0, 300)}`, { cause: err })
  }
}
