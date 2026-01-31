// server/types/db.ts
export interface Message {
  id: number;
  name: string;
  email?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageData {
  name: string;
  email?: string;
  content: string;
}

export interface UpdateMessageData {
  name?: string;
  email?: string;
  content?: string;
}

// // 补充 Cloudflare 类型（Nuxt 中需显式声明）
// declare global {
//   type D1Database = import('@cloudflare/workers-types').D1Database;
//   type KVNamespace = import('@cloudflare/workers-types').KVNamespace;
// }