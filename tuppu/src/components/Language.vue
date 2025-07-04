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

import { useI18n } from 'vue-i18n'

const { t : $t, locale } = useI18n()

const columns = [
  { text: $t('home.chinese'), value: 'zh-CN' },
  { text: "English", value: 'en-US' },
]

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
  props.onClose()
  props.onOk()
}

</script>
<style lang="scss" scoped>

</style>
