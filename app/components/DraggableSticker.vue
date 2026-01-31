<template>
  <div
      v-if="sticker.visible"
      class="sticker"
      :style="{
      left: sticker.position.x + 'px',
      top: sticker.position.y + 'px',
      zIndex: sticker.zIndex
    }"
      @mousedown="onMouseDown"
  >
    <div class="sticker-title">{{ sticker.title }}</div>

    <div class="sticker-content">
      <a
          v-for="item in sticker.items"
          :key="item.name"
          class="icon-item"
          :href="item.url"
          target="_blank"
      >
        <img :src="item.icon"  alt=""/>
      </a>
    </div>

<!--    <div class="sticker-corner" />-->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStickerManagerStore } from '@/stores/stickerManagerStore'

const props = defineProps({
  sticker: {
    type: Object,
    required: true
  }
})

const store = useStickerManagerStore()

const dragging = ref(false)
const offsetX = ref(0)
const offsetY = ref(0)

const onMouseDown = (e) => {
  dragging.value = true
  store.bringToFront(props.sticker.id)

  offsetX.value = e.clientX - props.sticker.position.x
  offsetY.value = e.clientY - props.sticker.position.y

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e) => {
  if (!dragging.value) return
  store.updatePosition(
      props.sticker.id,
      e.clientX - offsetX.value,
      e.clientY - offsetY.value
  )
}

const onMouseUp = () => {
  dragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}
</script>

<style scoped>
.sticker {
  position: absolute;
  width: 260px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 6px;
  cursor: grab;
  user-select: none;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
}

.sticker:active {
  cursor: grabbing;
}

.sticker-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.sticker-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.icon-item {
  width: 44px;
  height: 44px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-item img {
  width: 22px;
  height: 22px;
}

/* 卷角 */
.sticker-corner {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, transparent 80%, #ded9cb 50%);
}
</style>
