import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
});

export type Message = z.infer<typeof MessageSchema>;

export const ChoiceSchema = z.object({
  index: z.number().int().nonnegative(),
  message: MessageSchema,
  finish_reason: z.enum(['stop', 'length', 'content_filter']).nullable()
});

export type Choice = z.infer<typeof ChoiceSchema>;

export const UsageSchema = z.object({
  prompt_tokens: z.number().int().positive(),
  completion_tokens: z.number().int().positive(),
  total_tokens: z.number().int().positive()
});

export type Usage = z.infer<typeof UsageSchema>;

export const RequestSchema = z.object({
  model: z.string().includes('/'),
  messages: z.array(MessageSchema),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().int().positive()
});

export type Request = z.infer<typeof RequestSchema>;

export const ResponseSchema = z.object({
  id: z.string().startsWith('gen-'),
  object: z.literal('chat.completion'), 
  created: z.number().int().positive(),
  model: z.string().includes('/'),
  choices: z.array(ChoiceSchema),
  usage: UsageSchema
});

export type Response = z.infer<typeof ResponseSchema>;

export const ChatSchema = z.object({
  start: z.number().int().positive(),
  conversation: z.array(z.tuple([RequestSchema, ResponseSchema]))
});

export type Chat = z.infer<typeof ChatSchema>;

export const ChatMapSchema = z.record(z.string().startsWith('gen-'), ChatSchema);

export type ChatMap = {
  [id: string]: Chat;
};