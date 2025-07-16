<template>
  <div class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="$t('home.invite')"
      fixed
      placeholder
      :border="false"
      @click-left="onClickLeft">
    </van-nav-bar>
    <main>
      <div class="myInfo">
        <div class="top">
          <img class="icon" src="../../assets/images/invitedIcon.png" alt="">
          {{ info.levelName }}
          <div class="toUp" @click="toPage">
            {{ $t('home.toUpgrade') }} <img src="../../assets/images/rightArrow-e0f.svg" alt="">
          </div>
        </div>
        <div class="middle">
          <div class="item">
            <p class="title">{{ $t('home.totalInvite') }}</p>
            <p class="label">{{ info.totalInvite || 0 }}</p>
          </div>
          <div class="item">
            <p class="title">{{ $t('home.directInvite') }}</p>
            <p class="label">{{ info.directInvite || 0 }}</p>
          </div>
        </div>
        <div class="middle">
          <div class="item">
            <p class="title">{{ $t('home.totalInviteNode') }}</p>
            <p class="label">{{ info.publicNode || 0 }}</p>
          </div>
          <div class="item">
            <p class="title">{{ $t('home.directInviteSuperNode') }}</p>
            <p class="label">{{ info.superNode || 0 }}</p>
          </div>
        </div>
        <div class="bottom">
          <div class="label">{{ $t('home.inviteLink') }}</div>
          <div class="invitedInfo">
            <div class="link">{{ url }}</div>
            <van-button
              class="button"
              type="primary"
              round
              @click="onCopy"
              >{{ $t('button.copy') }}</van-button
            >
          </div>
        </div>
      </div>
      <div class="myInvitedInfo">
        <div class="row">
          <p class="key">{{ $t('home.myInviter') }}</p>
          <p class="value">{{ web3Store.formatAddress(info.inviterAddress) || '--' }}</p>
        </div>
        <div class="row">
          <p class="key">{{ $t('home.invitationTime') }}</p>
          <p class="value">{{ formatTime(info.createdAt) }}</p>
        </div>

      </div>
      <div class="myInvitedInfo">
        <div class="title">{{ $t('home.directInvite') }}</div>
        <van-list
        :loading="loadingStore['web3/fetchInvitationDirect']"
        :finished="finished"
        :finished-text="$t('tips.notMore')"
        @load="() => fetchList(false)"
      >
        <div v-for="item of list" :key="item.ethAddress" class="row">
          <p class="value">{{ web3Store.formatAddress(item.ethAddress) }}</p>
          <p class="value">{{ formatTime(item.createdAt) }}</p>
        </div>
    
    </van-list>
      </div>
    </main>
    <Tabbar nowUrl="/home" />
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import Tabbar from "../../components/Tabbar.vue";
import { useRouter } from "vue-router";
import { useWeb3Store, useLoadingStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { showToast } from "vant";

const { t : $t } = useI18n()

const router = useRouter();
const web3Store = useWeb3Store()
const loadingStore = useLoadingStore()

const url = ref('')
const info = ref({})
const list = ref([])
const finished = ref(false)

const pages = reactive({
  page: 0,
  size: 20,
})

const onClickLeft = () => history.back();

const init = async () => {
  const data = await web3Store.fetchInvitationInfo()
  url.value = location.host + '/?inviteCode=' + data.inviteCode
  info.value = data
}

const fetchList = async () => {
  pages.page += 1
  const records = await web3Store.fetchInvitationDirect({
    ...pages
  })
  list.value = [...list.value, ...records]
  if(records.length < pages.size)
    finished.value = true
}

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(url.value)
    showToast($t('tips.copySuccess'))
  } catch (err) {
    alert('复制失败: ' + err)
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

init()

const toPage = (path) => {
  showToast($t('tips.notOpen'))
  return
  router.push({ path });
}

</script>
<style lang="scss" scoped>
@import url("./index.scss");
</style>