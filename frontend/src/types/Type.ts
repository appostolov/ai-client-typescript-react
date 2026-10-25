export interface HashHelper {
  routes: string[]
  route( def?: string ): string | undefined
  id(): string | undefined
}

export interface DataHelper {
  deleteAll(): void
}