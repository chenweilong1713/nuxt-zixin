import { Result } from '../../../utils/result'
import * as githubService from '../../../service/github.service'

export default defineEventHandler(async (event) => {
  try {
    // 1. 获取路径参数 username（对应 Hono 的 c.req.param('username')）
    const username = getRouterParam(event, 'username')

    // 2. 校验参数
    if (!username) {
      return Result.error(event, '缺少用户名参数', 'PARAM_ERROR')
    }

    // 3. 获取 Cloudflare 环境变量
    const { GITHUB_KV, GITHUB_TOKEN } = event.context.cloudflare.env
    if (!GITHUB_TOKEN) {
      return Result.error(event, 'GITHUB_TOKEN 未配置', 'CONFIG_ERROR')
    }

    // 4. 调用服务层（对应原 Hono 的 githubService.fetchGithubRepositories(c, username)）
    const data = await githubService.fetchGithubRepositories(
      { GITHUB_KV, GITHUB_TOKEN },
      username
    )

    // 5. 成功响应
    return Result.ok(event, data, '获取仓库数据成功')
  } catch (error: any) {
    console.error('获取GitHub仓库数据失败:', error)
    return Result.error(event, error.message || '获取仓库数据失败', 'SERVER_ERROR')
  }
})