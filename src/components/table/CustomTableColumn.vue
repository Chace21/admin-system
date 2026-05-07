<template>
  <el-table-column
    :prop="column.prop"
    :label="column.label"
    :align="column.align ?? 'center'"
    :header-align="column.headerAlign ?? 'center'"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :sortable="column.sortable"
    :sort-method="(a, b) => sortMethod(a, b, column)"
  >
    <template #header="scope" v-if="column.headerCustom">
      <slot :name="getHeaderSlotName(column)" v-bind="scope"></slot>
    </template>

    <template v-if="!hasChildren(column)" #default="scope">
      <slot :name="getValueSlotName(column)" v-bind="scope">
        {{ handleEmptyValue(scope.row[column.prop], column.defaultValue, column.suffix) }}
      </slot>
    </template>

    <CustomTableColumn
      v-for="(child, childIndex) in column.children || []"
      :key="getColumnKey(child, childIndex)"
      :column="child"
    >
      <template v-for="(item, key) in $slots" :key="key" #[key]="scope">
        <slot :name="key" v-bind="scope"></slot>
      </template>
    </CustomTableColumn>
  </el-table-column>
</template>

<script setup lang="ts">
import { handleEmptyValue } from '@/utils/format'
import type { CustomTableColumnProps, TableColumnItem, TableRow } from './types'

defineProps<CustomTableColumnProps>()

function hasChildren(column: TableColumnItem) {
  return Array.isArray(column.children) && column.children.length > 0
}

function getColumnKey(column: TableColumnItem, index: number) {
  return column.columnKey ?? column.prop ?? `${column.label ?? 'column'}-${index}`
}

function getHeaderSlotName(column: TableColumnItem) {
  if (column.headerSlotName) return column.headerSlotName
  if (column.prop) return `${column.prop}Header`
  if (column.columnKey) return `${column.columnKey}Header`
  return ''
}

function getValueSlotName(column: TableColumnItem) {
  if (column.valueSlotName) return column.valueSlotName
  if (column.prop) return column.prop
  return column.columnKey ?? ''
}

function compareValues(a: unknown, b: unknown) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1

  const numberA = Number(a)
  const numberB = Number(b)
  const validA = Number.isFinite(numberA)
  const validB = Number.isFinite(numberB)

  if (validA && validB) return numberA - numberB
  if (!validA && !validB) {
    return String(a).localeCompare(String(b), 'zh-CN', {
      numeric: true,
      sensitivity: 'base'
    })
  }
  if (!validA) return 1
  if (!validB) return -1

  return 0
}

function sortMethod(a: TableRow, b: TableRow, column: TableColumnItem) {
  if (!column.prop) return 0
  return compareValues(a?.[column.prop], b?.[column.prop])
}
</script>

<style scoped></style>
