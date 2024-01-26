<template>
<div class="filter" @click="changeStatus">
  <input type="checkbox"
         checked
         ref="checkbox"
         @click="changeStatus">
  <div class="filter-caption">
    {{caption}}
  </div>
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
  display: flex;
  flex-direction: row;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  background-color: v-bind(backgroundColor);
  width: fit-content;
  padding: 5px 10px;
}
</style>