<template>
  <h4>{{chartCaption}}</h4>
  <div ref="target"
       class="main-container"
       @mouseenter="$refs.cursor.style.visibility = 'visible'"
       @mouseleave="$refs.cursor.style.visibility = 'hidden'">
    <svg v-if="type === 'svg'" :width="width" :height="height" ref="svg" class="svg-container"/>
    <div v-else :width="width" :height="height" ref="canvas-box" class="canvas-container"/>
    <div :class="['cursor', {'stretching-cursor': cursorIsStretching}]" ref="cursor"></div>
  </div>
  <div>Current time: {{cursorDateTime}}</div>
</template>

<script>
import * as d3 from 'd3'
import * as fc from 'd3fc'

export default {
  name: "HelicorderVue",
  props: {
    chartData: Array,
    samplingRate: Number,
    minutesInARow: Number,
    startDateTime: new Date(),
    xName: {type: String, default: 'x'},
    yName: {type: String, default: 'y'},

    width: {type: Number, default: 400},
    height: {type: Number, default: 500},
    type: {type: String, default: 'svg'},
    chartCaption: {type: String, default: 'TimeSeriesChart'},
    chartStrokeColor: {type: String, default: '#5185b9'},
  },
  data() { return {
      secondInCursor: null,

      activeLine: null,
      currentLineIndex: null,

      cursorPosX: null,
      cursorPosY: 0,

      cursorStartPosX: null,
      cursorStartPosY: null,
      cursorEndPosX: null,
      cursorStartLineIndex: null,
      cursorIsStretching: false,
      cursorWidth: null,

      loadedObservation: null,
    }
  },
  computed: {
    cursorDateTime() {
      let date = new Date(this.startDateTime)

      date.setSeconds(date.getSeconds() + Math.round(this.secondInCursor))

      return date
    },
    slicedData() {
      let data = []

      let startIndex = 0
      let endIndex = 0

      let sliceRange = this.minutesInARow * 60 * this.samplingRate

      for (let index of [...Array(Math.floor(this.chartData.length / sliceRange)).keys()]) {
        endIndex += sliceRange
        data.push(this.chartData.slice(startIndex, endIndex))
        startIndex = endIndex
      }
      if ((this.chartData.length % sliceRange) !== 0) {
        data.push(this.chartData.slice(startIndex, this.chartData.length))
      }

      return data
    },
    lineHeight() {
      return Math.floor(this.height / this.slicedData.length)
    },
    cursorForm() {
      /***
       * Задает параметры для формы курсора с помощью метода observationClipPath()
       */
      return this.observationClipPath(this.cursorStartPosX, this.cursorPosX)
    }
  },
  mounted() {
    this.plot()
    this.loadedObservation = this.loadObservation()
  },
  methods: {
    observationClipPath(startPos, endPos) {
      /***
       * Возвращает строку определяющую форму маркера наблюдения для css свойства clip-path
       */
      let clipPath = [
          `0px ${this.lineHeight}px`,
          `${startPos}px ${this.lineHeight}px`,
          `${startPos}px 0px`,

          `100% 0px`,

          `100% calc(100% - ${this.lineHeight}px)`,
          `${endPos}px calc(100% - ${this.lineHeight}px)`,
          `${endPos}px 100%`,

          `0px 100%`
      ]

      return clipPath.join(',')
    },
    loadObservation() {
      let startDateTime = new Date(this.startDateTime)
      let endDateTime = new Date(this.startDateTime)
      startDateTime.setSeconds(startDateTime.getSeconds() + 3000)
      endDateTime.setSeconds(startDateTime.getSeconds() + 5000)

      let listOfObservations = [
          {startDateTime: startDateTime, endDateTime: endDateTime}
      ]

      let filteredObservationsList = []

      for (let observation of listOfObservations) {
        if ((observation.startDateTime.getTime() > this.startDateTime) && (observation.endDateTime.getTime() > this.startDateTime)) {
          filteredObservationsList.push(observation)
        }
      }

      return filteredObservationsList
    },
    async plot() {

      let index = 0

      let promises = [...Array(this.slicedData.length).keys()].map(async (index)=>{

        setTimeout(async ()=> {
          if (this.type === 'svg') {
            await this.drawSvgLine(this.slicedData[index], index)
          } else if (this.type === 'canvas') {
            await this.drawCanvasLine(this.slicedData[index], index)
          } else if (this.type === 'webgl') {
            await this.drawWebGlLine(this.slicedData[index], index)
          }
        }, 0)

      })

      await Promise.all(promises)


    },
    async drawCanvasLine(data, index) {
      let xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.width / ((this.minutesInARow * 60 * this.samplingRate) / data.length)])
      let yScale = d3.scaleLinear()
            .domain(d3.extent(data))
            .range([this.lineHeight, 0])

      let canvas = d3.select(this.$refs["canvas-box"]).append('canvas')
          .attr('width', this.width)
          .attr('height', this.lineHeight)
          .on('mousemove', (()=>{
            this.secondInCursor = xScale.invert(d3.pointer(event)[0]) * 1 / this.samplingRate * (index + 1)

            this.cursorPosX = d3.pointer(event)[0]
            this.cursorPosY = this.lineHeight * (index)

            if ((this.cursorStartLineIndex <= (index + 1)) && this.cursorIsStretching) {

              let cursorHeight = this.cursorStartLineIndex !== index + 1 ?
                  this.lineHeight * ((index + 2) - this.cursorStartLineIndex) : this.lineHeight

              this.$refs.cursor.style.height = `${(Math.abs(cursorHeight))}px`
            }
          }))
          .on('mousedown', (()=>{
            this.cursorStartLineIndex = index + 1
            this.cursorStartPosY = this.lineHeight * (index)
            this.cursorIsStretching = true
            this.cursorStartPosX = d3.pointer(event)[0]
          }))
          .on('mouseup', (()=>{
            this.cursorIsStretching = false
            this.cursorWidth = null
            this.cursorEndPosX = d3.pointer(event)[0]
            this.$refs.cursor.style.height = `${this.lineHeight}px`
          }))
          .node()

      let ctx = canvas.getContext('2d')

      let line = fc.seriesCanvasLine()
          .mainValue(d => d)
          .crossValue((_, i) => i)
          .xScale(xScale)
          .yScale(yScale)
          .context(ctx)
          .decorate((context, datum, index) => {
              context.strokeStyle = this.chartStrokeColor;
          })


      line(data)
    }
  }
}
</script>

<style scoped>
.main-container{
  position: relative;
  height: v-bind(height + 'px');
}
.svg-container{
  display: flex;
  flex-direction: column;
}
.canvas-container{
  display: flex;
  flex-direction: column;
}
.cursor{
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  top: v-bind(cursorPosY + 'px');
  left: v-bind(cursorPosX + 'px');
  height: v-bind(lineHeight + 'px');
  width: 2px;
  background-color: rgba(91, 68, 68, 0.62);
}
.stretching-cursor{
  width: 100%;
  top: v-bind(cursorStartPosY + 'px');
  left: 0;
  clip-path: polygon(v-bind(cursorForm));
}
</style>