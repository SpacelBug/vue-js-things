<template>
  <transition name="fade">
    <div
        v-if="isShow"
        id="ContextMenu"
        tabindex="0"
        :style="`${posStringHorizontal}; ${posStringVertical}`"
        ref="contextMenu"
        @focusout="hideContextMenu"
    >
      <slot/>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ContextMenu",
  props: {
    backgroundColor: {type: String, default: 'grey'},
    border: {type: String, default: 'none'},
    boxShadow: {type: String, default: 'none'},
  },
  data() { return {
    isShow: false,
    posStringHorizontal: '',
    posStringVertical: '',
  }},
  methods: {
    async showContextMenu() {
      await (this.isShow = true)
      this.posStringHorizontal = ''
      this.posStringVertical = ''

      if (this.drawDirection().horizontalDirection === "toLeft") {
        this.posStringHorizontal = `left: ${event.pageX}px`
      } else {
        this.posStringHorizontal = `right: ${window.innerWidth - event.pageX}px`
      }

      if (this.drawDirection().verticalDirection === "toBottom") {
        this.posStringVertical = `bottom: ${window.innerHeight - event.pageY}px`
      } else {
        this.posStringVertical = `top: ${event.pageY}px`
      }

      this.$refs.contextMenu.focus({preventScroll: true})
    },
    drawDirection() {
      let verticalDirection = event.clientY > (window.innerHeight / 2) ? 'toBottom' : 'toTop'
      let horizontalDirection = event.clientX < (window.innerWidth / 2) ? 'toLeft' : 'toRight'

      return ({'verticalDirection': verticalDirection, 'horizontalDirection': horizontalDirection})
    },
    hideContextMenu() {
      this.isShow = false
    }
  }
}
</script>

<style scoped>
#ContextMenu{
  position: absolute;
  outline: none;
  background-color: v-bind(backgroundColor);
  border: v-bind(border);
  box-shadow: v-bind(boxShadow);
  padding: 16px 32px 16px 16px;
}
</style>