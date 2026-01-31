import type { ContributionData } from '../types/contribution'
import type { GithubRepositoriesResponse } from '../types/github'

// 缓存时间：3小时
const CACHE_TTL = 60 * 60 * 3

// 获取日期范围（复用原有逻辑）
const getDateRange = (year: number | null) => {
  if (!year) {
    const to = new Date()
    const from = new Date(to)
    from.setFullYear(to.getFullYear() - 1)
    return {
      from: from.toISOString(),
      to: to.toISOString(),
    }
  }
  return {
    from: `${year}-01-01T00:00:00Z`,
    to: `${year}-12-31T23:59:59Z`,
  }
}

// GraphQL响应类型
interface GithubGraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: {
            contributionDays: {
              date: string
              contributionCount: number
            }[]
          }[]
        }
      }
    }
  }
  errors?: { message: string }[]
}

// 仓库原始数据类型
interface GithubRepository {
  id: string
  name: string
  full_name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  html_url: string
  homepage: string | null
  private: boolean
  archived: boolean
  created_at: string
  updated_at: string
}

/**
 * 获取GitHub贡献数据（适配 Nuxt 环境，替代原 Hono 的 c 参数）
 * @param env Cloudflare 环境变量（GITHUB_KV + GITHUB_TOKEN）
 * @param username GitHub用户名
 * @param year 年份（null 表示最近一年）
 */
export async function fetchGithubContributions(
  env: { GITHUB_KV: any; GITHUB_TOKEN: string },
  username: string,
  year: number | null
): Promise<ContributionData> {
  const { GITHUB_KV, GITHUB_TOKEN } = env

  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN 未配置')
  }

  // 1. 检查缓存
  const cacheKey = `github:contributions:${username}:${year}`
  const cached = await GITHUB_KV.get(cacheKey, 'json')
  if (cached) {
    return cached as ContributionData
  }

  // 2. 组装GraphQL请求
  const { from, to } = getDateRange(year)
  const query = `
    query ($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'nuxt-cloudflare-worker'
    },
    body: JSON.stringify({
      query,
      variables: { login: username, from, to }
    })
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('GitHub GraphQL Error:', res.status, text)
    throw new Error(`GitHub API 请求失败: ${res.status}`)
  }

  const json = (await res.json()) as GithubGraphQLResponse
  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  // 3. 整理数据
  const days = json.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap(w => w.contributionDays.map(d => ({
      date: d.date,
      count: d.contributionCount
    })))

  const data: ContributionData = {
    username,
    year,
    days,
    updatedAt: Date.now()
  }

  // 4. 写入缓存
  await GITHUB_KV.put(cacheKey, JSON.stringify(data), {
    expirationTtl: CACHE_TTL
  })

  return data
}

/**
 * 获取GitHub仓库数据（适配 Nuxt 环境）
 * @param env Cloudflare 环境变量
 * @param username GitHub用户名
 */
export async function fetchGithubRepositories(
  env: { GITHUB_KV: any; GITHUB_TOKEN: string },
  username: string
): Promise<GithubRepositoriesResponse> {
  const { GITHUB_KV, GITHUB_TOKEN } = env

  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN 未配置')
  }

  // 1. 检查缓存
  const cacheKey = `github:repositories:${username}`
  const cached = await GITHUB_KV.get(cacheKey, 'json')
  if (cached) {
    return cached as GithubRepositoriesResponse
  }

  // 2. 请求GitHub REST API
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?type=public&sort=updated&direction=desc`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'nuxt-cloudflare-worker'
      }
    }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error('GitHub Repos API Error:', res.status, text)
    throw new Error(`GitHub API 请求失败: ${res.status}`)
  }

  const repos = (await res.json()) as GithubRepository[]

  // 3. 整理数据
  const repositories = repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    language: repo.language || '',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    url: repo.html_url,
    homepage: repo.homepage,
    private: repo.private,
    archived: repo.archived,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at
  }))

  const data: GithubRepositoriesResponse = {
    username,
    repositories,
    total: repositories.length,
    updatedAt: Date.now()
  }

  // 4. 写入缓存
  await GITHUB_KV.put(cacheKey, JSON.stringify(data), {
    expirationTtl: CACHE_TTL
  })

  return data
}