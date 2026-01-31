export interface UserProfile {
    avatar: string
    nickname: string
    job: string
    workingExperiences: string
    city: string
    email: string
    signature: string
    skills: string[]
    github: string
}
// 个人信息配置
export const profile: UserProfile = {
    avatar: 'https://avatars.githubusercontent.com/u/48249891?v=4',
    nickname: '实习两年半',
    job: 'JAVA / 后端开发工程师',
    workingExperiences: '4年',
    city: '中国 · 宿迁',
    email: 'chen@unuuc.cn',
    signature: 'Life is short，先跑起来再说。',
    skills: ['JAVA', 'SpringBoot', 'MYSQL'],
    github: 'https://github.com/chenweilong1713'
}

// 留言板key，用于存储留言数据,查询保存都需要，默认不用修改
export const message_key = 'zixin-message'


export interface StickerItem {
    name: string
    icon: string
    url: string
}

export interface StickerGroup {
    title: string
    items: StickerItem[]
    position?: { x: number; y: number }
}

// 贴纸版本号，修改后会触发客户端缓存刷新,建议在修改贴纸内容后修改版本号
export const sticker_version = '1.0.0'

export const stickerGroups: StickerGroup[] = [
    {
        title: '社交',
        items: [
            {
                name: 'GitHub',
                icon: '/assets/github.svg',
                url: 'https://github.com/chenweilong1713'
            },
            {
                name: 'bilibili',
                icon: '/assets/bilibili.svg',
                url: 'https://space.bilibili.com/382748425'
            },
            {
                name: 'QQ',
                icon: '/assets/qq.svg',
                url: 'tencent://message/?uin=2502906272&Site=&Menu=yes'
            },
            {
                name: '文档',
                icon: '/assets/笔记.svg',
                url: 'https://doc.unuuc.cn'
            }
        ],
        // 位置参数，可选，默认{ x: 120, y: 80 }
        position: { x: 120, y: 80 }
    }
]

export interface FriendLink {
    id: number
    name: string
    description: string
    avatar: string
    url: string
}

export const friendLinks: FriendLink[] = [
    {
        id: 1,
        name: '龙的技术博客',
        description: '记录前端、后端、Docker 与折腾日常',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        url: 'https://example.com'
    },
    {
        id: 2,
        name: 'Vue 官方文档',
        description: '渐进式 JavaScript 框架',
        avatar: 'https://cn.vuejs.org/logo.svg',
        url: 'https://cn.vuejs.org'
    },
    {
        id: 3,
        name: 'MDN Web Docs',
        description: '最权威的 Web 技术文档',
        avatar: 'https://developer.mozilla.org/static/img/favicon144.png',
        url: 'https://developer.mozilla.org'
    }
]
