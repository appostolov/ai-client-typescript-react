import type { Answer } from "../types/Chat"

export interface HashHelper {
  routes: string[]
  route( def?: string ): string | undefined
  id(): string | undefined
}