<template>
  <div
    class="flex-icon-container"
    :style="containerStyle"
    @click="$emit('click')"
  >
    <div class="icon-wrapper">
      <!-- 支持多种图标形式 -->
      <slot name="icon">
        <component
          v-if="iconComponent"
          :is="iconComponent"
          class="icon"
          :style="{ color: iconColor, fontSize: iconSize }"
        />
        <img
          v-else-if="iconSrc || iconImage"
          :src="iconSrc || iconImage"
          :alt="text || name"
          class="icon"
          :style="{
            backgroundColor: defaultIconBgColor,
            color: defaultIconColor,
            fontSize: iconSize
          }"
        />
        <div
          v-else
          class="default-icon"
          :style="{
            backgroundColor: defaultIconBgColor,
            color: defaultIconColor,
            fontSize: iconSize
          }"
        >
          {{ defaultText || defaultIconText }}
        </div>
      </slot>
    </div>

    <div
      v-if="showText"
      class="icon-text"
      :style="{
        color: textColor,
        fontSize: textSize,
        marginTop: textGap
      }"
    >
      {{ text || name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  // 图标属性
  iconComponent: {
    type: [Object, String],
    default: null
  },
  iconSrc: {
    type: String,
    default: ''
  },
  iconImage: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: '#333'
  },
  iconSize: {
    type: String,
    default: '24px'
  },

  // 默认图标属性
  defaultText: {
    type: String,
    default: 'A'
  },
  defaultIconText: {
    type: String,
    default: 'App'
  },
  defaultIconBgColor: {
    type: String,
    default: '#f0f0f0'
  },
  defaultIconColor: {
    type: String,
    default: '#666'
  },

  // 文字属性
  text: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  textColor: {
    type: String,
    default: '#333'
  },
  textSize: {
    type: String,
    default: '12px'
  },

  // 布局属性
  size: {
    type: [Number, String],
    default: 50
  },
  margin: {
    type: String,
    default: '0 8px'
  },
  textGap: {
    type: String,
    default: '4px'
  },

  // 功能开关
  showText: {
    type: Boolean,
    default: true
  },
  hoverEffect: {
    type: Boolean,
    default: true
  },
  hoverDirection: {
    type: String as () => 'up' | 'right',
    default: 'up',
    validator: (v: string) => ['up', 'right'].includes(v)
  }
})

defineEmits(['click'])

/**
 * ✅ SSR / CSR 都能算出「完全一致」的 hover transform
 */
const hoverTransform = computed(() => {
  if (!props.hoverEffect) return 'none'
  return props.hoverDirection === 'right'
    ? 'translateX(4px)'
    : 'translateY(-4px)'
})

/**
 * ✅ 所有动态 style 统一在这里
 * CSS 里只消费结果，不写任何逻辑
 */
const containerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${parseInt(String(props.size)) + (props.showText ? 15 : 0)}px`,
  margin: props.margin,
  '--hover-transform': hoverTransform.value
}))
</script>

<style scoped>
.flex-icon-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.flex-icon-container:hover {
  transform: var(--hover-transform);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: v-bind(defaultIconBgColor);
  border-radius: 20%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  border-radius: 20%;
}

.default-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20%;
  font-weight: 500;
  font-family: "黑体", Arial, "微软雅黑", "Microsoft Yahei", serif;
}

.icon-text {
  text-align: center;
  word-break: break-word;
  width: 100%;
  line-height: 1.5;
  font-size: 12px;
}
</style>
