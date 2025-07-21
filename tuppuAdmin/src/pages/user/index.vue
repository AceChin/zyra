<template>
  <div class="main-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">
        <h2>用户管理</h2>
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
        <el-button @click="setTags">
          设置标签
        </el-button>
        <el-button @click="handleRefresh">
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
        <el-table-column type="selection" width="55" />
        <el-table-column prop="ethAddress" label="用户" />
        <el-table-column prop="nodeName" label="节点" />
        <el-table-column prop="levelName" label="等级" />
        <el-table-column prop="tags" label="标签" />
        <el-table-column prop="inviteCode" label="邀请码" />
        <!-- <el-table-column prop="createdAt" label="创建时间" /> -->

        <el-table-column prop="available" label="是否启用" width="160">
          <template #default="scope">
            {{ scope.row.available ? "启用" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleViewDetail(scope.row)"
            >
              详情
            </el-button>
            <el-button
              type="success"
              size="small"
              :disabled="!walletConnected"
              @click="openAmountModal(scope.row)"
            >
              <el-icon v-if="walletConnected"><Wallet /></el-icon>
              {{ walletConnected ? "修改余额" : "需连接钱包" }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="openMemberTagModal(scope.row)"
            >
              删除标签
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

    <el-dialog v-model="visible" title="用户详情" width="1200">
      <el-tabs v-if="visible" v-model="active" type="card">
        <el-tab-pane label="资料" name="first">
          <div class="infoContent">
            <span>地址： {{ detail.ethAddress }}</span>
            <!-- <span>标签： {{ detail.address }}</span> -->
            <span>用户名： {{ detail.ethAddress }}</span>
            <span>当前等级： {{ detail.levelName }}</span>
            <span>注册时间： {{ detail.createdAt }}</span>
            <!-- <span>头衔： {{ detail.address }}</span> -->
            <span>最后登录时间： {{ detail.updatedAt }}</span>
            <!-- <span>备注： {{ detail.address }}</span> -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="资产流水" name="second">
          <div>
            <div class="filter">
              <div class="filter-section" style="margin-bottom: 12px;">
                <el-date-picker
                  v-model="searchParam.range"
                  style="max-width: 300px; margin-right: 12px"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>

                <el-select
                  v-model="searchParam.role"
                  style="width: 150px; margin-right: 12px"
                  placeholder="请选择资产类型"
                >
                  <el-option label="全部" value=""></el-option>
                  <!-- <el-option label="区域营销中心" value="TEAM" />
                  <el-option label="创世代理" value="PARTNER" /> -->
                </el-select>

                <el-select
                  v-model="searchParam.types"
                  style="width: 150px; margin-right: 12px"
                  placeholder="请选择交易类型"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="充值" value="charge" />
                  <el-option label="提现" value="withdraw" />
                  <el-option label="用户间转账" value="transfer" />
                  <el-option label="平台奖励" value="reward" />
                  <el-option label="退款" value="refund" />
                  <el-option label="手续费" value="fee" />
                  <el-option label="冻结" value="freeze" />
                  <el-option label="解冻" value="unfreeze" />
                  <el-option label="消费、订单扣减" value="deduct" />
                  <el-option label="挖矿" value="mine" />
                </el-select>

                <el-select
                  v-model="searchParam.direction"
                  style="width: 150px; margin-right: 12px"
                  placeholder="请选择收入/支出"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="收入" value="in" />
                  <el-option label="支出" value="out" />
                  <el-option label="冻结/解冻" value="internal" />
                </el-select>

                <el-button type="primary" style="margin-left: auto;" @click="fetchWalletRecord">
                  查询
                </el-button>
              </div>
            </div>
            <el-table :data="records" :border="true" fit max-height="600">
              <el-table-column prop="token" label="资产类型" align="center" />
              <!-- <el-table-column prop="levelName" label="状态" width="120" align="center" /> -->
              <el-table-column
                prop="createdAt"
                label="完成时间"
                align="center"
              />
              <el-table-column prop="nodeName" label="交易类型" align="center">
                <template #default="scope">
                  {{ typeEm[scope.row.type] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="direction"
                label="收入/支出"
                align="center"
              >
                <template #default="scope">
                  {{ scope.row.direction == "in" ? "收入" : "支出" }}
                </template>
              </el-table-column>
              <el-table-column prop="balance" label="数量" align="center" />
              <el-table-column prop="levelName" label="哈希" align="center">
                <template #default="scope">
                  {{ scope.row.metadata.txHash || "--" }}
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
              v-show="total1 > 0"
              :total="total1"
              :page.sync="pages.page"
              :limit.sync="pages.size"
              @current-change="fetchWalletRecord()"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="团队" name="third">
          <!-- @node-click="handleNodeClick" -->
          <el-tree
            :data="treeData"
            :props="{
              label: data => `${formatAddress(data.ethAddress)}-${data.levelName}-${data.nodeName || ''}`
            }"
            :load="fetchUserLower"
            lazy
          >
          </el-tree>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="visible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="tagVisible" title="设置标签" width="400">
      <el-select v-model="tags" multiple placeholder="请选择">
        <el-option
          v-for="item in tagList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSureTag">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="userTagVisible" title="修改标签" width="400">
      <el-tag v-for="item of userTags" :key="item.id" style="margin: 5px;" closable @close="() => onDeleteUserTag(item)">
        {{ item.tagName }}
      </el-tag>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="userTagVisible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="amountVisible" title="修改余额" width="400">
      <el-input v-model="amountValue" placeholder="请输入金额" />
      <el-input v-model="remark" type="textarea" style="margin-top: 20px" placeholder="请输入备注" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSureModifyAmount">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { userAPI, walletAPI, tagAPI } from "../../utils/api";
import { useWalletStore } from '../../pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Wallet } from '@element-plus/icons-vue'
import { signAmountData } from '../../utils/wallet'

const typeEm = {
  charge: "充值",
  withdraw: "提现",
  transfer: "用户间转账",
  reward: "平台奖励",
  refund: "退款",
  fee: "手续费",
  freeze: "冻结",
  unfreeze: "解冻",
  deduct: "消费、订单扣减",
  mine: "挖矿",
};

const walletStore = useWalletStore()

const walletConnected = computed(() => walletStore.walletConnected)
const walletAccount = computed(() => walletStore.walletAccount)

// 搜索查询
const searchQuery = ref({});
const searchParam = ref({
  range: [],
});
const selectId = ref("");
const remark = ref("");
const amountValue = ref("");
const detail = ref({});
const treeData = ref([]);
const tagList = ref([]);
const userTags = ref([]);

const active = ref('first')

// 表格数据
const tableData = ref([]);
const visible = ref(false);
const amountVisible = ref(false);
const userTagVisible = ref(false);
const tableLoading = ref(false);
const selectedRows = ref([]); // 选中的行

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const total1 = ref(0);
const pages = ref({
  page: 1,
  size: 10,
});
const records = ref([]);

const tags = ref([])
const tagVisible = ref(false)

const fetchTag = async () => {
  tagList.value = await tagAPI.getTagList()
}

// 初始化数据
const initData = async () => {
  tableLoading.value = true;
  fetchTag()
  try {
    const params = {
      ...searchQuery.value,
      page: currentPage.value,
      size: pageSize.value,
    };

    const response = await userAPI.getUserList(params);

    // 响应拦截器已经处理了错误情况，这里只处理成功情况
    tableData.value = response.records || [];
    total.value = response.total || 0;
  } catch (error) {
    console.error("获取提现列表失败:", error);
    // 错误提示已在响应拦截器中处理
  } finally {
    tableLoading.value = false;
  }
};

  const formatAddress = (address) => {
    if (typeof address !== 'string' || address.length <= 10) {
      return address;
    }
  
    const prefix = address.slice(0, 6);
    const suffix = address.slice(-4);
    return `${prefix}****${suffix}`;
  }

const fetchUserLower = async (node = { data: {} }, resolve, reject) => {
  console.log(node)
  const data = await userAPI.fetchUserLower(node.data.id || selectId.value)
  if(data.length > 0) {
    return resolve([ ...data ]);
  } else {
    return resolve([]);
  }
};

const fetchWalletRecord = async () => {
  const { records: list, total: total2 } = await walletAPI.getRecordList({
    memberId: selectId.value,
    ...pages.value,
    ...searchParam.value,
    startTime: searchParam.value.range[0]
      ? moment(new Date(searchParam.value.range[0]).valueOf()).format(
          "YYYY/MM/DD"
        ) + " 00:00:00"
      : "",
    endTime: searchParam.value.range[1]
      ? moment(new Date(searchParam.value.range[1]).valueOf()).format(
          "YYYY/MM/DD"
        ) + " 23:59:59"
      : "",
  });
  records.value = list;
  total1.value = total2 >>> 0;
};

// 查看详情
const handleViewDetail = (row) => {
  selectId.value = row.id;
  detail.value = row;
  visible.value = true;
  fetchWalletRecord();
  // fetchUserLower()
};

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val;
  initData();
};

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val;
  initData();
};

// 搜索处理
const handleSearch = () => {
  // 搜索是通过computed实现的，这里可以添加其他逻辑
};

// 状态过滤处理
const handleStatusFilter = () => {
  currentPage.value = 1;
  initData();
};

// 表格选择处理
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

// 刷新数据
const handleRefresh = () => {
  initData();
};

const setTags = () => {
  if(selectedRows.value == 0) {
    ElMessage.error("至少要选择一位用户");
    return
  }
  tags.value = []
  tagVisible.value = true
}

const onSetTags = async () => {
  await userAPI.setUserTag({
    memberIds: '',
  })
  tagVisible.value = false
}

const onSureTag = async () => {
  await userAPI.setUserTag({
    memberIds: selectedRows.value.map(i => i.id),
    tagIds: tags.value,
  })
  tagVisible.value = false
  ElMessage.success('设置成功')
  handleRefresh()
}

const openMemberTagModal = async (v) => {
  // v.id
  selectId.value = v.id
  const data = await userAPI.fetchUserTag(v.id)
  console.log(data)
  userTags.value = data
  userTagVisible.value = true
}

const onDeleteUserTag = async (v) => {
  await userAPI.deleteUserTag({memberId: selectId.value, tagId: v.tagId})
  openMemberTagModal({ id: selectId.value })
  initData()
}

// 确认余额
const onSureModifyAmount = (row) => {
  userAPI.getRawSignMessage({
    address: walletAccount.value,
    memberId: selectId.value,
    token: localStorage.getItem('accessToken'),
    amount: amountValue.value,
  }).then(async (res) => {  
    console.log(res)
    // executeReject(row, res)
    const signData = await signAmountData(res.message)
    console.log(signData)
    await userAPI.sureTransfer({
      address: res.to,
      message: signData.message,
      signature: signData.signature,
      nonce: res.nonce,
      remark: remark.value
    })
  })
  
}

const openAmountModal = (v) => {
  selectId.value = v.id
  amountVisible.value = true
}

onMounted(() => {
  initData();
});
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

.infoContent {
  display: flex;
  flex-wrap: wrap;
  margin: 40px;

  span {
    // flex: 1;
    white-space: nowrap;
    margin: 20px;
  }
}
</style>