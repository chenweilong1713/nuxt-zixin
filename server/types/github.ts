export interface GithubRepository {
  id: string
  name: string
  fullName: string
  description: string
  language: string
  stars: number
  forks: number
  url: string
  homepage: string | null
  private: boolean
  archived: boolean
  createdAt: string
  updatedAt: string
}

export interface GithubRepositoriesResponse {
  username: string
  repositories: GithubRepository[]
  total: number
  updatedAt: number
}