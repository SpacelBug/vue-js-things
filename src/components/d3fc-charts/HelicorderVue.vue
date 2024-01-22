<template>
  <h4>{{chartCaption}}</h4>
  <div ref="target"
       class="main-container"
       @mouseenter="$refs.cursor.style.visibility = 'visible'"
       @mouseleave="$refs.cursor.style.visibility = 'hidden'">
    <svg v-if="type === 'svg'" :width="width" :height="height" ref="svg" class="svg-container"/>
    <div v-else :width="width" :height="height" ref="canvas-box" class="canvas-container"/>
    <div :class="['cursor', {'stretching-cursor': cursorIsStretching}]" ref="cursor"></div>
    <div class="observation"
         v-for="observation in loadedObservation"
         :title="`${observation.data.startDateTime} - ${observation.data.endDateTime}`"
         :style="`height: ${observation.params.height}px;
         clip-path: polygon(${observationClipPath(observation.params.leftStart , observation.params.leftEnd)});
         top: ${observation.params.top}px;`"/>
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
      linesInfo: {},

      activeLine: null,
      currentLineIndex: null,

      cursorPosX: null,
      cursorPosY: 0,

      secondInCursor: null,

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
    sliceRange() {
      return this.minutesInARow * 60 * this.samplingRate
    },
    slicedData() {
      let data = []

      let startIndex = 0
      let endIndex = 0

      for (let index of [...Array(Math.floor(this.chartData.length / this.sliceRange)).keys()]) {
        endIndex += this.sliceRange
        data.push(this.chartData.slice(startIndex, endIndex))
        startIndex = endIndex
      }
      if ((this.chartData.length % this.sliceRange) !== 0) {
        data.push(this.chartData.slice(startIndex, this.chartData.length))
      }

      return data
    },
    scales() {
      let scales = []

      for (let data of this.slicedData) {
        let xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.width / ((this.minutesInARow * 60 * this.samplingRate) / data.length)])
        let yScale = d3.scaleLinear()
            .domain(d3.extent(data))
            .range([this.lineHeight, 0])
        scales.push({xScale: xScale, yScale: yScale})
      }

      return scales
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
  async mounted() {
    await this.plot()
    this.loadedObservation = await this.loadObservation()
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
    async loadObservation() {
      let startDateTime = new Date(this.startDateTime)
      let endDateTime = new Date(this.startDateTime)

      let listOfObservations = [
          {data: {startDateTime: new Date(new Date().setSeconds(startDateTime.getSeconds() + 3200)), endDateTime: new Date(new Date().setSeconds(startDateTime.getSeconds() + 4000))}, params: {}},
          {data: {startDateTime: new Date(new Date().setSeconds(startDateTime.getSeconds() + 2950)), endDateTime: new Date(new Date().setSeconds(startDateTime.getSeconds() + 3100))}, params: {}},
      ]

      let filteredObservationsList = []

      for (let observation of listOfObservations) {
        if ((observation.data.startDateTime.getTime() > this.startDateTime) && (observation.data.endDateTime.getTime() > this.startDateTime)) {
          observation.params.startIndexGlobal =  ((observation.data.startDateTime.getTime() - this.startDateTime.getTime()) / 1000) / (1 / this.samplingRate)
          observation.params.endIndexGlobal = ((observation.data.endDateTime.getTime() - this.startDateTime.getTime()) / 1000) / (1 / this.samplingRate)

          let startLine = Math.floor(observation.params.startIndexGlobal / this.sliceRange)
          let endLine = Math.ceil(observation.params.endIndexGlobal / this.sliceRange)

          observation.params.startIndexLine = observation.params.startIndexGlobal % this.sliceRange
          observation.params.endIndexLine =  observation.params.endIndexGlobal % this.sliceRange

          observation.params.height = (endLine - startLine) * this.lineHeight
          observation.params.top = startLine * this.lineHeight
          observation.params.leftStart = this.scales[startLine].xScale(observation.params.startIndexLine)
          observation.params.leftEnd = this.scales[endLine].xScale(observation.params.endIndexLine)

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

      let canvas = d3.select(this.$refs["canvas-box"]).append('canvas')
          .attr('width', this.width)
          .attr('height', this.lineHeight)
          .on('mousemove', (()=>{
            this.secondInCursor = (Math.round(this.scales[index].xScale.invert(d3.pointer(event)[0])) + ((index) * this.sliceRange)) * (1 / this.samplingRate)

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
          .xScale(this.scales[index].xScale)
          .yScale(this.scales[index].yScale)
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
.observation{
  position: absolute;
  width: 100%;
  background-color: rgba(30, 255, 109, 0.21);
}
.observation:hover{
  background-color: rgba(30, 255, 109, 0.5);
}
</style>