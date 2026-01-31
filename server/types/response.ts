// src/types/response.ts
export interface ApiResponse<T = unknown> {
    success: boolean
    code: string
    message: string
    data?: T
    requestId?: string
}
