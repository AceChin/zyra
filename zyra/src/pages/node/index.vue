<template>
  <div class="page">
    <img class="bg" src="@/assets/images/nodeBg.png" alt="">
    <van-nav-bar safe-area-inset-top fixed :border="false"></van-nav-bar>
    <main>
      <img class="logo" src="@/assets/images/logo.png" mode="widtnFix" />
      <div class="mainTitle">{{ nodeInfo.title || '' }}</div>
      <div class="date">{{ nodeStore.dateRang() }}</div>
      <div v-if="nodeStore.nodeList.length > 0" class="nodeBox">
        <img class="boxBg" src="@/assets/images/nodeBox.png" mode="widtnFix" />

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
            <div class="infoTitle">
              {{ nodeContent.name }}
              <span v-if="nodeContent.stock" style="color: #94A3C6">
                ({{ nodeContent.total - nodeContent.stock }}/{{ nodeContent.total }})
              </span>
            </div>

            <div class="content" >
              <div class="label">权益:</div>
              {{ nodeContent.content }}
            </div>
            <!-- <div class="progress">
              <div class="step" :style="`width: ${ progress }%`"></div>
            </div> -->

        </div>
        <van-button
          v-if="nodeContent.id"
          class="bottomButton"
          type="primary"
          :loading="loadingStore['node/buyNode']"
          :disabled="nodeContent.maxPerUser <= nodeContent.bought"
          @click="buyNode">
          {{ $t('tips.buyNodeTips', { price: nodeContent.price || 0 }) }}
        </van-button>
        
      </div>
    </main>
    <Tabbar nowUrl="" />
    <LayoutSilder ref="silder" :onChangeLanguage="changeLangue" />
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
import { showToast } from 'vant';
const { t : $t, locale } = useI18n()

const defineButton = {
  // type: "primary",

}

const selectButton = {
  type: "primary",
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
const id = ref('')

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
const init = async (id) => {
  await nodeStore.fetchNodeTypes()
  await nodeStore.fetchNodeDetail()
  changeStatus(id || nodeStore.nodeList[0]?.id)
}

const openMenu = () => {
  silder.value.open()
}

const buyNode = async () => {
  await confirm.value.open($t('tips.sureBuy', { name: nodeContent.value.name }))
  try {
    await nodeStore.buyNode({ nodeSaleItemId: status.value })
    showToast($t('tips.buySuccess'))
    web3Store.fetchUserInfo()
  } catch(e) {
    if(e.code == 400) {
      await confirm.value.open($t('tips.insufficientBalance'))
      window.needCharge = true
      router.push('/assets')
    }
    console.log(e.code)
  }
  init(nodeContent.value.id)
}

onMounted(async () => {
  init()
})

</script>
<style lang="scss" scoped>
@import url('./index.scss');
</style>