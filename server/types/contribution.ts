export interface ContributionDay {
    date: string
    count: number
}

export interface ContributionData {
    username: string
    year: number | null
    days: ContributionDay[]
    updatedAt: number
}
