import {defineStore} from 'pinia';
import {ref, markRaw} from 'vue';
import type { Component } from 'vue';

interface WindowState {
    id: string;
    component: Component | Object;
    componentProps: Record<string, any>;
    title: string;
    visible: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    icon?: string;
}

export const useWindowManagerStore = defineStore('windowManager', () => {
    // 状态
    const windows = ref<WindowState[]>([]);
    // 当前最大zIndex
    let maxZIndex = 1;

    /**
     * 更新最大zIndex
     */
    const updateMaxZIndex = () => {
        maxZIndex = windows.value.reduce((max, window) =>
            Math.max(max, window.zIndex || 1), 1);
    };

    /**
     * 置顶窗口
     * @param windowId 窗口id
     */
    const bringToFront = (windowId: string) => {
        updateMaxZIndex();
        const window = windows.value.find(w => w.id === windowId);
        if (window) {
            window.zIndex = maxZIndex + 1;
        }
    };

    /**
     *  隐藏窗口（修改window对象的visible属性）
     * @param windowId 窗口id
     */
    const hideWindow = (windowId: string) => {
        const window = windows.value.find(w => w.id === windowId);
        if (window) {
            window.visible = false;
        }
    };

    /**
     * 恢复窗口
     * @param windowId
     */
    const restoreWindow = (windowId: string) => {
        const window = windows.value.find(w => w.id === windowId);
        if (window) {
            window.visible = true;
            bringToFront(window.id);
        }
    };

    /**
     * 打开新窗口
     * @param component 窗口内显示的组件
     * @param componentProps 传递给组件的属性
     * @param title 标题
     * @param icon 窗口图标路径
     * @returns {*|string} 返回窗口Id
     */
    const openWindow = (component: Component | Object, componentProps: Record<string, any> = {}, title = '新窗口', icon?: string) => {
        const rawComponent = markRaw(component as object);

        // 检查是否已存在相同窗口（仅在visible窗口中检查）
        const existingWindow = windows.value.find(w =>
            w.component === rawComponent &&
            JSON.stringify(w.componentProps) === JSON.stringify(componentProps)
        );

        if (existingWindow) {
            bringToFront(existingWindow.id);
            existingWindow.visible = true;
            return existingWindow.id;
        }
        // 从传递的属性中获取初始化的位置，如果不存在则用默认值
        const x = componentProps.x ? componentProps.x : 300;
        const y = componentProps.y ? componentProps.y : 50;
        // 同样从传递的属性中获取初始化的宽高，如果不存在则用默认值
        const width = componentProps.width ? componentProps.width : 1100;
        const height = componentProps.height ? componentProps.height : 750;

        // 创建新窗口
        const windowId = `window_${Date.now()}`;
        
        const newWindow: WindowState = {
            id: windowId,
            component: rawComponent,
            componentProps,
            title,
            visible: true,
            position: {
                x: x,
                y: y
            },
            size: {width: width, height: height},
            zIndex: maxZIndex + 1
        };

        if (icon !== undefined) {
            newWindow.icon = icon;
        }

        windows.value.push(newWindow);
        return windowId;

    };

    /**
     * 关闭窗口（将window从windows数组中移除）
     * @param windowId
     */
    const closeWindow = (windowId: string) => {
        const index = windows.value.findIndex(w => w.id === windowId);
        if (index !== -1) {
            windows.value.splice(index, 1);
        }
    };

    return {
        windows,
        openWindow,
        closeWindow,
        hideWindow,
        restoreWindow,
        bringToFront
    };
});
