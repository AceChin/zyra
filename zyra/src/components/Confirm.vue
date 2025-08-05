<template>
  <Modal v-bind="$attrs" :hideClose="oneButton" :show="show" :onClose="() => {show=false;reject()}">
    <template #default>
      <div class="title">{{ label }}</div>
      <view class="buttonRow">
        <van-button
          :class="['button', oneButton ? 'oneButton' : '']"
          type="primary"
          round
          @click="() => {show=false;reslove()}"
          >{{ $t('button.sure') }}</van-button
        >
        <van-button
          v-if="!oneButton"
          class="button"
          type="primary"
          plain
          round
          @click="() => {show=false;reject()}"
          >{{ $t('button.cancel') }}</van-button
        >
      </view>
    </template>
  </Modal>
</template>
<script setup>
import Modal from "./Modal.vue";
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t : $t } = useI18n()

const props = defineProps({
  oneButton: {
    type: Boolean,
    default: false
  }
})

const label = ref('')
const reslove = ref()
const reject = ref()
const show = ref(false)

const open = (v) => {
  return new Promise((rel, rej) => {
    label.value = v
    reslove.value = rel
    reject.value = rej
    show.value = true
  })
}

defineExpose({ open });
</script>
<style lang="scss" scoped>
.title {
  margin-top: 20px;
  text-align: center;
}
.buttonRow {
  width: 100%;
  width: 14rem;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 1.6rem;

  .button {
    width: 6.4rem;
    height: 2.33rem;
  }
  .oneButton {
    flex: 1;
  }
}
</style>