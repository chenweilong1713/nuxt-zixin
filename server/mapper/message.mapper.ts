// server/mapper/message.mapper.ts
import type { D1Database } from '@cloudflare/workers-types';
import type { Message, CreateMessageData, UpdateMessageData } from '../types/db';

/**
 * 留言数据库操作类（Mapper）
 */
export class MessageMapper {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * 获取所有留言
   */
  async getAllMessages(): Promise<Message[]> {
    const stmt = this.db.prepare('SELECT * FROM messages ORDER BY created_at DESC');
    const result = await stmt.all<Message>();
    return result.results || [];
  }

  async getMessageByName(name: string | undefined): Promise<Message[]> {
    const stmt = this.db.prepare('SELECT * FROM messages WHERE name = ? ORDER BY created_at DESC');
    const result = await stmt.bind(name).all<Message>();
    return result.results || [];
  }

  /**
   * 根据ID获取单个留言
   */
  async getMessageById(id: number): Promise<Message | null> {
    const stmt = this.db.prepare('SELECT * FROM messages WHERE id = ?');
    const result = await stmt.bind(id).first<Message>();
    return result || null;
  }

  /**
   * 创建新留言
   */
  async createMessage(data: CreateMessageData): Promise<Message> {
    const { name, email, content } = data;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    
    const stmt = this.db.prepare(
      'INSERT INTO messages (name, email, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?) RETURNING *'
    );
    
    const result = await stmt.bind(name, email, content, createdAt, updatedAt).first<Message>();
    if (!result) {
      throw new Error('创建留言失败');
    }
    return result;
  }

  /**
   * 更新留言
   */
  async updateMessage(id: number, data: UpdateMessageData): Promise<Message | null> {
    // 先检查留言是否存在
    const existingMessage = await this.getMessageById(id);
    if (!existingMessage) {
      return null;
    }

    // 构建更新语句
    const updates: string[] = [];
    const values: (string | number)[] = [];
    
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    
    if (data.content !== undefined) {
      updates.push('content = ?');
      values.push(data.content);
    }
    
    if (updates.length === 0) {
      // 如果没有更新字段，直接返回原数据
      return existingMessage;
    }
    
    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id); // 用于WHERE子句
    
    const stmt = this.db.prepare(`UPDATE messages SET ${updates.join(', ')} WHERE id = ? RETURNING *`);
    const result = await stmt.bind(...values).first<Message>();
    
    return result || null;
  }

  /**
   * 删除留言
   */
  async deleteMessage(id: number): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM messages WHERE id = ?');
    const result = await stmt.bind(id).run();
    return result.success;
  }
}