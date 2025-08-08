<!-- MyInput.vue -->
<template>
  <div class="tuppuInput" :style="style">
    <!-- :value="inputValue" -->
    <!-- @input="$emit('update:modelValue', $event.target.value)" -->
    <van-field
      v-bind="$attrs"
      :model-value="modelValue"
      @update:model-value="onInput"
      :border="false"
      class="input"
    />
  <p class="suffix">{{ $attrs.suffix }}</p>
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  style: {
    type: [String, Object],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const onInput = (value) => {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.tuppuInput {
  display: flex;
  border-radius: 4px;
  border: 1px solid #464F87;
  padding: 8px 12px;
  justify-content: space-between;
  align-items: center;
  background-color: #1E255A;

  .input {
    background-color: transparent;
    border: 0;
    line-height: 1.53rem;
    padding: 0;
    
    input {
      color: #ffffff;
    }
  }
  .input::placeholder {
    font-weight: 600;
    font-size: 1rem;
    color: #7C84A1;
  }

  .suffix {
    font-size: 0.9rem;
    color: #B8B8B8;
  }
}
</style>
