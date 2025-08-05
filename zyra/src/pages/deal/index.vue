<template>
  <div class="page">
    <van-nav-bar safe-area-inset-top fixed placeholder :border="false">
      <template #left>
        <p class="leftNav">TPU/USDT</p>
      </template>
      <template #right>  
        <div class="rightNav">
          <div class="item">
            <p class="title">24h均价</p>
            <p class="content">1.29</p>
          </div>
          <div class="item">
            <p class="title">24h涨跌</p>
            <p class="content">-0.01 (-1%)</p>
          </div>
        </div>
      </template>
    </van-nav-bar>
    <main>
      <div class="table">
        <div class="row firstRow">
          <div>价格 USDT</div>
          <div>数量 TPU</div>
          <div>价值 USDT</div>
        </div>
        <div class="row origin">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
        <div class="row origin">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
        <div class="row origin">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
        <div class="row origin">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
        <div class="row origin">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
      </div>

      <div class="nowTitle">最新价 <p class="price">1.21</p></div>

      <div class="table" :style="{margin: 0}">
        <div class="row firstRow">
          <div>价格 USDT</div>
          <div>数量 TPU</div>
          <div>价值 USDT</div>
        </div>
        <div class="row primary">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
        <div class="row primary">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
        <div class="row primary">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
        <div class="row primary">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
        <div class="row primary">
          <div>1.2411</div>
          <div>1.241</div>
          <div>1.2398</div>
        </div>
      </div>

      <div class="tabs">
        <van-button
          class="button"
          v-bind="status == 'buy' ? buyButton : defineButton"
          @click="() => changeStatus('buy')">
          买入
        </van-button>
        <van-button
          class="button"
          v-bind="status == 'sell' ? sellButton : defineButton"
          @click="() => changeStatus('sell')">卖出</van-button>
        <div class="historyBtn" @click="toRecord">交易历史</div>
        
      </div>

      <div v-if="status == 'buy'" class="sureBuy">
        <div class="label"><p>价格</p><p>1.21</p></div>
        <TuppuInput
          v-model="price"
          :style="{marginBottom: '10px'}"
          placeholder="0"
          suffix="USDT" />
        <div class="label"><p>数量</p><p>可用 200USDT</p></div>
        <TuppuInput
          v-model="value"
          :style="{marginBottom: '10px'}"
          placeholder="最少买入5"
          suffix="PTU" />
        <div class="label"><p>总价</p><p>费率</p></div>
        <van-button
          class="button"
          type="primary">确认买入</van-button>
      </div>

      <div v-else class="sureBuy">
        <div class="label"><p>价格</p><p>1.21</p></div>
        <TuppuInput
          v-model="price"
          :style="{marginBottom: '10px'}"
          placeholder="0"
          suffix="USDT" />
        <div class="label"><p>数量</p><p>可用 200USDT</p></div>
        <TuppuInput
          v-model="value"
          :style="{marginBottom: '10px'}"
          placeholder="最少买入5"
          suffix="PTU" />
        <div class="label"><p>总价</p><p>费率</p></div>
        <van-button
          class="button"
          @click="sureSell"
          color="#FF6600">确认卖出</van-button>
      </div>

    </main>
    <Tabbar nowUrl="/home" />
    <Confirm ref="confirm" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import Tabbar from '../../components/Tabbar.vue';
import TuppuInput from '../../components/TuppuInput.vue';
import Confirm from '../../components/Confirm.vue'

const router = useRouter();

const silder = ref(null)
const confirm = ref(null)
const price = ref(0)
const value = ref('')
const status = ref('buy')

const defineButton = {
  plain: false,
  color: "#333333",
}

const buyButton = {
  plain: true,
  type: "primary"
}

const sellButton = {
  plain: true,
  color: '#FF6600'
}

const changeStatus = (v) => {
  status.value = v
}
const openMenu = () => {
  silder.value.open()
}

const sureSell = async () => {
  console.log(1)
  // await confirm.value.open($t('tips.changeNetWork'))
  console.log(2)
}

const toRecord = () => {
  router.push({ path: '/deal/record' });
}

</script>
<style lang="scss" scoped>
@import url('./index.scss');
</style>