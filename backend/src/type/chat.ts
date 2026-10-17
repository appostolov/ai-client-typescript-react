import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().nullable()
});

export type Message = z.infer<typeof MessageSchema>;

export const ChoiceSchema = z.object({
  index: z.number().int().nonnegative(),
  message: z.object({
    role: z.literal("assistant"),
    content: z.string().nullable()
  }),
  finish_reason: z.string()
});

export type Choice = z.infer<typeof ChoiceSchema>;

export const UsageSchema = z.object({
  prompt_tokens: z.number().int().nonnegative(),
  completion_tokens: z.number().int().nonnegative(),
  total_tokens: z.number().int().nonnegative()
});

export type Usage = z.infer<typeof UsageSchema>;

export const RequestSchema = z.object({
  model: z.literal('openrouter/free'), 
  messages: z.array(MessageSchema),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().int().positive()
});

export type Request = z.infer<typeof RequestSchema>;

export const ResponseSchema = z.object({
  id: z.string(),
  object: z.literal("chat.completion"), 
  created: z.number().int().positive(),
  model: z.string(),
  choices: z.array(ChoiceSchema).nonempty(),
  usage: UsageSchema.optional()
});

export type Response = z.infer<typeof ResponseSchema>;

export const ChatSchema = z.array(z.tuple([RequestSchema, ResponseSchema]));

export type Chat = z.infer<typeof ChatSchema>;

export const ChatMapSchema = z.record(z.string().startsWith('gen-'), ChatSchema);

export type ChatMap = {
  [id: string]: Chat;
};