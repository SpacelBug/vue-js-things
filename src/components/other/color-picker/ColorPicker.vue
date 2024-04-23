<template>
  <div
      id="ColorPicker"
      tabindex="0"
      @focusin="isShowPalette = true"
      @focusout="isShowPalette = false"
  >
    <div class="color-picker-main-button">
      <div v-if="modelValue" class="selected-color"></div>
      <div v-else class="place-holder">Select color</div>
    </div>

    <div v-show="isShowPalette" class="color-picker-main-box">
      <div class="color-picker-main-box-brightness">
        <div class="brightness-cursor"/>
        <canvas
            ref="brightnessCanvas"
            width="300"
            height="300"
            @click="canvasBrightnessClick"
            @mousedown="isMouseDown = true"
            @mouseup="isMouseDown = false"
            @mouseleave="isMouseDown = false"
            @mousemove="canvasBrightnessMove"
        />
      </div>

      <div class="color-picker-main-box-hue">
        <div class="hue-caret"/>
        <canvas
            ref="hueCanvas"
            width="300"
            height="20"
            @click="canvasHueClick"
            @mousedown="isMouseDown = true"
            @mouseup="isMouseDown = false"
            @mouseleave="isMouseDown = false"
            @mousemove="canvasHueMove"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorPicker",
  props: {
    modelValue: {require: true, validator(value) {
        return /^rgba\((\d{1,3},\s*){3}\d{1,3}\)$/.test(value)
    }},

    placeholder: {type: String, default: 'Select color'},

    backgroundColor: {type: String, default: 'grey'},
    activeColor: {type: String, default: 'lightgrey'},
    border: {type: String, default: 'none'},
    boxShadow: {type: String, default: 'none'},
  },
  data() { return {
    isMouseDown: false,
    isShowPalette: false,

    hueColor: 'red',

    brightnessCursorPos: [0,0],
    hueCaretPos: [0,0],
  }},
  updated() {
    this.setBrightnessCanvasBackground()
    this.setColorCanvasBackground()
  },
  methods: {
    setBrightnessCanvasBackground() {
      let context = this.$refs.brightnessCanvas.getContext('2d')
      let canvasHeight = this.$refs.brightnessCanvas.getBoundingClientRect().height
      let canvasWidth = this.$refs.brightnessCanvas.getBoundingClientRect().width

      context.clearRect(0, 0, this.$refs.brightnessCanvas.width, this.$refs.brightnessCanvas.height);
      context.globalCompositeOperation = "multiply"

      let firstGradient = context.createLinearGradient(0, canvasHeight / 2, canvasWidth, canvasHeight / 2)
      firstGradient.addColorStop(0, 'white')
      firstGradient.addColorStop(1, this.hueColor)
      let secondGradient = context.createLinearGradient(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight)
      secondGradient.addColorStop(0, 'white')
      secondGradient.addColorStop(1, 'black')

      context.fillStyle = firstGradient
      context.fillRect(0, 0, canvasWidth, canvasHeight)
      context.fillStyle = secondGradient
      context.fillRect(0, 0, canvasWidth, canvasHeight)
    },
    setColorCanvasBackground() {
      let context = this.$refs.hueCanvas.getContext('2d')
      let canvasHeight = this.$refs.hueCanvas.getBoundingClientRect().height
      let canvasWidth = this.$refs.hueCanvas.getBoundingClientRect().width

      let gradient = context.createLinearGradient(0, canvasHeight / 2, canvasWidth, canvasHeight / 2)
      let gradientColors = ['red' ,'orange' ,'yellow' ,'green' ,'aqua' ,'blue' ,'purple']
      for (let index in gradientColors) {
        gradient.addColorStop(index/gradientColors.length, gradientColors[index])
      }

      context.fillStyle = gradient
      context.fillRect(0, 0, canvasWidth, canvasHeight)
    },
    canvasBrightnessClick() {
      this.getCanvasBrightnessColor(event.offsetX, event.offsetY)
    },
    canvasBrightnessMove() {
      if (this.isMouseDown) {
        this.getCanvasBrightnessColor(event.offsetX, event.offsetY)
      }
    },
    canvasHueClick() {
      this.getCanvasHueColor(event.offsetX, event.offsetY)
    },
    canvasHueMove() {
      if (this.isMouseDown) {
        this.getCanvasHueColor(event.offsetX, event.offsetY)
      }
    },
    getCanvasBrightnessColor(offsetX, offsetY) {
      this.brightnessCursorPos = [offsetX, offsetY]

      this.$emit('update:modelValue', this.getColorFromCanvas(this.$refs.brightnessCanvas, offsetX, offsetY))
    },
    getCanvasHueColor(offsetX, offsetY) {

      this.hueCaretPos = [offsetX, offsetY]

      this.hueColor = this.getColorFromCanvas(this.$refs.hueCanvas, offsetX, offsetY)

      this.setBrightnessCanvasBackground()
      this.getCanvasBrightnessColor(this.brightnessCursorPos[0], this.brightnessCursorPos[1])
    },
    getColorFromCanvas(target, offsetX, offsetY) {
      let context = target.getContext('2d')
      offsetY = offsetY === target.height ? offsetY - 1 : offsetY

      let red = context.getImageData(offsetX, offsetY, 1, 1).data[0]
      let green = context.getImageData(offsetX, offsetY, 1, 1).data[1]
      let blue = context.getImageData(offsetX, offsetY, 1, 1).data[2]
      let alpha  = context.getImageData(offsetX, offsetY, 1, 1).data[3]

      return `rgba(${red}, ${green}, ${blue}, ${alpha})`
    },
  }
}
</script>

<style scoped>
#ColorPicker{
  position: relative;
  height: auto;
}
.color-picker-main-button{
  display: flex;
  flex-direction: row;
  background-color: v-bind(backgroundColor);
  padding: 8px 16px;
  width: fit-content;
  gap: 8px;
}
.selected-color{
  width: 25px;
  aspect-ratio: 1/1;
  background-color: v-bind(modelValue);
}
.color-picker-main-box{
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: v-bind(backgroundColor);
  left: 0;
}
.color-picker-main-box-brightness{
  position: relative;
  height: 300px;
  width: 300px;
}
.brightness-cursor{
  pointer-events: none;
  position: absolute;
  left: v-bind(brightnessCursorPos[0] + 'px');
  top: v-bind(brightnessCursorPos[1] + 'px');
  height: 10px;
  width: 10px;
  margin-left: -5px;
  margin-top: -5px;
  background-color: whitesmoke;
  border: solid 1px dimgray;
  border-radius: 50%;
}
.color-picker-main-box-hue{
  position: relative;
  width: 300px;
  height: 20px;
}
.hue-caret{
  pointer-events: none;
  position: absolute;
  left: v-bind(hueCaretPos[0] + 'px');
  height: 20px;
  width: 5px;
  margin-top: -1px;
  background-color: whitesmoke;
  border: solid 1px dimgray;
}
</style>