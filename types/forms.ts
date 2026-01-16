export interface TypedFormData<T extends Record<string, unknown>> extends FormData {
   get<K extends keyof T>(key: K): string | File | null
   getAll<K extends keyof T>(key: K): Array<string | File>
   has<K extends keyof T>(key: K): boolean
   delete<K extends keyof T>(key: K): void
}
