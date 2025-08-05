<template>
  <div class="main-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">
        <h2>资产流水</h2>
      </div>
      <!-- <div class="page-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
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
          <el-option label="提现" value="withdraw" />
          <el-option label="活动" value="reward" />
          <el-option label="冻结" value="freeze" />
          <el-option label="解冻" value="unfreeze" />
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
        <el-table-column prop="ethAddress" width="350" label="地址">
          <template #default="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column prop="memberId" label="用户ID"></el-table-column>
        <el-table-column prop="inviteCode" label="收入支出">
          <template #default="scope">
            {{ scope.row.direction == 'in' ? '收入' : '支出' }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            {{ types[scope.row.type] }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="nodeName" label="费率">
          <template #default="scope">
            {{ scope.row.metadata.rate || '--' }}
          </template>
        </el-table-column> -->
        <el-table-column prop="token" label="资产类型" />
        <!-- <el-table-column prop="createdAt" label="创建时间" /> -->
        
        <el-table-column prop="available" label="交易类型">
          <template #default="scope">
            {{ scope.row.direction == 'in' ? '收入' : '支出' }}
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="数量" />
        <el-table-column prop="createdAt" label="时间">
          <template #default="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="备注">
          <template #default="scope">
            {{ scope.row.metadata.desc || '--' }}
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
import { ref, onMounted } from 'vue'
import { walletAPI } from '../../utils/api'
import { Search } from '@element-plus/icons-vue'


// 搜索查询
const searchQuery = ref({})

const types = ref({
  charge: '充值',
  transfer: '转账',
  withdraw: '提现',
  reward: '活动',
  fee: '手续费',
  freeze: '冻结',
  unfreeze: '解冻',
})

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