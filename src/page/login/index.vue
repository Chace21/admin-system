<template>
  <div class="login-page">
    <el-card>
      <template #header> 后台管理系统 </template>
      <el-form ref="formRef" :model="formData">
        <el-form-item
          label="账号"
          prop="userName"
          required
          :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
        >
          <el-input v-model="formData.userName"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          required
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="btn-group">
          <el-button @click="register">注册</el-button>
          <el-button type="primary" @click="submitForm">登录</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

interface FormData {
  userName: string
  password: string
}
const formRef = ref()
const formData = ref<FormData>({
  userName: '',
  password: ''
})

const submitForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      localStorage.setItem('token', '123456')
      router.push('/')
    } else {
      console.log('登录失败')
    }
  })
}
const register = () => {
  console.log('注册')
}
</script>

<style scoped lang="scss">
.login-page {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/imgs/frontPage-bg.jpg') no-repeat center center / 100% 100%;
  .el-card {
    width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .btn-group {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
