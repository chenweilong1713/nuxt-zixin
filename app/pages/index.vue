<template>
  <div class="desktop" :style="{ backgroundImage: currentGradient }">
    <img class="desktop-bg" src="@/assets/img/8_body.png" alt="">
     <!-- <img class="desktop-bg" src="/assets/8_body.png" alt=""> -->
    <!-- 弹幕组件 - 浮动在内容上方 -->
    <div class="barrage-overlay">
      <Barrage />
    </div>

    <!-- 个人信息区域 -->
    <div class="my-info">
      <!--   个人信息   -->
      <UserProfileCard />
      <!--   github统计   -->
      <GithubContributionGraph />
      <!--   项目信息   -->
      <GithubRepositories />
      <!-- <div class="split_title">小游戏</div>
      <div class="desktop-flex">

      </div> -->
    </div>

    <ClientOnly>
      <DraggableSticker
          v-for="sticker in store.stickers"
          :key="sticker.id"
          :sticker="sticker"
      />
    </ClientOnly>

  </div>

  <!-- 动态渲染窗口 -->
  <ClientOnly>
    <template v-for="window in windows" :key="window.id">
      <keep-alive>
        <DraggableModal
            v-show="window.visible"
            v-model:visible="window.visible"
            :title="window.title"
            :window-id="window.id"
            :z-index="window.zIndex"
            :component="window.component"
            :initial-position="window.position"
            :initial-size="window.size"
            :component-props="window.componentProps"
            @hide-window="hideWindow(window.id)"
            @close="closeWindow(window.id)"
            @bring-to-front="bringToFront(window.id)"
        />
      </keep-alive>
    </template>
  </ClientOnly>

  <TabBar />
</template>

<script setup>
import {useWindowManagerStore} from '@/stores/windowManagerStore';
import DraggableModal from '@/components/desktop/DraggableModal.vue';
import TabBar from "@/components/desktop/TabBar.vue";
import GithubContributionGraph from "@/components/GithubContributionGraph.vue";
import GithubRepositories from "@/components/GithubRepositories.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";
import { useStickerManagerStore } from '@/stores/stickerManagerStore'
import DraggableSticker from '@/components/DraggableSticker.vue'
import {onMounted} from "vue";
import Barrage from "@/components/Barrage.vue";
import { stickerGroups } from '@/config/zixin.config'

const store = useStickerManagerStore()

const gradients = [
  'linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)',
  'linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%)',
  'linear-gradient(-20deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
  'linear-gradient(to top, #dad4ec 0%, #dad4ec 1%, #f3e7e9 100%)',
  'linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%)',
  'linear-gradient(to top, #d5dee7 0%, #ffafbd 0%, #c9ffbf 100%)',
  'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)'
];

const currentGradient = gradients[new Date().getDay()];

const windowManager = useWindowManagerStore();
const {windows, openWindow, hideWindow, closeWindow, bringToFront} = windowManager;


onMounted(() => {
  console.log(store.stickers.length)
  if (store.stickers.length === 0) {
    stickerGroups.forEach(group => {
      store.createSticker(group.title, group.items, group.position)
    })
  }
})

</script>

<style scoped>
/* 原有样式保持不变*/
.desktop {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 16px;
  /* background-image: linear-gradient(-225deg, #7742B2 0%, #F180FF 52%, #FD8BD9 100%); */
  position: relative; /* 为浮动弹幕提供定位上下文 */
  /* z-index: -100; */
}

.barrage-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* 使用视口高度确保弹幕容器有足够空间 */
  pointer-events: none; /* 确保弹幕不阻挡下方元素的交互 */
  z-index: 999; /* 确保弹幕在其他内容上方 */
}
.desktop-bg {
  position: absolute;
  right: 0;
  bottom: 0;
  width: auto;          /* 可调：30vw / 400px 等 */
  height: 100vh;
  pointer-events: none;/* 不挡鼠标 */
  z-index: 1;           /* 在背景层 */
  opacity: 0.8;         /* 可选：更柔和 */
}

.desktop-flex {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: flex-start;
  margin-left: -5px;
}
.my-info{
  margin: 12vh auto 0;
  max-width: 900px;
}
.split_title{
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
}

.my-info > :not(:first-child) {
  margin-top: 20px;
}



</style>
