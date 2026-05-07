<template>
  <div class="custom-table">
    <el-table ref="tableRef" v-bind="$attrs" class="table-main" :data="tableData" :row-key="rowKey">
      <el-table-column
        v-if="tableObj.showSelection"
        type="selection"
        :width="tableObj.selectionWidth ?? 55"
        :align="tableObj.selectionAlign ?? 'center'"
        :header-align="tableObj.selectionHeaderAlign ?? 'center'"
        :fixed="tableObj.selectionFixed ?? false"
      />
      <el-table-column
        v-if="tableObj.showIndex"
        type="index"
        :label="tableObj.indexLabel ?? '序号'"
        :width="tableObj.indexWidth ?? 50"
        :align="tableObj.indexAlign ?? 'center'"
        :header-align="tableObj.indexHeaderAlign ?? 'center'"
        :fixed="tableObj.indexFixed ?? false"
      >
        <template #default="scope">
          <slot name="index" v-bind="scope">
            {{ getIndexValue(scope.$index) }}
          </slot>
        </template>
      </el-table-column>
      <CustomTableColumn
        v-for="(column, columnIndex) in tableHead"
        :key="getColumnKey(column, columnIndex)"
        :column="column"
      >
        <template v-for="(item, key) in $slots" :key="key" #[key]="scope">
          <slot :name="key" v-bind="scope"></slot>
        </template>
      </CustomTableColumn>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { CustomTableProps, TableColumnItem, TableRow, TableRowKey } from './types'

defineOptions({
  inheritAttrs: false
})

const { tableData = [], tableHead = [], tableObj = {} } = defineProps<CustomTableProps>()
const tableRef = ref()

watch(
  () => tableHead,
  () => {
    nextTick(() => {
      tableRef.value?.doLayout()
    })
  },
  { deep: true }
)

function getIndexValue(index: number) {
  const pageIndex = Number(tableObj.pageIndex)
  const pageSize = Number(tableObj.pageSize)

  if (Number.isFinite(pageIndex) && Number.isFinite(pageSize) && pageIndex > 0 && pageSize > 0) {
    return (pageIndex - 1) * pageSize + index + 1
  }

  return index + 1
}

function getColumnKey(column: TableColumnItem, index: number) {
  return column.columnKey ?? column.prop ?? `${column.label ?? 'column'}-${index}`
}

function rowKey(row: TableRow): TableRowKey {
  return row[tableObj.rowKey ?? 'id'] as string
}
</script>

<style scoped>
.table-main {
  width: 100%;
}
</style>
