<template>
  <template v-if="['text', 'number'].includes(type)">
    <input :type="type" :value="modelValue" ref="input" @input="$emit('update:modelValue', $refs.input.value)">
  </template>

  <template v-else-if="type === 'select'">
    <select>
      <template v-for="option in options">
        <option v-if="option === modelValue" selected>{{ option }}</option>
        <option v-else @click="$emit('update:modelValue', option)">{{ option }}</option>
      </template>
    </select>
  </template>
</template>

<script>
export default {
  name: "EditableCell",
  props: {
    modelValue: {type: [String, Number, Array]},
    type: {type: String, require: true},
    options: {type: Array, default: null},
  },
}
</script>

<style scoped>
input{
  width: 100%;
  padding: 0;
  border: 0;
  text-align: center;
}
</style>