<template>
  <div class="page">
    <van-nav-bar safe-area-inset-top fixed placeholder :border="false">
      <template #left>
        <img @click="openMenu" class="menu" src="@/assets/images/menu.svg" />
        <img class="logo" src="@/assets/images/logo.svg" />
      </template>
      <template v-if="!web3Store.accountMask" #right>
        <div class="navRight" @click="connect">
          <p class="title">{{ $t('button.linkWallet') }}</p>
          <div class="connectBtn">
            <img class="connectIcon" src="@/assets/images/connect.svg" alt="" />
          </div>
        </div>
      </template>
      <template v-else #right>
        <div class="navRight" @click.stop="changeLangue">
          <p class="title">{{ web3Store.accountMask || '' }}</p>
          <div class="connectBtn">
            {{ locale.slice(0, 2).toLocaleUpperCase() }}
          </div>
        </div>
      </template>
    </van-nav-bar>
    <main>
      <div class="mainTitle">{{ nodeInfo.titleZh || '' }}</div>
      <div class="date">{{ nodeStore.dateRang() }}</div>

      <div class="tabs">
        <van-button
          v-for="item of nodeStore.nodeList"
          :key="item.id"
          class="button"
          v-bind="status == item.id ? selectButton : defineButton"
          @click="() => changeStatus(item.id)">
          {{ item.name }}
        </van-button>

      </div>

      <div v-if="nodeContent.id" class="nodeInfo">
          <div class="infoTitle">{{ $t('button.realTimePrice') }}
            <span v-if="nodeContent.stock" style="color: #B8B8B8">
              （{{ nodeContent.stock }}/{{ nodeContent.total }}）
            </span>
          </div>

          <div class="content" >
            {{ nodeContent.content }}
          </div>
          <div class="progress">
            <div class="step" :style="`width: ${ progress }%`"></div>
          </div>

          <van-button
            class="button"
            type="primary"
            :loading="loadingStore['node/buyNode']"
            round
            @click="buyNode">
            {{ $t('tips.buyNodeTips', {price: nodeContent.price || 0,bought: nodeContent.bought || 0, maxPerUser: nodeContent.maxPerUser || 0}) }}
            
          </van-button>
      </div>

    </main>
    <Tabbar nowUrl="" />
    <LayoutSilder ref="silder" />
    <Confirm ref="confirm" />
    <Language :visible="languageVisible" :onClose="() => languageVisible = false" :onOk="init" />
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from "vue-router";
import Tabbar from '../../components/Tabbar.vue';
import Confirm from '../../components/Confirm.vue'
import Language from '../../components/Language.vue';
import { useWeb3Store, useNodeStore, useLoadingStore } from '@/stores'
import { useI18n } from 'vue-i18n'
const { t : $t, locale } = useI18n()

const defineButton = {
  plain: false,
  color: "#333333",
}

const selectButton = {
  plain: true,
  type: "primary"
}

const router = useRouter();
const web3Store = useWeb3Store()
const nodeStore = useNodeStore()
const loadingStore = useLoadingStore()

const languageVisible = ref(false)
const silder = ref(null)
const confirm = ref(null)
const status = ref('public')
const nodeContent = ref('')

const nodeInfo = computed(() => nodeStore.nodeInfo)

const connect = async () => {
  await web3Store.connectImTokenWallet()
  web3Store.fetchBalance()
  await web3Store.login()
  web3Store.fetchUserInfo()
}

const changeLangue = () => {
  languageVisible.value = true
}

const progress = computed(() => {
  return (((nodeContent.value.total - nodeContent.value.stock) / nodeContent.value.total)*100).toFixed(2)
})

const changeStatus = (v) => {
  status.value = v
  nodeContent.value = nodeInfo.value.items.find(i => i.id == v)
}
const init = async () => {
  await nodeStore.fetchNodeTypes()
  await nodeStore.fetchNodeDetail()
  changeStatus(nodeStore.nodeList[0]?.id)
}

const openMenu = () => {
  silder.value.open()
}

const buyNode = async () => {
  await confirm.value.open($t('tips.sureBuy', { name: nodeContent.value.name }))
  try {
    await nodeStore.buyNode({ nodeSaleItemId: status.value })
  } catch(e) {
    if(e.code == 400) {
      await confirm.value.open('余额不足，是否需要充值')
      router.push('/assets?needCharge=1')
    }
    console.log(e.code)
  }
  init()
}

onMounted(async () => {
  init()
})

</script>
<style lang="scss" scoped>
@import url('./index.scss');
</style>