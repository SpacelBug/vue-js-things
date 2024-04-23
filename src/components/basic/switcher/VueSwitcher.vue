<template>
  <div id="VueSwitcher">
    <div class="switcher-body">
      <div :class="['switcher-track', {'switcher-track-active': modelValue}]" ref="track">
        <div
            :class="['switcher-caret', {'active-caret': modelValue}]"
            @click="onCaretClick"
            ref="caret"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VueSwitcher",
  props: {
    modelValue: {type: Boolean},

    backgroundColor: {type: String, default: 'grey'},
    activeBackgroundColor: {type: String, default: 'darkgrey'},
    caretColor: {type: String, default: 'darkgrey'},
    activeCaretColor: {type: String, default: 'whitesmoke'},
    border: {type: String, default: 'none'},
    boxShadow: {type: String, default: 'none'},
  },
  mounted() {
    if (this.modelValue === null) {
      this.$emit('update:modelValue', false)
    }
  },
  computed: {
    caretPos() {
      let trackPadding = window.getComputedStyle(this.$refs.track, null).getPropertyValue('padding-left')
      let offset = this.$refs.track.offsetWidth - this.$refs.caret.offsetWidth - Number(trackPadding.replace('px', '')) + 'px'

      return !this.modelValue ? trackPadding : offset
    }
  },
  methods: {
    onCaretClick() {
      this.$emit('update:modelValue', !this.modelValue)
    }
  }
}
</script>

<style scoped>
.switcher-body{
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
}
.switcher-track{
  position: relative;
  display: flex;
  flex-direction: row;
  width: 60px;
  height: 30px;
  padding: 2px;
  border-radius: 30px;
  background-color: v-bind(backgroundColor);
  align-items: center;
  transition: all 0.3s ease;
}
.switcher-track-active{
  background-color: v-bind(activeBackgroundColor);
}
.switcher-caret{
  cursor: pointer;
  position: absolute;
  background-color: v-bind(caretColor);
  border: v-bind(border);
  box-shadow: v-bind(boxShadow);
  height: 30px;
  width: 30px;
  border-radius: 50%;
  transition: all 0.3s ease;
  left: v-bind(caretPos);
}
.active-caret{
  background-color: v-bind(activeCaretColor);
}
</style>