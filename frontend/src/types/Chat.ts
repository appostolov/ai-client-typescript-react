export interface Message {
    role: 'user' | 'assistant' | 'system',
    content: string | null
}

export interface Choice {
    index: number,
    message: Message,
    finish_reason: string
}

export interface Usage {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
}

export interface Request {
    model: string, 
    messages: Message[],
    temperature: number,
    max_tokens: number
}

export interface Response {
    id: string,
    object: "chat.completion", 
    created: number,
    model: string,
    choices: Choice[],
    usage?: Usage
}

export type Chat = [ Request, Response ][]

export interface ChatMap {
    [key: string]: Chat;
}