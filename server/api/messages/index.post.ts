// server/api/messages/index.post.ts
import { defineEventHandler } from 'h3';
import { createMessageService } from '../../service/message.service';
import { Result } from '../../utils/result';
import { ErrorCode } from '../../constants/error-code';

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体（Nuxt 内置方法）
    const body = await readBody(event);
    const { name, email, content } = body;

    // 创建服务实例（适配 Nuxt Event）
    const service = createMessageService(event);
    const message = await service.createMessage({ name, email, content });

    // 成功响应
    return Result.ok(event, null, '留言创建成功');
  } catch (error) {
    console.error('创建留言失败:', error);
    const errorMessage = error instanceof Error ? error.message : '创建留言失败';
    const isParamError = errorMessage.includes('不能为空') || errorMessage.includes('格式不正确');
    
    // 失败响应
    return Result.error(
      event,
      isParamError ? ErrorCode.PARAM_INVALID : ErrorCode.OPERATION_FAILED,
      errorMessage,
      isParamError ? 400 : 500
    );
  }
});