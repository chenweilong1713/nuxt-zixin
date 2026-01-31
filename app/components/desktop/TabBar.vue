<template>
  <div id="tabBar">

    <div v-for="item in tabBarList" :key="item">
      <MenuIcon
          :name=item.name
          :size=item.size
          :show-text="false"
          :icon-image=item.icon
          @click="openWindow(item.component, item.componentProps, item.title, item.icon)"
          hover-direction="right"
      />
    </div>

    <!--  在TabBar中显示所有被隐藏的窗体  -->
    <template v-for="window in windows">
<!--  TODO: 这里需要判断打开的窗口是否从TaBar中打开的，如果是则在缩小的时候排除一下，不应该重复显示，还是给菜单添加提示，表示这已经打开了     -->
        <MenuIcon v-if="!window.visible"
                    :name="window.title"
                    default-icon-text="A"
                     :show-text="false"
                    :icon-image="window.icon"
                    @click="restoreWindow(window.id)"
                    size="40"
                    hover-direction="right"
        />

    </template>
  </div>
</template>

<script setup>
import MenuIcon from "@/components/desktop/MenuIcon.vue";
import { useWindowManagerStore } from '@/stores/windowManagerStore';
import MessageBoard from "@/views/applications/MessageBoard/index.vue";
import FriendLinks from "@/views/applications/FriendLinks/index.vue"

import { ref, onMounted, onUnmounted } from 'vue'
import { markRaw } from 'vue'
const windowManager = useWindowManagerStore();
const { windows,openWindow,hideWindow,restoreWindow,bringToFront} = windowManager;

const windowWidth = ref(0)

const handleResize = () => {
  if (import.meta.client) {
    windowWidth.value = window.innerWidth
    // Update position for MessageBoard
    if (tabBarList.value && tabBarList.value[0]) {
       tabBarList.value[0].componentProps.x = (windowWidth.value/2)-300
    }
  }
}

const tabBarList = ref([
  {
    name: '留言',
    icon: '/assets/留言.png',
    size: 40,
    showText: false,
    hoverDirection: 'right',
    title: '给我留言',
    component: markRaw(MessageBoard),
    componentProps: {width: 600, height: 500, x: 0, y:120} // Initial x will be set on mount
  },
  {
    name: '友链',
    icon: '/assets/连接.png',
    size: 40,
    showText: false,
    hoverDirection: 'right',
    title: '友链(mock数据)',
    component: markRaw(FriendLinks),
    componentProps: {width: 1200, height: 700}
  }
])

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
#tabBar {
  position: fixed;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  width: 65px;
  height: auto;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  align-items: center;
  justify-content: center;
  gap: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影 */
}
#tabBar :deep(.flex-icon-container) {
  margin: 0 !important; /* 覆盖MenuIcon的默认margin */
}
</style>