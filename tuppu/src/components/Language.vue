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
import { useI18n } from 'vue-i18n'
import { Locale } from 'vant';

const { t : $t, locale } = useI18n()

const columns = [
  { text: $t('home.chinese'), value: 'zh-CN' },
  { text: "English", value: 'en-US' },
]

const vantLanguage = {
  'en-US': enUS,
  'zh-CN': zhCN,
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
  props.onClose()
  props.onOk()
}

</script>
<style lang="scss" scoped>

</style>
