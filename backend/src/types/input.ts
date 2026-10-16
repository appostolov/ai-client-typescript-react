import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
});

export type Message = z.infer<typeof MessageSchema>;

export const AskSchema = z.object({
  model: z.string().min(1),
  messages: z.array(MessageSchema)
});

export type Ask = z.infer<typeof AskSchema>;