import { Result } from '../../../utils/result'
import * as githubService from '../../../service/github.service'

export default defineEventHandler(async (event) => {
  try {
    // 1. 获取路径参数（对应 Hono 的 c.req.param('username')）
    const username = getRouterParam(event, 'username')
    // 2. 获取查询参数 year（对应 Hono 的 c.req.query('year')）
    const yearQuery = getQuery(event).year
    const year = yearQuery ? Number(yearQuery) : null

    // 3. 校验参数
    if (!username) {
      return Result.error(event, '缺少用户名参数', 'PARAM_ERROR')
    }
    if (yearQuery && isNaN(Number(yearQuery))) {
      return Result.error(event, 'year参数必须为有效数字', 'PARAM_ERROR')
    }

    // 4. 获取 Cloudflare 环境变量（替代 Hono 的 c.env）
    const { GITHUB_KV, GITHUB_TOKEN } = event.context.cloudflare.env
    if (!GITHUB_TOKEN) {
      return Result.error(event, 'GITHUB_TOKEN 未配置', 'CONFIG_ERROR')
    }

    // 5. 调用服务层（对应原 Hono 的 githubService.fetchGithubContributions(c, username, year)）
    const data = await githubService.fetchGithubContributions(
      { GITHUB_KV, GITHUB_TOKEN },
      username,
      year
    )

    // 6. 成功响应（模仿 Hono 的 Result.ok(c, data)）
    return Result.ok(event, data, '获取贡献数据成功')
  } catch (error: any) {
    console.error('获取GitHub贡献数据失败:', error)
    return Result.error(event, error.message || '获取贡献数据失败', 'SERVER_ERROR')
  }
})