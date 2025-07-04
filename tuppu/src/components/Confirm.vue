<template>
  <Modal v-bind="$attrs" :show="show" :onClose="() => {show=false;reject()}">
    <template #default>
      <div class="title">{{ label }}</div>
      <view class="buttonRow">
        <van-button
          class="button"
          type="primary"
          round
          @click="() => {show=false;reslove()}"
          >确认</van-button
        >
        <van-button
          class="button"
          type="primary"
          plain
          round
          @click="() => {show=false;reject()}"
          >取消</van-button
        >
      </view>
    </template>
  </Modal>
</template>
<script setup>
import Modal from "./Modal.vue";
import { ref } from 'vue'

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
}
</style>