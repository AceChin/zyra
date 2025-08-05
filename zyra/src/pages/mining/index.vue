<template>
  <div class="page">
    <header>
    <van-nav-bar safe-area-inset-top left-arrow fixed placeholder :border="false" @click-left="onClickLeft">
      <template #right>  
        <div @click="toRecord" class="recordBtn">
          <img class="date" src="@/assets/images/date.svg" alt="" />
          流水记录
        </div>
      </template>
    </van-nav-bar>
      <div class="acquisition">
        <div class="left">
          <p class="label">累计获取</p>
          <div class="number">
            <img src="" alt="" />
            82,912
          </div>
        </div>
        <div class="right">
          <p class="label">总能量</p>
          <van-circle
            class="circle"
            v-model:current-rate="currentRate"
            :rate="30"
            :speed="100"
            size="35px"
            stroke-width="140"
            layer-color="#979797"
          />
        </div>
      </div>
    </header>
    <main>
      
      <div class="tabs">
        <van-button
          class="button"
          v-bind="status == 'pledge' ? selectButton : defineButton"
          @click="() => changeStatus('pledge')">
          质押挖矿
        </van-button>
        <van-button
          class="button"
          v-bind="status == 'compound' ? selectButton : defineButton"
          @click="() => changeStatus('compound')">合成挖矿</van-button>
      </div>

      <div v-if="status == 'pledge'" class="pledgeInfo">
        <div class="label">总质押：<span class="amount">10,239 TPU</span></div>
        <van-button
          class="button"
          type="primary"
          round
          @click="toPledge">去质押</van-button>
      </div>
      <div v-if="status == 'compound'" class="pledgeInfo">
        <div class="label">累计消耗：<span class="amount">10,239 TPU</span></div>
        <van-button
          class="button"
          type="primary"
          round
          @click="toSynthesis">去合成</van-button>
      </div>

      <div class="content">
        <div class="title">TPU质押挖矿 -1</div>
        <div class="row"><span>质押数量</span> <span>2000</span></div>
        <div class="row"><span>基础算力</span> <span>2000</span></div>
        <div class="row"><span>生效算力</span> <span>2000</span></div>
        <div class="canHide" :style="`height: ${expands['one'] ? '9.3rem' : '0'}`">
          <div class="row"><span>可用能量</span> <span>2000</span></div>
          <div class="row"><span>累计产出</span> <span>2000</span></div>
          <div class="row"><span>生效时间</span> <span>25/07/12</span></div>
          <div class="row"><span>生效天数</span> <span>2000</span></div>
          <div class="buttonRow">
            <van-button
              class="button"
              type="primary"
              plain
              round
              @click="() => changeStatus('compound')">退出质押</van-button>
          </div>

        </div>
        <div class="expand" @click="() => expand('one')">
          <img :class="['expandDownArrow', !expands['one'] || 'spin']" src="@/assets/images/expandDownArrow.svg" alt="" />
        </div>
      </div>
      <div class="content">
        <div class="title">TPU质押挖矿 -2</div>
        <div class="row"><span>质押数量</span> <span>2000</span></div>
        <div class="row"><span>基础算力</span> <span>2000</span></div>
        <div class="row"><span>生效算力</span> <span>2000</span></div>
        <div class="canHide" :style="`height: ${expands['two'] ? '9.3rem' : '0'}`">
          <div class="row"><span>可用能量</span> <span>2000</span></div>
          <div class="row"><span>累计产出</span> <span>2000</span></div>
          <div class="row"><span>生效时间</span> <span>25/07/12</span></div>
          <div class="row"><span>生效天数</span> <span>2000</span></div>
          <div class="buttonRow">
            <van-button
              class="button"
              type="primary"
              plain
              round
              @click="() => changeStatus('compound')">退出质押</van-button>
          </div>

        </div>
        <div class="expand" @click="() => expand('two')">
          <img :class="['expandDownArrow', !expands['two'] || 'spin']" src="@/assets/images/expandDownArrow.svg" alt="" />
        </div>
      </div>  
    </main>
    <Popup :visible="pledgeVisible" :onClose="() => pledgeVisible = false">
      <template #default>
        <div class="popupContent">
          
          <div class="title">请输入TPU数量</div>
          <TuppuInput
            v-model="price"
            :style="{margin: '0.6rem 0', borderColor: 'var(--van-primary-color)'}"
            placeholder="最少 5"
            suffix="USDT" />
          <p class="tips">注：7天之内赎回质押挖矿将扣除20%</p>
          <div class="row"><span>当前价格</span><span>$2.72U</span></div>
          <div class="row"><span>基础算力</span><span>0</span></div>
          <div class="row"><span>生效算力</span><span>2000</span></div>
          <div class="row"><span>获得能量</span><span>0</span></div>
          <div class="row"><span>燃烧TPUA</span><span>20/3021</span></div>

          <van-button
            class="button"
            type="primary"
            round
            @click="onSure">确认</van-button>
        </div>
      </template>
    </Popup>
    <Popup :visible="synthesisVisible" :onClose="() => synthesisVisible = false">
      <template #default>
        <div class="popupContent">
          
          <div class="title">请输入TPU数量</div>
          <TuppuInput
            v-model="price"
            :style="{margin: '0.6rem 0', borderColor: 'var(--van-primary-color)'}"
            placeholder="最少 5"
            suffix="USDT" />
          <p class="tips">注：合成挖矿将消耗全部TPU，不可赎回</p>
          <div class="row"><span>当前价格</span><span>$2.72U</span></div>
          <div class="row"><span>基础算力</span><span>0</span></div>
          <div class="row"><span>生效算力</span><span>2000</span></div>
          <div class="row"><span>获得能量</span><span>0</span></div>
          <div class="row"><span>燃烧TPUA</span><span>20/3021</span></div>

          <van-button
            class="button"
            type="primary"
            round
            @click="onSure">确认</van-button>
        </div>
      </template>
    </Popup>
    <Tabbar nowUrl="/mining" />
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import Tabbar from "../../components/Tabbar.vue";
import Popup from "../../components/Popup.vue";
import { useRouter } from 'vue-router'
import TuppuInput from '../../components/TuppuInput.vue';

const router = useRouter()
const status = ref('pledge')
const currentRate = ref();
const pledgeVisible = ref(false);
const synthesisVisible = ref(false);
const expands =  reactive({})
const price = ref('')

const onClickLeft = () => history.back();

const defineButton = {
  plain: false,
  color: "#333333",
}

const selectButton = {
  plain: true,
  type: "primary"
}


const changeStatus = (v) => {
  status.value = v
}

const expand = (v) => {
  expands[v] = !expands[v]
}

const toRecord = () => {
  router.push('/mining/record')
}

const toPledge = () => {
  pledgeVisible.value = true
}

const toSynthesis = () => {
  synthesisVisible.value = true
}

const onSure = () => {

}

</script>
<style lang="scss" scoped>
@import url("./index.scss");
</style>