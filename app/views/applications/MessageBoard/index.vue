<template>
  <div class="message-board">
    <h2>留言板</h2>

    <form @submit.prevent="handleSubmit">
      <!-- 邮箱 -->
      <div class="form-item">
        <label>邮箱</label>
        <input
            v-model="form.email"
            type="email"
            placeholder="请输入你的邮箱"
            required
        />
      </div>

      <!-- 留言内容 -->
      <div class="form-item">
        <label>留言内容</label>
        <textarea
            v-model="form.content"
            rows="5"
            placeholder="请输入你的留言..."
            required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '提交中...' : '提交留言' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import BarrageAPI from '@/api/barrage'
import { message_key } from '@/config/zixin.config'



const loading = ref(false)

const form = reactive({
  name: '',
  email: '',
  content: ''
})

onMounted(() => {
  // 自动获取当前页面网址
  form.name = message_key
})

const handleSubmit = async () => {
  if (!form.email || !form.content) {
    alert('请填写完整信息')
    return
  }

  loading.value = true

  try {
    // 🔗 这里替换成你的真实接口
    // await axios.post('/api/message', form)
    await BarrageAPI.createMessage(form)
    console.log('提交数据：', { ...form })

    alert('留言提交成功 🎉')

    // 清空留言内容
    form.content = ''
  } catch (error) {
    alert('提交失败，请稍后再试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.message-board {
  max-width: 480px;
  margin: 40px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

input,
textarea {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #409eff;
}

button {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: #409eff;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #337ecc;
}

button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
</style>
