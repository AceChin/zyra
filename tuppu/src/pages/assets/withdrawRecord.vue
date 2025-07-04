<template>
  <div class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="$t('home.withdrawRecord')"
      fixed
      placeholder
      :border="false"
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <main>
      <van-list
        :loading="loadingStore['assets/fetchWidthDrawRecord']"
        :finished="finished"
        :finished-text="$t('tips.notMore')"
        @load="() => fetchList(false)"
      >
        <div
          v-for="item of list"
          :key="item.id"
          :class="['item', item.direction == 'in' ? '' : 'down']"
        >
          <div class="left">
            <p class="unit">{{ item.token }}</p>
            <p class="type">{{ statusEm[item.status] }}</p>
            <p class="date">{{ formatTime(item.createdAt) }}</p>
          </div>
          <div class="price">{{ item.direction == 'in' ? '+' : '' }}{{ item.amount }}</div>
        </div>
      </van-list>
    </main>
    <van-popup v-model:show="showStartTime" position="bottom">
      <van-date-picker
        :value="startTime"
        @cancel="() => showStartTime = false"
        :columns-type="['year', 'month', 'day']"
        @confirm="sureStartDate"
        :min-date="minDate"
      />
    </van-popup>
    <van-popup v-model:show="showEndTime" position="bottom">
      <van-date-picker
        :value="endTime"
        @cancel="() => showEndTime = false"
        :columns-type="['year', 'month', 'day']"
        @confirm="sureEndDate"
        :min-date="minDate"
      />
    </van-popup>

  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { useAssetsStore, useLoadingStore } from '@/stores'
import Popup from "../../components/Popup.vue";
import { showToast } from "vant";
import { useI18n } from 'vue-i18n'
const { t : $t } = useI18n()

const assetsStore = useAssetsStore()
const loadingStore = useLoadingStore()
const typesb = ref()
const directionb = ref()
const finished = ref(false)
const visible = ref(false)
const showStartTime = ref(false)
const showEndTime = ref(false)
const list = ref([])
const minDate = ref(new Date(2025, 4, 1))
const startTime = ref([])
const endTime = ref([])
const types = ref('')
const direction = ref('')
const pages = reactive({
  page: 1,
  size: 10,
})



const statusEm = {
  pending: $t('status.pending'),
  approved: $t('status.approved'),
  rejected: $t('status.rejected'),
  processing: $t('status.processing'),
  done: $t('status.done'),
  failed: $t('status.failed'),
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


const onClickLeft = () => history.back();

const fetchList = async (init = true) => {
  if(!init) {
    pages.page += 1
  } else{
    pages.page = 1
    finished.value = false
  }
  const { records } = await assetsStore.fetchWidthDrawRecord({
    ...pages,
    types: types.value,
    direction: direction.value,
    startTime: startTime.value.length > 0 ? `${new Date(startTime.value.join('-'))} 00:00:00` : '',
    endTime: endTime.value.length > 0 ? `${new Date(endTime.value.join('-'))} 23:59:59` : '',
  })
  if(init)
    list.value = records
  else
    list.value = [...list.value, ...records]
  if(records.length < pages.size)
    finished.value = true
}

const changeStatus = (v) => {
  types.value = v
  fetchList()
}

const openPopup = () => {
  visible.value = true
}

const sureStartDate = (v) => {
  endTime.value = []
  startTime.value = v.selectedValues
  showStartTime.value = false
}

const sureEndDate = (v) => {
  endTime.value = v.selectedValues
  showEndTime.value = false
}

const onSureRecharge = () => {
  if((startTime.value.length > 0 && endTime.value.length == 0) || (startTime.value.length == 0 && endTime.value.length > 0)){
    showToast($t('tips.completeTime'))
    return
  } else if(startTime.value.length != 0 && (new Date(startTime.value.join('-')) > new Date(endTime.value.join('-')))) {
    showToast($t('tips.completeSureTime'))
    return
  }
  types.value = typesb.value
  direction.value = directionb.value
  visible.value = false
  fetchList()
}

fetchList()

</script>
<style lang="scss" scoped>
@import url("./record.scss");
</style>