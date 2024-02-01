<template>
  <div class="main-container">
    <div class="graph-header">
      <div class="graph-gain">
        X: <input type="number" v-model="gain" @change="plot()">
      </div>
      <div class="graph-caption">{{graphCaption}}</div>
    </div>

    <div class="observations-filters" v-if="observationColorByData">
      <template v-for="(color, key) in observationColorByData.colors">
        <helicorder-filter :background-color="color" :caption="key" v-model="observationsStatus[key]"/>
      </template>
    </div>

    <div class="graph-container"
         ref="target"
         @mouseenter="$refs.cursor.style.visibility = 'visible'"
         @mouseleave="$refs.cursor.style.visibility = 'hidden'">
      <div ref="canvas-box"
           class="canvas-container"/>

      <svg v-if="cursorIsStretching" class="svg-cursor">
        <polygon :points="cursorForm" :style="`fill: ${observationDefaultColor};`"/>
      </svg>
      <div v-else class="cursor" ref="cursor"></div>

      <template v-for="(observation, index) in processLoadedObservation">
        <svg class="observation-svg"
             :style="`height: ${observation.params.height}px;
             top: ${observation.params.top}px;
             z-index: ${observation.params.zIndex};`">
        <polygon class="observation"
             v-if="observationsStatus[observation.data[observationColorByData.key]]"
             :points="observationPolygon(observation.params.height, observation.params.leftStart , observation.params.leftEnd)"
             :style="`
             fill: ${observation.params.color};`"
             @click="$emit('observationClick', observation.data, index)"
             @contextmenu="$emit('observationContext', observation.data, index)"
             @mouseenter="$emit('observationEnter', observation.data)"
             @mouseleave="$emit('observationLeave', observation.data)"/>
        </svg>
      </template>

      <div class="vertical-lines">
        <div class="vertical-line" v-for="_ in [...Array(Number(minutesInARow) + 1).keys()]"/>
      </div>
    </div>

    <div class="graph-side-panel">
      <div class="time-labels">
        <div class="time-label" v-for="(_, index) in slicedIndexes">
          <template v-if="timeLabelByLineIndex(index)">
            {{ timeLabelByLineIndex(index) }}
          </template>
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

import HelicorderFilter from "./HelicorderFilter";

export default {
  name: "HelicorderVue",
  components: {
    HelicorderFilter,
  },
  props: {
    helicorderData: Array,
    maxData: Number,
    samplingRate: Number,
    minutesInARow: Number,
    startDateTime: new Date(),

    cursorColor: {type: String, default: 'rgba(183,18,18,0.7)'},

    loadedObservation: {type: Array, default: []},
    observationDefaultColor: {type: String, default: 'rgba(183,18,18,0.7)'},
    observationColorByData: {key: String, colors: {}},
    observationOpacity: {type: String, default: '0.7'},

    startDateTimeKey: {type: String, default: 'startDateTime'},
    endDateTimeKey: {type: String, default: 'endDateTime'},

    width: {type: Number, default: 400},
    height: {type: Number, default: 500},
    graphCaption: {type: String, default: 'Helicorder'},
    graphStrokeColor: {type: String, default: '#5185b9'},
  },
  emits: ['createObservation', 'observationClick', 'observationEnter', 'observationLeave', 'observationContext'],
  data() { return {
      linesInfo: {}, // scales для каждой линии

      cursorPosX: null, // позиция курсора по x
      cursorPosY: 0, // позиция курсора по y

      secondInCursor: null, // кол-во секунд в позиции курсора

      cursorStartPosX: null, // начальная позиция курсора по x (для выделения)
      cursorStartPosY: null, // начальная позиция курсора по y (для выделения)
      stretchingCursorHeight: null, // начальная позиция курсора по y (для выделения)
      cursorEndPosX: null, // конечная позиция курсора по x (для выделения)
      cursorStartLineIndex: null, // начальная линия ()
      cursorIsStretching: false, // происходит ли выделение

      observationPointerEvents: 'all', // css свойство "pointer-events" для наблюдений
      observationsStatus: {},

      gain: 1, // увеличение графика
    }
  },
  watch: {
    async helicorderData() {
      await this.plot()
    },
    async minutesInARow() {
      await this.plot()
      this.$refs.cursor.style.height = `${this.lineHeight}px`
    }
  },
  computed: {
    endDateTime() {
      let endDateTime = new Date(this.startDateTime)
      let secondsInEndPoint = Math.round((1 / this.samplingRate) * this.helicorderData.length)
      endDateTime.setSeconds(endDateTime.getSeconds() + secondsInEndPoint)
      return endDateTime
    },
    cursorDateTime() {
      /***
       * Время в текущей позиции курсора
       */
      let date = new Date(this.startDateTime)

      date.setSeconds(date.getSeconds() + Math.round(this.secondInCursor))

      return date.toLocaleString()
    },
    sliceRange() {
      /***
       * Количество точек в одной полосе
       */
      return this.minutesInARow * 60 * this.samplingRate
    },
    slicedIndexes() {
      /***
       * Нарезает массив данных на полосы
       */
      let listOfIndexes = []

      let startIndex = 0
      let endIndex = 0

      for (let index of [...Array(Math.floor(this.helicorderData.length / this.sliceRange)).keys()]) {
        endIndex += this.sliceRange
        listOfIndexes.push([startIndex, endIndex])
        startIndex = endIndex
      }
      if ((this.helicorderData.length % this.sliceRange) !== 0) {
        listOfIndexes.push([startIndex, this.helicorderData.length])
      }

      return listOfIndexes
    },
    lineHeight() {
      /***
       * Вычисляет высоту полосы в пикселях
       */
      return Math.floor(this.height / this.slicedIndexes.length)
    },
    cursorForm() {
      /***
       * Задает параметры для формы курсора с помощью метода observationPolygon()
       */
      return this.observationPolygon(this.stretchingCursorHeight, this.cursorStartPosX, this.cursorPosX)
    },
    processLoadedObservation() {
      /***
       * Обрабатывает список наблюдений и задает параметры для их отображения
       * (пока тестовый)
       */

      let listOfObservations = this.loadedObservation.map((data)=>{return {data, params: {}}})

      let filteredObservationsList = []

      let counter = this.loadedObservation.length
      for (let observation of listOfObservations) {
        if (
            (observation.data[this.startDateTimeKey].getTime() > this.startDateTime.getTime()) &&
            (observation.data[this.endDateTimeKey].getTime() > this.startDateTime.getTime()) &&
            (observation.data[this.startDateTimeKey].getTime() < this.endDateTime.getTime()) &&
            (observation.data[this.endDateTimeKey].getTime() < this.endDateTime.getTime())
        ) {
          let startIndexGlobal =  ((observation.data[this.startDateTimeKey].getTime() - this.startDateTime.getTime()) / 1000) / (1 / this.samplingRate)
          let endIndexGlobal = ((observation.data[this.endDateTimeKey].getTime() - this.startDateTime.getTime()) / 1000) / (1 / this.samplingRate)

          let startLine = Math.floor(startIndexGlobal / this.sliceRange)
          let endLine = Math.floor(endIndexGlobal / this.sliceRange)

          let startIndexLine = startIndexGlobal % this.sliceRange
          let endIndexLine =  endIndexGlobal % this.sliceRange

          observation.params.height = startLine === endLine ? this.lineHeight : (endLine - startLine + 1) * this.lineHeight
          observation.params.top = startLine * this.lineHeight

          let xScaleStart = d3.scaleLinear()
            .domain([0, this.sliceRange])
            .range([0, this.width / ((this.minutesInARow * 60 * this.samplingRate) / this.sliceRange)])
          let xScaleEnd = d3.scaleLinear()
            .domain([0, this.sliceRange])
            .range([0, this.width / ((this.minutesInARow * 60 * this.samplingRate) / this.sliceRange)])

          observation.params.leftStart = xScaleStart(startIndexLine)
          observation.params.leftEnd = xScaleEnd(endIndexLine)

          observation.params.zIndex = counter

          if (this.observationColorByData && (observation.data.hasOwnProperty(this.observationColorByData.key))) {
            observation.params.color = this.observationColorByData.colors[observation.data[this.observationColorByData.key]]
          } else {
            observation.data[this.observationColorByData.key] = null
          }

          filteredObservationsList.push(observation)
          counter--
        }
      }

      return filteredObservationsList
    },
  },
  async beforeMount() {
    await (this.observationColorByData.colors.null = this.observationDefaultColor)

    for (let key in this.observationColorByData.colors) {
      this.observationsStatus[key] = true
    }

    await this.plot()
  },
  methods: {
    timeLabelByLineIndex(lineIndex) {
      let date = new Date(this.startDateTime)
      date.setSeconds(this.startDateTime.getSeconds() + (this.minutesInARow * 60) * lineIndex)

      let dateFromStart = new Date(this.startDateTime)

      if (dateFromStart.getMinutes() % 10 === date.getMinutes() % 10) {
        return date.toTimeString().split(' ')[0].slice(0, 5)
      } else {
        return null
      }
    },
    getDateTimeBySeconds(seconds) {
      /***
       * Возвращает время являющееся суммой времени начала и переданных в функцию секунд
       */
      let date = new Date(this.startDateTime)

      date.setSeconds(date.getSeconds() + seconds)

      return new Date(date)
    },
    observationPolygon(height, startPos, endPos) {
      /***
       * Возвращает строку определяющую форму маркера наблюдения для css свойства clip-path
       */
      let width = this.$refs["canvas-box"].offsetWidth

      let polygon = [
          `0 ${this.lineHeight}`,
          `${startPos} ${this.lineHeight}`,
          `${startPos} 0`,

          `${width} 0`,

          `${width} ${height - this.lineHeight}`,
          `${endPos} ${height - this.lineHeight}`,
          `${endPos} ${height}`,

          `0 ${height}`,
      ]

      return polygon.join(',')
    },
    async plot() {

      let index = 0

      d3.select(this.$refs["canvas-box"]).node().innerHTML = null

      let promises = [...Array(this.slicedIndexes.length).keys()].map(async (index)=>{

        let data = this.helicorderData.slice(this.slicedIndexes[index][0], this.slicedIndexes[index][1])

        setTimeout(async ()=> {
          await this.drawCanvasLine(data, index)
        }, 0)

      })

      await Promise.all(promises)
    },
    async drawCanvasLine(data, index) {

      let gainedLinePos = (this.lineHeight * index) - ((this.lineHeight * this.gain) - this.lineHeight) / 2

      let xScale = d3.scaleLinear()
          .domain([0, data.length])
          .range([0, this.width / ((this.minutesInARow * 60 * this.samplingRate) /data.length)])
      let yScale = d3.scaleLinear()
          .domain([-this.maxData, this.maxData])
          .range([0, this.lineHeight * this.gain])

      let canvas = d3.select(this.$refs["canvas-box"])
          .append('div')
            .attr('style', `height: ${this.lineHeight}px; width: ${this.width}px;`)
            .on('mousemove', (()=>{
              this.secondInCursor = (Math.round(xScale.invert(d3.pointer(event)[0])) + ((index) * this.sliceRange)) * (1 / this.samplingRate)

              this.cursorPosX = d3.pointer(event)[0]
              this.cursorPosY = this.lineHeight * index

              if ((this.cursorStartLineIndex <= (index)) && this.cursorIsStretching) {

                this.stretchingCursorHeight = this.cursorStartLineIndex !== index + 1 ?
                this.lineHeight * ((index + 1) - this.cursorStartLineIndex) : this.lineHeight
              }
            }))
            .on('mousedown', (()=>{
              this.cursorStartLineIndex = index
              this.cursorIsStretching = true
              this.cursorStartPosX = d3.pointer(event)[0]
              this.cursorStartPosY = index * this.lineHeight
              this.observationPointerEvents = 'none'
            }))
            .on('mouseup', (()=>{
              if (this.cursorStartPosX !== null) {
                this.cursorIsStretching = false
                this.cursorEndPosX = d3.pointer(event)[0]

                let startSeconds = ((xScale.invert(this.cursorStartPosX) + (this.cursorStartLineIndex * this.sliceRange)) * (1 / this.samplingRate))
                let endSeconds = ((xScale.invert(this.cursorEndPosX) + (index * this.sliceRange)) * (1 / this.samplingRate))

                let data = {}

                data[this.startDateTimeKey] = this.getDateTimeBySeconds(startSeconds)
                data[this.endDateTimeKey] = this.getDateTimeBySeconds(endSeconds)

                let startGlobalDataIndex = Math.round((this.cursorStartLineIndex * this.sliceRange) + xScale.invert(this.cursorStartPosX))
                let endGlobalDataIndex = Math.round((index * this.sliceRange) + xScale.invert(this.cursorEndPosX))

                this.$emit('createObservation', data, d3.max(this.helicorderData.slice(startGlobalDataIndex, endGlobalDataIndex)))

                this.observationPointerEvents = 'all'
                this.cursorStartPosX = null
              }
            }))
          .append('canvas')
            .attr('width', this.width)
            .attr('height', this.lineHeight * this.gain)
            .attr('style', `position: absolute; top: ${gainedLinePos}px; left: 0px; pointer-events: none;`)
            .node()

      let ctx = canvas.getContext('2d')

      let line = fc.seriesCanvasLine()
          .mainValue(d => d)
          .crossValue((_, i) => i)
          .xScale(xScale)
          .yScale(yScale)
          .defined(d => d)
          .context(ctx)
          .decorate((context, datum, index) => {
              context.fillStyle = 'rgba(255,255,255,0)'
              context.strokeStyle = this.graphStrokeColor;
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
  grid-template: "filters filters"
                 "header header"
                 "side-panel graph"
                 "footer footer" / 80px auto;
}
.observations-filters{
  display: flex;
  flex-direction: row;
  gap: 10px;
  grid-area: filters;
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
  display: flex;
  flex-direction: column;
  height: 100%;
}
.time-label{
  display: flex;
  justify-content: center;
  align-items: center;
  height: v-bind(lineHeight + 'px');
}
.graph-footer{
  grid-area: footer;
}
.graph-container{
  overflow: hidden;
  position: relative;
  grid-area: graph;
  z-index: 1;
}
.vertical-lines{
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.vertical-line{
  height: 100%;
  width: 2px;
  background-color: red;
}
.cursor{
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  top: v-bind(cursorPosY + 'px');
  left: v-bind(cursorPosX + 'px');
  height: v-bind(lineHeight + 'px');
  width: 2px;
  background-color: v-bind(cursorColor);
  opacity: v-bind(observationOpacity);
}
.svg-cursor{
  width: 100%;
  height: 100%;
  pointer-events: none;
  top: v-bind(cursorStartPosY + 'px');
  position: absolute;
}
.observation-svg{
  pointer-events: none;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
.observation{
  pointer-events: v-bind(observationPointerEvents);
  position: absolute;
  width: 100%;
  fill: v-bind(observationDefaultColor);
}
.observation:after{
  content: '';
  position: absolute;
  clip-path: inherit;
  height: inherit;
  width: 100%;
}
.observation:hover{
  stroke: black;
  stroke-width: 2px;
}
</style>