export default defineEventHandler(async (event) => {
  // 从 event.context.cloudflare.env 获取 Cloudflare 绑定
  const { GITHUB_KV, COMMON_HTTP_DB } = event.context.cloudflare.env;

  // 1. KV 示例: 写入并读取
  const kvKey = 'timestamp';
  await GITHUB_KV.put(kvKey, new Date().toISOString());
  const kvValue = await GITHUB_KV.get(kvKey);

  // 2. D1 示例: 执行 SQL 查询
  // 注意: 这是一个简单的 SELECT 1 测试，你可以替换为你真实的表查询
  // 例如: await COMMON_HTTP_DB.prepare('SELECT * FROM users LIMIT 5').all();
  let d1Result;
  try {
    d1Result = await COMMON_HTTP_DB.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  } catch (error: any) {
    d1Result = { error: error.message };
  }

  return {
    message: 'Cloudflare Bindings Demo',
    kv: {
      binding: 'GITHUB_KV',
      key: kvKey,
      value: kvValue
    },
    d1: {
      binding: 'COMMON_HTTP_DB',
      result: d1Result
    }
  };
});