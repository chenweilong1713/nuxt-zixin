// server/api/messages/getByName.get.ts
import { defineEventHandler, getQuery } from 'h3';
import { createMessageService } from '../../service/message.service';
import { Result } from '../../utils/result';
import { ErrorCode } from '../../constants/error-code';

export default defineEventHandler(async (event) => {
  // 获取查询参数（Nuxt 内置方法）
  const query = getQuery(event);
  const name = query.name as string | undefined;

  // 参数校验
  if (!name) {
    return Result.error(event, ErrorCode.PARAM_INVALID, '请根据名称查询', 400);
  }

  // 创建服务实例并查询
  const service = createMessageService(event);
  const messages = await service.getMessageByName(name);
  const contentList = messages.map((message) => message.content);

  // 成功响应
  return Result.ok(event, contentList, '获取成功');
});