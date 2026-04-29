<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const dialogConfig = {
  alignCenter: true
}

const msgConfig = {
  grouping: true,
  showClose: false,
  placement: 'top'
}
</script>

<template>
  <el-config-provider :locale="zhCn" :dialog="dialogConfig" :message="msgConfig">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
