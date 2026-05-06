<template>
  <el-scrollbar max-height="100%">
    <el-menu
      style="height: 100%"
      :default-active="resolvedActiveIndex"
      unique-opened
      :collapse="collapse"
      :router="useRouterMode"
    >
      <sideBarItem v-for="item in normalizedMenuList" :key="item.path" :item="item" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import sideBarItem from './components/sideBarItem.vue'
import type { SidebarMenuItem } from './types'

const defaultMenuList: SidebarMenuItem[] = [
  {
    path: '/test1',
    name: '测试1',
    children: [
      {
        path: '/test1-1',
        name: '测试1-1'
      },
      {
        path: '/test1-2',
        name: '测试1-2'
      }
    ]
  },
  {
    path: '/test2',
    name: '测试2'
  }
]

const props = withDefaults(
  defineProps<{
    activeIndex?: string
    collapse?: boolean
    menuList?: SidebarMenuItem[]
    useRouterMode?: boolean
  }>(),
  {
    activeIndex: '',
    collapse: false,
    useRouterMode: true,
    menuList: () => []
  }
)

const route = useRoute()

function normalizeMenuList(menuList: SidebarMenuItem[]): SidebarMenuItem[] {
  return menuList
    .filter((item) => item.path && item.name)
    .map((item) => ({
      ...item,
      children: item.children?.length ? normalizeMenuList(item.children) : undefined
    }))
}

const normalizedMenuList = computed(() => normalizeMenuList(defaultMenuList))
const resolvedActiveIndex = computed(() => props.activeIndex || route.path || '')
</script>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
