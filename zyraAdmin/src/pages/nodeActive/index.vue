<template>
  <div class="main-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">
        <h2>资产流水</h2>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="operation-bar">
      <div class="filter-section">

        <el-input
          v-model="searchQuery.keyword"
          placeholder="搜索地址"
          style="width: 300px; margin-right: 12px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-input
          v-model="searchQuery.memberId"
          placeholder="搜索用户ID"
          style="width: 150px; margin-right: 12px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="searchQuery.types"
          placeholder="选择类型"
          style="width: 150px; margin-right: 12px"
          @change="handleStatusFilter"
        >
          <el-option label="全部" value="" />
          <el-option label="充值" value="charge" />
          <el-option label="转账" value="transfer" />
        </el-select>
        <el-select
          v-model="searchQuery.direction"
          placeholder="选择资产类型"
          style="width: 150px; margin-right: 12px"
          @change="handleStatusFilter"
        >
          <el-option label="全部" value="" />
          <el-option label="收入" value="in" />
          <el-option label="支出" value="out" />
          <el-option label="冻结/解冻" value="internal" />
        </el-select>
      </div>
      <div class="operation-buttons">
        <el-button @click="handleRefresh">
          <!-- <el-icon><Refresh /></el-icon> -->
          查询
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="ethAddress" label="地址">
          <template #default="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column prop="memberId" label="用户ID"></el-table-column>
        <el-table-column prop="desc" label="备注">
          <template #default="scope">
            {{ scope.row.metadata.desc || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="nodeName" label="费率">
          <template #default="scope">
            {{ scope.row.metadata.rate || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="token" label="资产类型" />
        <!-- <el-table-column prop="createdAt" label="创建时间" /> -->
        
        <el-table-column prop="available" label="交易类型" width="160">
          <template #default="scope">
            {{ scope.row.direction == 'in' ? '收入' : '支出' }}
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="数量" />
        <el-table-column prop="createdAt" label="时间" />
        <el-table-column prop="inviteCode" label="收入支出">
          <template #default="scope">
            {{ scope.row.direction == 'in' ? '收入' : '支出' }}
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
import { walletAPI } from '../../utils/api'
import { Search, Refresh, Wallet } from '@element-plus/icons-vue'
import { signApprovalData } from '../../utils/wallet'
import { ElMessage, ElMessageBox } from 'element-plus'


// 搜索查询
const searchQuery = ref({})
const statusFilter = ref('pending') // 默认显示待审核的申请

// 表格数据
const tableData = ref([])
const tableLoading = ref(false)
const selectedRows = ref([]) // 选中的行

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)


// 初始化数据
const initData = async () => {
  tableLoading.value = true
  
  try {
    const params = {
      ...searchQuery.value,
      page: currentPage.value,
      size: pageSize.value
    }
    
    const response = await walletAPI.getRecordList(params)
    
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