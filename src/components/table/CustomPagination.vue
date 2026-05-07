<template>
  <el-pagination
    v-bind="$attrs"
    :page-size="pageSize"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :layout="layout"
    :total="total"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  />
</template>

<script setup lang="ts">
import type { PaginationEmits, PaginationProps } from './types'

defineOptions({
  inheritAttrs: false
})

const {
  total = 0,
  pageSize = 10,
  currentPage = 1,
  pageSizes,
  layout = 'total, ->, prev, pager, next, jumper'
} = defineProps<PaginationProps>()

const emit = defineEmits<PaginationEmits>()
</script>

<style scoped></style>
