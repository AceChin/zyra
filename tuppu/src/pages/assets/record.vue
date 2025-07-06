<template>
  <div class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="$t('home.record')"
      fixed
      placeholder
      :border="false"
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <header>
      <div class="btnRow">
        <van-button
          class="button"
          v-bind="types == '' ? buyButton : defineButton"
          @click="() => changeStatus('')"
        >
          {{ $t('button.all') }}
        </van-button>
        <van-button
          class="button"
          v-bind="types == 'mine' ? buyButton : defineButton"
          @click="() => changeStatus('mine')"
        >
        {{ $t('button.mine') }}
        </van-button>
        <van-button
          class="button"
          v-bind="types == 'charge' ? buyButton : defineButton"
          @click="() => changeStatus('charge')"
        >
        {{ $t('button.charge') }}
        </van-button>
        <van-button
          class="button"
          v-bind="types == 'transfer' ? buyButton : defineButton"
          @click="() => changeStatus('transfer')"
        >
        {{ $t('button.transfer') }}
        </van-button>
        <van-button
          class="button"
          v-bind="types == 'withdraw' ? buyButton : defineButton"
          @click="() => changeStatus('withdraw')"
        >
        {{ $t('button.withdraw') }}
        </van-button>
        <van-button
          class="button"
          v-bind="types == 'reward' ? buyButton : defineButton"
          @click="() => changeStatus('reward')"
        >
        {{ $t('button.reward') }}
        </van-button>

      </div>

      <img class="filtrate" src="../../assets/images/filtrate.png" @click="openPopup" />
    </header>
    <main>
      <van-list
        :loading="loadingStore['assets/fetchAssetsRecord']"
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
            <p class="type">{{ typeEm[item.type] }}</p>
            <p class="date">{{ item.createdTime }}</p>
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

    <Popup :visible="visible" :onClose="() => visible = false">
      <template #default>
        <div class="popupContent">
          
          <div class="title">{{$t('home.timeRange')}}</div>
          <div class="timeRow">
            <div class="timeBox" @click="() => showStartTime = true">
              {{ startTime.join('-') }}
            </div>
            <div class="timeBox" @click="() => showEndTime = true">
              {{ endTime.join('-') }}
            </div>

          </div>
          <div class="title margin">{{$t('home.type')}}</div>
          <van-radio-group v-model="typesb" direction="horizontal">
            <van-radio icon-size="16px" name="">{{$t('button.all')}}</van-radio>
            <van-radio icon-size="16px" name="mine">{{$t('button.mine')}}</van-radio>
            <van-radio icon-size="16px" name="reward">{{$t('button.reward')}}</van-radio>
            <van-radio icon-size="16px" name="charge">{{$t('button.charge')}}</van-radio>
            <van-radio icon-size="16px" name="withdraw">{{$t('button.withdraw')}}</van-radio>
            <van-radio icon-size="16px" name="transfer">{{$t('button.transfer')}}</van-radio>
          </van-radio-group>
          <div class="title margin">{{$t('button.in')}}/{{$t('button.out')}}</div>
          <van-radio-group v-model="directionb" direction="horizontal">
            <van-radio icon-size="16px" name="">{{$t('button.all')}}</van-radio>
            <van-radio icon-size="16px" name="in">{{$t('button.in')}}</van-radio>
            <van-radio icon-size="16px" name="out">{{$t('button.out')}}</van-radio>
          </van-radio-group>
          <van-button
            class="button"
            type="primary"
            round
            @click="onSureRecharge">{{$t('button.sure')}}</van-button>
        </div>
      </template>
    </Popup>


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

const typeEm = {
  charge: $t('button.charge'),
  withdraw: $t('button.withdraw'),
  transfer: $t('button.transfer'),
  reward: $t('button.reward'),
  refund: $t('button.refund'),
  fee: $t('button.withdraw'),
  freeze: $t('button.freeze'),
  unfreeze: $t('button.unfreeze'),
  deduct: $t('button.deduct'),
  mine: $t('button.withdraw'),
}

const defineButton = {
  plain: false,
  color: "#333333",
};

const buyButton = {
  plain: true,
  type: "primary",
};

const onClickLeft = () => history.back();

const fetchList = async (init = true) => {
  if(!init) {
    pages.page += 1
  } else{
    pages.page = 1
    finished.value = false
  }
  const { records } = await assetsStore.fetchAssetsRecord({
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