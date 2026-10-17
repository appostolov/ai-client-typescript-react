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

export const ChatSchema = z.object({
  id: z.string().startsWith('gen-'),
  object: z.literal('chat.completion'), 
  created: z.number().int().positive(),
  model: z.string().includes('/'),
  choices: z.array(ChoiceSchema),
  usage: UsageSchema
});

export type Chat = z.infer<typeof ChatSchema>;

export const ChatMapSchema = z.record(z.string(), ChatSchema);

export type ChatMap = {
  [id: Chat["id"]]: Chat;
};