<template>
  <el-container>
    <el-aside width="200px">
      <SideBar />
    </el-aside>
    <el-container>
      <el-header>顶部</el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import SideBar from './sideBar/index.vue'
</script>

<style scoped></style>
