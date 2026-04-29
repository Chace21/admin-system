<template>
  <el-container>
    <el-aside width="200px">侧边</el-aside>
    <el-container>
      <el-header>顶部</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts"></script>

<style scoped></style>
