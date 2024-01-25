<template>
<div class="filter" @click="changeStatus">
  <input type="checkbox"
         checked
         ref="checkbox"
         @click="changeStatus">
  {{caption}}
</div>
</template>

<script>
export default {
  name: "HelicorderFilter",
  props: {
    modelValue: Boolean,
    backgroundColor: String,
    caption: String,
  },
  methods: {
    changeStatus() {
      this.$refs.checkbox.checked = !this.$refs.checkbox.checked
      this.$emit('update:modelValue', this.$refs.checkbox.checked)
    }
  }
}
</script>

<style scoped>
.filter{
  cursor: pointer;
  user-select: none;
  background-color: v-bind(backgroundColor);
  width: fit-content;
  padding: 5px 10px;
}
</style>