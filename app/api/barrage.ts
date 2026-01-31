import Http from '@/utils/request'

// 留言API接口
class BarrageAPI {
  // 根据名称获取留言列表
  static getMessagesByName(name: string) {
    return Http.get('/messages/getByName', {
        name: name
    })
  }

  static createMessage(message: any)  {
      return Http.post('/messages', message)
  }
}

export default BarrageAPI