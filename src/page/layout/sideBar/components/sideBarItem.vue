<template>
  <el-sub-menu v-if="isSubMenu" :index="menuIndex">
    <template #title>{{ item.name }}</template>
    <SideBarItem v-for="childItem in children" :key="childItem.path" :item="childItem" />
  </el-sub-menu>
  <template v-else>
    <el-menu-item :index="menuIndex">
      {{ item.name }}
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SidebarMenuItem } from '../types'

const props = defineProps<{
  item: SidebarMenuItem
}>()

const children = computed(() => props.item.children ?? [])
const isSubMenu = computed(() => children.value.length > 0)
const menuIndex = computed(() => props.item.path || props.item.name)
</script>

<style scoped></style>
