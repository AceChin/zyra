<template>
  <div class="main-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">
        <h2>提现申请管理</h2>
        <p>管理用户提现申请和审核</p>
      </div>
      <div class="page-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>提现申请管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="operation-bar">
      <div class="filter-section">
        <el-select
          v-model="statusFilter"
          placeholder="选择状态"
          style="width: 150px; margin-right: 12px"
          @change="handleStatusFilter"
        >
          <el-option label="全部状态" value="" />
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
          <el-option label="链上处理中" value="processing" />
          <el-option label="链上已确认" value="confirmed" />
          <el-option label="链上处理失败" value="failed" />
          <el-option label="已完成" value="done" />
          <el-option label="已关闭" value="close" />
        </el-select>
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户ID或地址"
          style="width: 300px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="operation-buttons">
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <el-table
        :data="filteredTableData"
        v-loading="tableLoading"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="toAddress" label="用户" show-overflow-tooltip />
        <el-table-column prop="token" label="币种" width="80">
          <template #default="scope">
            <el-tag type="info">{{ scope.row.token }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="申请金额" width="120">
          <template #default="scope">
            <span class="amount-text">{{
              formatAmount(scope.row.amount)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="手续费" width="100">
          <template #default="scope">
            <span class="fee-text">{{ formatAmount(scope.row.fee) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="toAddress"
          label="提现地址"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="160">
          <template #default="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'pending'"
              type="success"
              size="small"
              :disabled="!walletConnected"
              @click="handleApprove(scope.row)"
            >
              <el-icon v-if="walletConnected"><Wallet /></el-icon>
              {{ walletConnected ? "去转账" : "需连接钱包" }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="danger"
              size="small"
              :disabled="!walletConnected"
              @click="handleReject(scope.row)"
            >
              <el-icon v-if="walletConnected"><Wallet /></el-icon>
              {{ walletConnected ? "签名拒绝" : "需连接钱包" }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleViewDetail(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total >>> 0"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { withdrawAPI } from '../../utils/api'
import { Search, Refresh, Wallet } from '@element-plus/icons-vue'
import { signApprovalData, sendERC20Token } from '../../utils/wallet'
import { useWalletStore } from '../../pinia'
import { ElMessage, ElMessageBox } from 'element-plus'

const walletStore = useWalletStore()

const walletConnected = computed(() => walletStore.walletConnected)
const walletAccount = computed(() => walletStore.walletAccount)

// 搜索查询
const searchQuery = ref('')
const statusFilter = ref('pending') // 默认显示待审核的申请

// 表格数据
const tableData = ref([])
const tableLoading = ref(false)
const selectedRows = ref([]) // 选中的行

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 过滤后的表格数据
const filteredTableData = computed(() => {
  if (!searchQuery.value) {
    return tableData.value
  }
  return tableData.value.filter(item =>
    item.memberId.toString().includes(searchQuery.value) ||
    item.toAddress.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})


// 初始化数据
const initData = async () => {
  tableLoading.value = true
  
  try {
    const params = {
      status: statusFilter.value,
      page: currentPage.value,
      size: pageSize.value
    }
    
    const response = await withdrawAPI.getWithdrawList(params)
    
    // 响应拦截器已经处理了错误情况，这里只处理成功情况
    tableData.value = response.records || []
    total.value = response.total || 0
  } catch (error) {
    console.error('获取提现列表失败:', error)
    // 错误提示已在响应拦截器中处理
  } finally {
    tableLoading.value = false
  }
}


const executeReject = (row, rawSign) => {
  ElMessageBox.prompt(
    `确认拒绝用户 ${row.memberId} 的提现申请？\n申请金额：${formatAmount(row.amount)} ${row.token}\n\n拒绝操作需要钱包签名确认\n\n${rawSign.message}`,
    '拒绝提现申请',
    {
      confirmButtonText: '签名并拒绝',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入拒绝原因',
      inputType: 'textarea'
    }
  ).then(async ({ value }) => {
    if (!value) {
      ElMessage.warning('请输入拒绝原因')
      return
    }
    
    if (!walletConnected) {
      ElMessage.error('请先连接钱包进行签名')
      return
    }
    
    try {
      ElMessage.info('请在钱包中确认签名...')
      
      // 钱包签名
      const signData = await signApprovalData(rawSign.message)
      
      // 调用API
      const response = await withdrawAPI.rejectWithdraw(row.id, {
        remark: value || '管理员已拒绝',
        signature: signData.signature,
        message: signData.message,
        nonce: rawSign.nonce,
        address: signData.signer
      })
      
      // 响应拦截器已经处理了错误情况，这里只处理成功情况
      ElMessage.success('已拒绝申请')
      initData() // 刷新数据
    } catch (error) {
      console.error('拒绝申请失败:', error)
      if (error.message.includes('用户拒绝')) {
        ElMessage.warning('用户取消签名')
      } else if (error.message.includes('钱包未连接')) {
        ElMessage.error('请先连接钱包')
      }
      // 其他错误提示已在响应拦截器中处理
    }
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 查看详情
const handleViewDetail = (row) => {
  ElMessageBox.alert(
    `
    <div style="text-align: left;">
      <p><strong>申请ID:</strong> ${row.id}</p>
      <p><strong>用户ID:</strong> ${row.memberId}</p>
      <p><strong>币种:</strong> ${row.token}</p>
      <p><strong>申请金额:</strong> ${formatAmount(row.amount)}</p>
      <p><strong>手续费:</strong> ${formatAmount(row.fee)}</p>
      <p><strong>实际到账:</strong> ${formatAmount(row.amount - row.fee)}</p>
      <p><strong>提现地址:</strong> ${row.toAddress}</p>
      <p><strong>状态:</strong> ${getStatusText(row.status)}</p>
      <p><strong>申请时间:</strong> ${formatTime(row.createdAt)}</p>
      ${row.approvedAt ? `<p><strong>审核时间:</strong> ${formatTime(row.approvedAt)}</p>` : ''}
      ${row.approvedRemark ? `<p><strong>审核备注:</strong> ${row.approvedRemark}</p>` : ''}
      ${row.txHash ? `<p><strong>交易哈希:</strong> ${row.txHash}</p>` : ''}
      ${row.remark ? `<p><strong>用户备注:</strong> ${row.remark}</p>` : ''}
    </div>
    `,
    '提现申请详情',
    {
      confirmButtonText: '关闭',
      dangerouslyUseHTMLString: true
    }
  )
}

// 工具函数
const formatAmount = (amount) => {
  if (!amount) return '0.00'
  return parseFloat(amount).toFixed(6)
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    processing: 'primary',
    done: 'success',
    failed: 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    processing: '处理中',
    done: '已完成',
    failed: '失败'
  }
  return statusMap[status] || status
}


// 批量审核
const handleBatchApprove = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要审核的申请')
    return
  }
  
  const pendingRows = selectedRows.value.filter(row => row.status === 'pending')
  if (pendingRows.length === 0) {
    ElMessage.warning('选中的申请中没有待审核的记录')
    return
  }
  
  ElMessage.info(`批量审核功能待开发，选中 ${pendingRows.length} 条记录`)
}


// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  initData()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  initData()
}

const executeApprove = (row, rawSign) => {
  ElMessageBox.prompt(
    `确认通过用户 ${row.memberId} 的提现申请？\n申请金额：${formatAmount(row.amount)} ${row.token}\n\n审核需要钱包签名确认\n\n${rawSign.message}`,
    '审核提现申请',
    {
      confirmButtonText: '签名并通过',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入审核备注（可选）',
      inputType: 'textarea'
    }
  ).then(async ({ value }) => {
    if (!walletConnected) {
      ElMessage.error('请先连接钱包进行签名')
      return
    }

    try {
      ElMessage.info('请在钱包中确认签名...')
      
      // 钱包签名
      const signData = await signApprovalData(rawSign.message)
      
      // 调用API
      const response = await withdrawAPI.approveWithdraw({
        remark: value || '管理员审核通过',
        signature: signData.signature,
        message: signData.message,
        nonce: rawSign.nonce,
        address: signData.signer
      })
      
      // 响应拦截器已经处理了错误情况，这里只处理成功情况
      ElMessage.success('审核成功')
      initData() // 刷新数据
    } catch (error) {
      console.error('审核失败:', error)
      if (error.message.includes('用户拒绝')) {
        ElMessage.warning('用户取消签名')
      } else if (error.message.includes('钱包未连接')) {
        ElMessage.error('请先连接钱包')
      }
      // 其他错误提示已在响应拦截器中处理
    }
  }).catch(() => {
    ElMessage.info('已取消审核')
  })
}

// 拒绝提现申请
const handleReject = (row) => {
  withdrawAPI.getRawSignMessage({id: row.id, address: walletAccount.value}).then(res => {
    executeReject(row, res)
  })
  
}

// 审核提现申请
const handleApprove = (row) => {
  withdrawAPI.getWithdrawTransfer({id: row.id, address: walletAccount.value}).then(res => {
    executeApprove2(row, res)
  })
}

const executeApprove2 = (row, res) => {
  const {to, amount, tokenContractAddress, decimals} = res;
  console.log(to, amount, tokenContractAddress);
  ElMessageBox.prompt(
    `确认通过用户 ${row.memberId} 的提现申请？\n申请金额：${formatAmount(row.amount)} ${row.token}\n\n审核需要钱包签名确认\n\n手续费${formatAmount(row.fee)} ${row.token}`,
    '审核提现申请',
    {
      confirmButtonText: '确认转账',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入审核备注（可选）',
      inputType: 'textarea'
    }
  ).then(async ({ value }) => {
    if (!walletConnected.value) {
      ElMessage.error('请先连接钱包进行签名')
      return
    }

    try {
      ElMessage.info('正在唤起钱包，请在钱包中完成转账...')
      
      // 钱包签名
      const txHash = await sendERC20Token(tokenContractAddress, to, amount, decimals)
      
      // 调用API
      const response = await withdrawAPI.approveWithdraw({
        remark: value || '管理员审核通过',
        withdrawId: row.id,
        txHash: txHash,
        address: walletAccount.value
      })
      
      // 响应拦截器已经处理了错误情况，这里只处理成功情况
      ElMessage.success('审核成功')
      initData() // 刷新数据
    } catch (error) {
      console.error('审核失败:', error)
      if (error.message.includes('用户拒绝')) {
        ElMessage.warning('用户取消签名')
      } else if (error.message.includes('钱包未连接')) {
        ElMessage.error('请先连接钱包')
      }
      // 其他错误提示已在响应拦截器中处理
    }
  }).catch(() => {
    ElMessage.info('已取消审核')
  })
}

// 搜索处理
const handleSearch = () => {
  // 搜索是通过computed实现的，这里可以添加其他逻辑
}

// 状态过滤处理
const handleStatusFilter = () => {
  currentPage.value = 1
  initData()
}

// 表格选择处理
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 刷新数据
const handleRefresh = () => {
  initData()
}

onMounted(() => {
  initData()
})

</script>
<style lang="scss" scoped>
.main-content {
  width: 100%;

  .page-header {
    background: #fff;
    padding: 24px;
    margin-bottom: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-title h2 {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 28px;
    font-weight: 600;
  }

  .page-title p {
    margin: 0;
    color: #6c757d;
    font-size: 14px;
  }

  .page-breadcrumb {
    display: flex;
    align-items: center;
  }

  .operation-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    background: #fff;
    padding: 20px 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .filter-section {
    display: flex;
    align-items: center;
  }

  .amount-text {
    font-weight: 600;
    color: #1890ff;
  }

  .fee-text {
    font-weight: 500;
    color: #fa8c16;
  }

  .operation-buttons {
    display: flex;
    gap: 12px;
  }

  .table-container {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 24px;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    background: #fff;
    padding: 20px 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
}
</style>