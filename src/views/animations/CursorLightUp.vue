<template>
  <div class="spy-box" ref="spyBox">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "SpyAnimation",
  props: {
    lightColor: {type: String, default: 'rgba(44,44,44,0.6)'},
    spread: {type: Number, default: 4}
  },
  data() { return {

  }},
  mounted() {
    document.body.addEventListener('mousemove', this.getMousePosition)
  },
  unmounted() {
    document.body.removeEventListener('mousemove', this.getMousePosition)
  },
  methods: {
    cursorRelativeElement(cursorClientX, cursorClientY, target) {
      let position = {right: false, left: false, top: false, bottom: false}
      let positionArr = []

      position.top = cursorClientY < target.getBoundingClientRect().top
      position.right = cursorClientX > target.getBoundingClientRect().right
      position.bottom = cursorClientY > target.getBoundingClientRect().bottom
      position.left = cursorClientX < target.getBoundingClientRect().left

      for (let key in position) {
        if (position[key]) {
          positionArr.push(key)
        }
      }

      return positionArr.length !== 0 ? positionArr : ['inside']
    },
    getMousePosition() {
      let blurRadius = 2

      let left = this.cursorRelativeElement(event.clientX, event.clientY, this.$refs.spyBox).includes('left')
      let top = this.cursorRelativeElement(event.clientX, event.clientY, this.$refs.spyBox).includes('top')
      let bottom = this.cursorRelativeElement(event.clientX, event.clientY, this.$refs.spyBox).includes('bottom')
      let right = this.cursorRelativeElement(event.clientX, event.clientY, this.$refs.spyBox).includes('right')

      let offsetY = top ? this.spread : bottom ? -this.spread : 0
      let offsetX = left ? this.spread : right ? -this.spread : 0

      this.$refs.spyBox.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px ${this.spread}px ${this.lightColor}`
    },
  }
}
</script>

<style scoped>
.spy-box{
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
  padding: 16px 16px;
  background-color: #ad1010;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  transition: all 0.5s ease;
  overflow: hidden;
}
</style>