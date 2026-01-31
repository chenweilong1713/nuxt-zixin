import Http from '@/utils/request'

// GitHub API 接口
class GithubAPI {
  // 获取指定用户的贡献统计数据
  static getContributions(username: string, year?: string) {
    if(year == '最近'){
      return Http.get(`/github/contributions/${username}`, {
        year: null
      })
    }
    return Http.get(`/github/contributions/${username}`, {
      year
    })
  }

  // 获取指定用户的公开项目列表
  static getRepositories(username: string) {
    return Http.get(`/github/repositories/${username}`)
  }
}

export default GithubAPI