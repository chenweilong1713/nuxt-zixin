// server/services/message.service.ts
import type { H3Event } from 'h3';
import { MessageMapper } from '../mapper/message.mapper';
import type { Message, CreateMessageData, UpdateMessageData } from '../types/db';

/**
 * 留言服务类
 */
export class MessageService {
  private mapper: MessageMapper;

  constructor(mapper: MessageMapper) {
    this.mapper = mapper;
  }

  /**
   * 获取所有留言
   */
  async getAllMessages(): Promise<Message[]> {
    return await this.mapper.getAllMessages();
  }

  async getMessageByName(name: string | undefined): Promise<Message[]> {
    return await this.mapper.getMessageByName(name);
  }

  /**
   * 根据ID获取单个留言
   */
  async getMessageById(id: number): Promise<Message | null> {
    if (id <= 0) {
      throw new Error('无效的留言ID');
    }
    return await this.mapper.getMessageById(id);
  }

  /**
   * 创建新留言
   */
  async createMessage(data: CreateMessageData): Promise<Message> {
    // 验证数据
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('姓名不能为空');
    }
    
    if (!data.content || data.content.trim().length === 0) {
      throw new Error('留言内容不能为空');
    }
    
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('邮箱格式不正确');
    }
    
    // 创建留言
    return await this.mapper.createMessage({
      name: data.name.trim(),
      email: data.email?.trim(),
      content: data.content.trim()
    });
  }

  /**
   * 更新留言
   */
  async updateMessage(id: number, data: UpdateMessageData): Promise<Message | null> {
    if (id <= 0) {
      throw new Error('无效的留言ID');
    }
    
    // 验证数据
    if (data.email && data.email.trim() && !this.isValidEmail(data.email)) {
      throw new Error('邮箱格式不正确');
    }
    
    // 检查留言是否存在
    const existingMessage = await this.mapper.getMessageById(id);
    if (!existingMessage) {
      throw new Error('留言不存在');
    }
    
    // 更新留言
    return await this.mapper.updateMessage(id, {
      name: data.name?.trim(),
      email: data.email?.trim(),
      content: data.content?.trim()
    });
  }

  /**
   * 删除留言
   */
  async deleteMessage(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error('无效的留言ID');
    }
    
    // 检查留言是否存在
    const existingMessage = await this.mapper.getMessageById(id);
    if (!existingMessage) {
      throw new Error('留言不存在');
    }
    
    return await this.mapper.deleteMessage(id);
  }

  /**
   * 验证邮箱格式
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

/**
 * 从 Nuxt H3 Event 创建 MessageService 实例
 */
export const createMessageService = (event: H3Event): MessageService => {
  // 从 Nuxt 上下文获取 D1 绑定（和你示例一致）
  const { COMMON_HTTP_DB } = event.context.cloudflare.env;
  const mapper = new MessageMapper(COMMON_HTTP_DB);
  return new MessageService(mapper);
};