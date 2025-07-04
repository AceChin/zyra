<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <el-header class="admin-header">
      <div class="header-content">
        <div class="logo">
          <el-icon><OfficeBuilding /></el-icon>
          <span>管理后台</span>
        </div>
        <div class="header-center">

        </div>
        <div class="header-right">
          <!-- 钱包连接状态 -->
          <div class="wallet-section">
            <div v-if="walletStore.walletConnected" class="wallet-info">
              <el-tag type="success" class="wallet-tag">
                <el-icon><Wallet /></el-icon>
                {{ formatWalletAddress(walletStore.walletAccount) }}
              </el-tag>
              <el-dropdown @command="handleWalletCommand">
                <el-button text class="wallet-dropdown-btn">
                  <el-icon><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="network">
                      <el-icon><Link /></el-icon>
                      {{ walletNetwork }}
                    </el-dropdown-item>
                    <el-dropdown-item command="disconnect" divided>
                      <el-icon><Close /></el-icon>
                      断开连接
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <el-button v-else type="warning" @click="handleConnectWallet">
              <el-icon><Wallet /></el-icon>
              连接钱包
            </el-button>
          </div>
          
          <el-divider direction="vertical" />
          
          <div class="user-section">
            <span class="username">欢迎，{{ currentUser }}</span>
            <el-button type="primary" @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-button>
          </div>
        </div>
      </div>
    </el-header>

    <div class="body">
      <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          @select="selectMenu"
        >
          <el-menu-item index="/user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/withdraw">
            <el-icon><Discount /></el-icon>
            <span>提现管理</span>
          </el-menu-item>
          <el-menu-item index="/records">
            <el-icon><Tickets /></el-icon>
            <span>资产流水</span>
          </el-menu-item>
          <!-- <el-menu-item index="/nodeActive">
            <el-icon><document /></el-icon>
            <span>节点活动</span>
          </el-menu-item> -->
          <el-menu-item index="/node">
            <el-icon><setting /></el-icon>
            <span>节点管理</span>
          </el-menu-item>
        </el-menu>
  
      <div class="admin-main">
        <router-view />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  OfficeBuilding,
  SwitchButton,
  Document,
  Setting,
  Wallet,
  ArrowDown,
  Link,
  Close,
  User,
  Discount,
  Tickets,
} from '@element-plus/icons-vue'

import { 
  walletState, 
  connectWallet, 
  disconnectWallet, 
  checkWalletConnection, 
  formatAddress,
  getNetworkName,
  setupWalletEvents
} from '../utils/wallet'
import { useWalletStore } from '../pinia'

const router = useRouter()
const route = useRoute()

const walletStore = useWalletStore()
const walletNetwork = computed(() => walletStore.walletNetwork)

const defaultActive = ref('')

// 当前用户
const currentUser = ref(localStorage.getItem('currentUser') || 'admin')

const selectMenu = (v) => {
  router.push(v)
  console.log(v)
}

// 钱包相关方法
const formatWalletAddress = (address) => {
  return formatAddress(address)
}

const handleConnectWallet = async () => {
  const success = await connectWallet()
  if (success) {
    updateWalletState()
  }
}

const handleWalletCommand = (command) => {
  if (command === 'disconnect') {
    disconnectWallet()
    updateWalletState()
  }
}

const updateWalletState = () => {
  walletStore.setWallet(walletState.connected, walletState.account, getNetworkName(walletState.chainId))
}

const initWallet = async () => {
  // 检查是否已连接钱包
  const connected = await checkWalletConnection()
  if (connected) {
    updateWalletState()
  }
  
  // 设置钱包事件监听
  setupWalletEvents(
    (account) => {
      walletStore.walletAccount.value = account
    },
    (chainId) => {
      walletStore.walletNetwork = getNetworkName(chainId)
    },
    () => {
      updateWalletState()
    }
  )
}


// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确认退出登录吗？',
    '确认退出',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 清除所有登录相关的信息
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiresIn')
    
    router.push('/login')
    ElMessage.success('已退出登录')
  })
}

// 组件挂载后初始化数据
onMounted(() => {
  defaultActive.value = route.fullPath
  initWallet()
})
</script>

<style scoped lang="scss">

.body {
  display: flex;
  flex: 1;
}

.admin-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.admin-header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  min-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  min-width: 160px;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 28px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-menu {
  border-bottom: none;
  background: transparent;
}

.header-menu .el-menu-item {
  height: 64px;
  line-height: 64px;
  border-bottom: 2px solid transparent;
  margin: 0 16px;
}

.header-menu .el-menu-item:hover,
.header-menu .el-menu-item.is-active {
  background: transparent;
  border-bottom-color: #409eff;
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
  min-width: 300px;
  justify-content: flex-end;
  gap: 16px;
}

.wallet-section {
  display: flex;
  align-items: center;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wallet-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 8px;
}

.wallet-dropdown-btn {
  padding: 4px !important;
  height: auto !important;
  color: #666;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  color: #666;
  font-size: 14px;
}

.admin-main {
  flex: 1;
  padding: 24px;
  min-width: 1200px;
  margin: 0 auto;
  width: 100%;
}




/* 响应式设计 */
@media (max-width: 1200px) {
  .admin-main {
    padding: 20px;
  }
  
  .header-content {
    padding: 0 20px;
  }
}

@media (max-width: 992px) {
  .header-center {
    display: none;
  }
  
  .header-content {
    justify-content: space-between;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .page-breadcrumb {
    align-self: flex-end;
  }
}

@media (max-width: 768px) {
  .admin-main {
    padding: 16px;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .header-right {
    min-width: 200px;
    flex-direction: column;
    gap: 8px;
  }
  
  .wallet-section {
    order: 2;
  }
  
  .user-section {
    order: 1;
  }
  
  .operation-bar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .filter-section .el-select,
  .filter-section .el-input {
    width: 100% !important;
    margin-right: 0 !important;
  }
  
  .operation-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .page-title h2 {
    font-size: 24px;
  }
  
  .table-container,
  .pagination-container {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .logo span {
    display: none;
  }
  
  .header-content {
    padding: 0 12px;
  }
  
  .header-right {
    min-width: 120px;
  }
  
  .wallet-tag {
    font-size: 10px;
    padding: 2px 6px;
  }
  
  .username {
    font-size: 12px;
  }
  
  .user-section .el-button {
    font-size: 12px;
    padding: 6px 12px;
  }
  
  .admin-main {
    padding: 12px;
  }
  
  .page-header {
    padding: 16px;
  }
  
  .operation-bar {
    padding: 16px;
  }
  
  .table-container,
  .pagination-container {
    padding: 12px;
  }
}
</style> 