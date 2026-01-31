import type { H3Event } from 'h3'
import type { ApiResponse } from '../types/response'

// 生成唯一请求ID
const generateRequestId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * 统一响应工具（模仿 Hono 的 Result 风格）
 */
export const Result = {
  /**
   * 成功响应
   * @param event Nuxt 事件对象
   * @param data 响应数据
   * @param message 提示信息
   */
  ok: <T>(event: H3Event, data?: T, message = '操作成功'): ApiResponse<T> => {
    return {
      success: true,
      code: 'SUCCESS',
      message,
      data,
      requestId: generateRequestId()
    }
  },

  /**
   * 失败响应
   * @param event Nuxt 事件对象
   * @param message 错误提示
   * @param code 错误码
   * @param data 附加数据
   */
  error: <T>(event: H3Event, message: string, code = 'ERROR', data?: T): ApiResponse<T> => {
    return {
      success: false,
      code,
      message,
      data,
      requestId: generateRequestId()
    }
  }
}