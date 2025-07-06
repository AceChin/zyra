<template>
    <Popup :visible="visible" :onClose="onClose">
      <template #default>
        <div class="popupContent">
          
          <div class="title">{{ $t('home.plsInvited') }}</div>
          <TuppuInput
            v-model="code"
            :style="{margin: '0.6rem 0', borderColor: 'var(--van-primary-color)'}"
            :placeholder="$t('home.plsInvited')"  />
          <van-button
            class="button"
            type="primary"
            :loading="loading"
            :disabled="code.length < 4"
            round
            @click="onSureInvitedCode">{{ $t('button.sure') }}</van-button>
        </div>
      </template>
    </Popup>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWeb3Store } from '@/stores'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  onClose: {
    type: Function,
    default: () => {},
  },
  cb: {
    type: Function,
    default: () => {},
  },
})

const { t : $t, locale } = useI18n()
const web3Store = useWeb3Store()

const code = ref('')

const onSureInvitedCode = () => {
  web3Store.setInviteCode(code.value)
  props.cb()
}

</script>

<style scoped>
 @import url("../pages/assets/index.scss");
</style>