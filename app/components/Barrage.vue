<template>
  <div class="danmaku-container">
    <div
        v-for="item in danmakus"
        :key="item.id"
        class="danmaku-item"
        :style="{
        transform: `translate(${item.x}px, ${item.y}px)`
      }"
        @mouseenter="item.paused = true"
        @mouseleave="item.paused = false"
        ref="danmakuRefs"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BarrageAPI from '@/api/barrage'
import { message_key } from '@/config/zixin.config'



/* ========= Props ========= */
const props = withDefaults(defineProps<{
  loop?: boolean
}>(), {
  loop: true
})

/* ========= Types ========= */
interface DanmakuItem {
  id: number
  text: string
  x: number
  y: number
  speed: number
  width?: number
  paused: boolean
}

/* ========= Config ========= */
const ROW_HEIGHT = 24
const MAX_ROWS = 2

/* ========= State ========= */
const danmakus = ref<DanmakuItem[]>([])
const danmakuRefs = ref<HTMLElement[]>([])

let animationId = 0
let idCounter = 0

/* ========= Utils ========= */
const randomRowY = () =>
    Math.floor(Math.random() * MAX_ROWS) * ROW_HEIGHT

const randomSpeed = () => 1 + Math.random() * 1.5

/* ========= Init ========= */
const initDanmakus = async () => {
  try {
    // 从API获取留言数据，使用环境变量中的名称
    const siteName = message_key
    const response: any = await BarrageAPI.getMessagesByName(siteName)
    
    if (response.success && response.data) {
      // 使用API返回的留言内容，现在data是字符串数组
      const messageTexts = response.data
      
      danmakus.value = messageTexts.map((text: string) => ({
        id: idCounter++,
        text,
        x: window.innerWidth + Math.random() * 200,
        y: randomRowY(),
        speed: randomSpeed(),
        paused: false
      }))
    } else {
      // 如果API调用失败，使用默认文本
      const defaultTexts = [
        'Vue3 弹幕组件',
        '支持循环滚动',
        '鼠标悬浮暂停',
        'loop 开关可配置',
        'setup + TypeScript',
        '适合个人主页',
        '80%AI开发',
        '开源吗作者?'
      ]
      
      danmakus.value = defaultTexts.map(text => ({
        id: idCounter++,
        text,
        x: window.innerWidth + Math.random() * 200,
        y: randomRowY(),
        speed: randomSpeed(),
        paused: false
      }))
    }
  } catch (error) {
    console.error('获取留言数据失败:', error)
    // API调用失败时使用默认文本
    const defaultTexts = [
      'Vue3 弹幕组件',
      '支持循环滚动',
      '鼠标悬浮暂停',
      'loop 开关可配置',
      'setup + TypeScript',
      '适合个人主页',
      '80%AI开发',
      '开源吗作者?'
    ]
    
    danmakus.value = defaultTexts.map(text => ({
      id: idCounter++,
      text,
      x: window.innerWidth + Math.random() * 200,
      y: randomRowY(),
      speed: randomSpeed(),
      paused: false
    }))
  }

  await nextTick()

  danmakuRefs.value.forEach((el, index) => {
    if (danmakus.value[index]) {
      danmakus.value[index].width = el.offsetWidth
    }
  })
}

/* ========= Animation ========= */
const animate = () => {
  danmakus.value.forEach((item) => {
    if (!item.paused) {
      item.x -= item.speed
    }

    const width = item.width || 0

    // 出屏处理
    if (item.x + width < 0) {
      if (props.loop) {
        item.x = window.innerWidth + Math.random() * 100
        item.y = randomRowY()
        item.speed = randomSpeed()
      }
    }
  })

  // 非循环模式：移除
  if (!props.loop) {
    danmakus.value = danmakus.value.filter(
        item => item.x + (item.width || 0) > 0
    )
  }

  animationId = requestAnimationFrame(animate)
}

/* ========= Lifecycle ========= */
onMounted(async () => {
  await initDanmakus()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.danmaku-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  pointer-events: none;
}

.danmaku-item {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  padding: 6px 14px;
  font-size: 14px;
  color: #fff;
/*
//background: rgba(0, 0, 0, 0.45);
//border-radius: 16px;
 */
pointer-events: auto;
cursor: pointer;
will-change: transform;
transition: background 0.2s;
}
/*
.danmaku-item:hover {
background: rgba(0, 0, 0, 0.65);
}
*/
</style>
