<template>
    <van-popup :show="visible" @close="onClose" position="bottom">
      <template #default>
        <van-picker
          :title="$t('home.language')"
          :columns="columns"
          @confirm="onConfirm"
          @cancel="onClose"
        />
      </template>
    </van-popup>
</template>
<script setup>
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/es/locale/lang/zh-CN';
import idID from 'vant/es/locale/lang/id-ID';
import zhTW from 'vant/es/locale/lang/zh-TW';
import viVN from 'vant/es/locale/lang/vi-VN';
import thTH from 'vant/es/locale/lang/th-TH';
import koKR from 'vant/es/locale/lang/ko-KR';
import jaJP from 'vant/es/locale/lang/ja-JP';
import { useI18n } from 'vue-i18n'
import { Locale } from 'vant';
import { useWeb3Store } from "@/stores";

const { t : $t, locale } = useI18n()

const web3Store = useWeb3Store();

const columns = [
  { text: $t('home.english'), value: 'en-US' },
  { text: $t('home.chinese'), value: 'zh-CN' },
  { text: $t('home.zhTW'), value: 'zh-TW' },
  { text: $t('home.koKR'), value: 'ko-KR' },
  { text: $t('home.jaJP'), value: 'ja-JP' },
  { text: $t('home.thTH'), value: 'th-TH' },
  { text: $t('home.viVN'), value: 'vi-VN' },
  { text: $t('home.idID'), value: 'id-ID' },
]

const vantLanguage = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'id-ID': idID,
  'zh-TW': zhTW,
  'vi-VN': viVN,
  'th-TH': thTH,
  'ko-KR': koKR,
  'ja-JP': jaJP,
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  onClose: {
    type: Function,
    default: () => {}
  },
  onOk: {
    type: Function,
    default: () => {}
  }
})

const onConfirm = (v) => {
  // console.log(v.selectedValues[0])
  locale.value = v.selectedValues[0]
  localStorage.setItem('language', v.selectedValues[0])
  Locale.use(v.selectedValues[0], vantLanguage[v.selectedValues[0]]);
  web3Store.fetchUserInfo()
  props.onClose()
  props.onOk()
}

</script>
<style lang="scss" scoped>

</style>
