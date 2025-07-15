<template>
  <div class="login-container">
    <!-- 左侧品牌区域 -->
    <div class="login-left">
      <div class="brand-content">
        <div class="brand-logo">
          <el-icon size="60"><OfficeBuilding /></el-icon>
        </div>
        <h1 class="brand-title">管理后台系统</h1>
        <p class="brand-subtitle">高效、安全、智能的企业管理平台</p>
        <div class="brand-features">
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>数据安全保障</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>高效数据管理</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>智能分析统计</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧登录区域 -->
    <div class="login-right">
      <div class="login-box">
        <div class="login-header">
          <h2>欢迎登录</h2>
          <p>请输入您的账号密码进入系统</p>
        </div>
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          class="login-form"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="User"
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>
          
          <el-form-item>
            <div class="login-options">
              <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              class="login-button"
              :loading="loading"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="login-footer">
          <p>还没有账号？<el-link type="primary" :underline="false">立即注册</el-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, OfficeBuilding, Check } from '@element-plus/icons-vue'
import { authAPI } from '../utils/api'

const router = useRouter()

// 表单引用
const loginFormRef = ref()

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 加载状态
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    
    loading.value = true
    
    // 调用真实的登录API
    const response = await authAPI.login(loginForm.username, loginForm.password)
    
    loading.value = false
    
    // 响应拦截器已经处理了错误情况，这里只处理成功情况
    // 保存登录状态和token信息
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('currentUser', loginForm.username)
    sessionStorage.setItem('accessToken', response.accessToken)
    sessionStorage.setItem('refreshToken', response.refreshToken)
    localStorage.setItem('expiresIn', response.expiresIn)
    
    ElMessage.success('登录成功！')
    console.log('登录成功，token:', response.accessToken)
    
    // 跳转到首页
    router.push('/user')
    
  } catch (error) {
    loading.value = false
    console.error('登录失败:', error)
    // 错误提示已在响应拦截器中处理
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  background: #f5f7fa;
}

/* 左侧品牌区域 */
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.brand-content {
  text-align: center;
  color: white;
  z-index: 1;
  position: relative;
  max-width: 500px;
}

.brand-logo {
  margin-bottom: 24px;
}

.brand-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.brand-subtitle {
  font-size: 18px;
  margin: 0 0 40px 0;
  opacity: 0.9;
  line-height: 1.6;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  max-width: 300px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.feature-item .el-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 6px;
  font-size: 14px;
}

/* 右侧登录区域 */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-width: 500px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  padding: 50px 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  color: #2c3e50;
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.login-header p {
  color: #6c757d;
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
}

.login-form {
  margin-bottom: 24px;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.login-form .el-input {
  height: 48px;
}

.login-form .el-input__wrapper {
  border-radius: 8px;
  border: 1px solid #e1e6f0;
  transition: all 0.3s;
}

.login-form .el-input__wrapper:hover {
  border-color: #409eff;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.login-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.login-footer p {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .login-left {
    flex: 0.8;
  }
  
  .login-right {
    flex: 1.2;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-left {
    min-height: 40vh;
    padding: 30px 20px;
  }
  
  .login-right {
    min-width: auto;
    padding: 30px 20px;
  }
  
  .login-box {
    padding: 40px 30px;
  }
  
  .brand-title {
    font-size: 32px;
  }
  
  .brand-subtitle {
    font-size: 16px;
  }
  
  .brand-features {
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .login-left {
    min-height: 35vh;
    padding: 20px;
  }
  
  .login-right {
    padding: 20px;
  }
  
  .login-box {
    padding: 30px 20px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
  
  .brand-title {
    font-size: 28px;
  }
}
</style> 