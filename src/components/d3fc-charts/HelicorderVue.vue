<template>
  <div class="main-container">
    <div class="graph-header">
      <div class="graph-gain">
        X: <input type="number" v-model="gain" @change="plot()">
      </div>
      <div class="graph-caption">{{chartCaption}}</div>
    </div>
    <div ref="target"
         class="graph-container"
         @mouseenter="$refs.cursor.style.visibility = 'visible'"
         @mouseleave="$refs.cursor.style.visibility = 'hidden'">
      <svg v-if="type === 'svg'" :width="width" :height="height" ref="svg" class="svg-container"/>
      <div v-else :width="width"
           :height="height"
           ref="canvas-box"
           class="canvas-container"/>
      <div :class="['cursor', {'stretching-cursor': cursorIsStretching}]" ref="cursor"></div>
      <div class="observation"
           v-for="observation in processLoadedObservation"
           :title="`${observation.data.startDateTime} - ${observation.data.endDateTime}`"
           :style="`height: ${observation.params.height}px;
           clip-path: polygon(${observationClipPath(observation.params.leftStart , observation.params.leftEnd)});
           top: ${observation.params.top}px;`"
           @click="$emit('observationClick', observation.data)"/>
    </div>
    <div class="graph-side-panel">
      <div class="time-labels">
        <div class="time-label" v-for="(_, index) in slicedData">
          {{ new Date(new Date(startDateTime).setSeconds(startDateTime.getSeconds() + (minutesInARow * 60) * index)).toLocaleString().split(', ')[1] }}
        </div>
      </div>
    </div>
    <div class="graph-footer">
      <div>Current time: {{cursorDateTime}}</div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as fc from 'd3fc'

export default {
  name: "HelicorderVue",
  props: {
    helicorderData: Array,
    loadedObservation: {type: Array, default: []},
    samplingRate: Number,
    minutesInARow: Number,
    startDateTime: new Date(),

    width: {type: Number, default: 400},
    height: {type: Number, default: 500},
    type: {type: String, default: 'svg'},
    chartCaption: {type: String, default: 'Helicorder'},
    chartStrokeColor: {type: String, default: '#5185b9'},
  },
  emits: ['selectObservation', 'observationClick'],
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

      gain: 1,
    }
  },
  computed: {
    cursorDateTime() {
      /***
       * Время в текущей позиции курсора
       */
      let date = new Date(this.startDateTime)

      date.setSeconds(date.getSeconds() + Math.round(this.secondInCursor))

      return date
    },
    sliceRange() {
      /***
       * Количество точек в одной полосе
       */
      return this.minutesInARow * 60 * this.samplingRate
    },
    slicedData() {
      /***
       * Нарезает массив данных на полосы
       */
      let data = []

      let startIndex = 0
      let endIndex = 0

      for (let index of [...Array(Math.floor(this.helicorderData.length / this.sliceRange)).keys()]) {
        endIndex += this.sliceRange
        data.push(this.helicorderData.slice(startIndex, endIndex))
        startIndex = endIndex
      }
      if ((this.helicorderData.length % this.sliceRange) !== 0) {
        data.push(this.helicorderData.slice(startIndex, this.helicorderData.length))
      }

      return data
    },
    scales() {
      /***
       * Список со "scales" для всех полос
       */
      let scales = []

      for (let data of this.slicedData) {
        let xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.width / ((this.minutesInARow * 60 * this.samplingRate) / data.length)])
        let yScale = d3.scaleLinear()
            .domain([d3.min(data) * this.gain, d3.max(data) * this.gain])
            .range([this.lineHeight, 0])
        scales.push({xScale: xScale, yScale: yScale})
      }

      return scales
    },
    lineHeight() {
      /***
       * Вычисляет высоту полосы в пикселях
       */
      return Math.floor(this.height / this.slicedData.length)
    },
    cursorForm() {
      /***
       * Задает параметры для формы курсора с помощью метода observationClipPath()
       */
      return this.observationClipPath(this.cursorStartPosX, this.cursorPosX)
    },
    processLoadedObservation() {
      /***
       * Обрабатывает список наблюдений и задает параметры для их отображения
       * (пока тестовый)
       */

      let listOfObservations = this.loadedObservation.map((data)=>{return {data, params: {}}})

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

      console.log(filteredObservationsList)
      return filteredObservationsList
    },
  },
  async mounted() {
    await this.plot()
  },
  methods: {
    getDateTimeBySeconds(seconds) {
      /***
       * Возвращает время являющееся суммой времени начала и переданных в функцию секунд
       */
      let date = new Date(this.startDateTime)

      date.setSeconds(date.getSeconds() + seconds)

      return new Date(date)
    },
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
    async plot() {

      let index = 0

      d3.select(this.$refs["canvas-box"]).node().innerHTML = null

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

              if ((this.cursorStartLineIndex <= (index)) && this.cursorIsStretching) {

                let cursorHeight = this.cursorStartLineIndex !== index + 1 ?
                    this.lineHeight * ((index + 1) - this.cursorStartLineIndex) : this.lineHeight

                this.$refs.cursor.style.height = `${(Math.abs(cursorHeight))}px`
              }
            }))
            .on('mousedown', (()=>{
              this.cursorStartLineIndex = index
              this.cursorStartPosY = this.lineHeight * (index)
              this.cursorIsStretching = true
              this.cursorStartPosX = d3.pointer(event)[0]
            }))
            .on('mouseup', (()=>{
              this.cursorIsStretching = false
              this.cursorWidth = null
              this.cursorEndPosX = d3.pointer(event)[0]
              this.$refs.cursor.style.height = `${this.lineHeight}px`

              let startSeconds = ((this.scales[this.cursorStartLineIndex].xScale.invert(this.cursorStartPosX) + (this.cursorStartLineIndex * this.sliceRange)) * (1 / this.samplingRate))
              let endSeconds = ((this.scales[index].xScale.invert(this.cursorEndPosX) + (index * this.sliceRange)) * (1 / this.samplingRate))

              this.$emit('selectObservation', {startDateTime: this.getDateTimeBySeconds(startSeconds), endDateTime: this.getDateTimeBySeconds(endSeconds)})
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
  display: grid;
  grid-gap: 10px;
  grid-template: "header header"
                 "side-panel graph"
                 "footer footer";
}
.graph-header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  grid-area: header;
}
.graph-side-panel{
  grid-area: side-panel;
}
.time-labels{
  height: 100%;
}
.time-label{
  height: v-bind(lineHeight + 'px');
}
.graph-footer{
  grid-area: footer;
}
.graph-container{
  position: relative;
  grid-area: graph;
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