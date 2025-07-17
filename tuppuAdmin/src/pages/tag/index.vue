<template>
  <div class="main-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">
        <h2>节点管理</h2>
      </div>
    </div>

    <div class="operation-bar">
      <div class="filter-section"></div>
      <div class="operation-buttons">
        <el-button @click="create">
          <!-- <el-icon><Refresh /></el-icon> -->
          新增
        </el-button>
        <el-button @click="initData">
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
      >
        <el-table-column prop="name" label="标签名称" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="modify(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogFormVisible" :title="form.id ? '编辑节点' : '新增节点'" width="600">
      <el-form :model="form">
        <el-form-item label="标签名" :label-width="80">
          <el-input v-model="form.name" placeholder="请输入" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" :label-width="80">
          <el-input
            v-model="form.remark"
            :rows="12"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { tagAPI } from "../../utils/api";
import { ElMessage } from "element-plus";

// 表格数据
const tableData = ref([]);
const form = ref({});
const active = ref(0);
const tableLoading = ref(false);
const dialogFormVisible = ref(false);
const languageEm = {
  "en-US": "英文",
  "zh-CN": "中文",
};

// 初始化数据
const initData = async () => {
  tableLoading.value = true;
  try {
    const response = await tagAPI.getTagList();

    // 响应拦截器已经处理了错误情况，这里只处理成功情况
    tableData.value = response || [];
    // total.value = response.total || 0
  } catch (error) {
    console.error("获取提现列表失败:", error);
    // 错误提示已在响应拦截器中处理
  } finally {
    tableLoading.value = false;
  }
};

// 状态过滤处理
const modify = (v) => {
  form.value = { ...v };
  dialogFormVisible.value = true;
};
// 状态过滤处理
const create = () => {
  form.value = {};
  dialogFormVisible.value = true;
};

const onSubmit = async () => {
  if(form.value.id) {
    await tagAPI.modifyTag({ ...form.value });
  } else {
    await tagAPI.createTag({ ...form.value });
  }
  dialogFormVisible.value = false;
  ElMessage.success(form.value.id ? '新增成功' : "修改成功");
  initData();
};


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
</style>