<template>
  <div class="main-container">
    <div class="graph-header">
      <div class="graph-gain">
        X: <input type="number" v-model="gain" @change="plot()">
      </div>
      <div class="graph-caption">{{graphCaption}}</div>
    </div>
    <div v-if="observationColorByData" class="observations-filters">
      <form ref="filtersForm">
        <div v-for="(color, key) in observationColorByData.colors"
             class="filter"
             :style="`background-color: ${color}`">
          <input type="checkbox" checked v-model="observationsStatus[key]">
          {{key}}
        </div>
      </form>
    </div>
    <div ref="target"
         class="graph-container"
         @mouseenter="$refs.cursor.style.visibility = 'visible'"
         @mouseleave="$refs.cursor.style.visibility = 'hidden'">
      <div :width="width"
           :height="height"
           ref="canvas-box"
           class="canvas-container"/>
      <div :class="['cursor', {'stretching-cursor': cursorIsStretching}]" ref="cursor"></div>
      <template v-for="observation in processLoadedObservation">
        <div class="observation"
             v-if="observationsStatus[observation.data[observationColorByData.key]]"
             :style="`height: ${observation.params.height}px;
             clip-path: polygon(${observationClipPath(observation.params.leftStart , observation.params.leftEnd)});
             top: ${observation.params.top}px;
             z-index: ${observation.params.zIndex};
             background-color: ${observation.params.color};`"
             @click="$emit('observationClick', observation.data)"
             @mouseenter="$emit('observationEnter', observation.data)"
             @mouseleave="$emit('observationLeave', observation.data)"/>
        <div class="vertical-lines">
          <div class="vertical-line" v-for="_  in [...Array(minutesInARow + 1).keys()]"></div>
        </div>
      </template>
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
    maxData: Number,
    samplingRate: Number,
    minutesInARow: Number,
    startDateTime: new Date(),

    loadedObservation: {type: Array, default: []},
    observationDefaultColor: {type: String, default: 'rgba(91,91,91)'},
    observationColorByData: {key: String, colors: {}},
    observationOpacity: {type: String, default: '0.7'},

    startDateTimeKey: {type: String, default: 'startDateTime'},
    endDateTimeKey: {type: String, default: 'endDateTime'},

    width: {type: Number, default: 400},
    height: {type: Number, default: 500},
    type: {type: String, default: 'svg'},
    graphCaption: {type: String, default: 'Helicorder'},
    graphStrokeColor: {type: String, default: '#5185b9'},
  },
  emits: ['selectObservation', 'observationClick', 'observationEnter', 'observationLeave'],
  data() { return {
      linesInfo: {}, // scales для каждой линии

      cursorPosX: null, // позиция курсора по x
      cursorPosY: 0, // позиция курсора по y

      secondInCursor: null, // кол-во секунд в позиции курсора

      cursorStartPosX: null, // начальная позиция курсора по x (для выделения)
      cursorStartPosY: null, // начальная позиция курсора по y (для выделения)
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
            .domain([-this.maxData, this.maxData])
            .range([0, this.lineHeight * this.gain])
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

      let counter = this.loadedObservation.length
      for (let observation of listOfObservations) {
        if (
            (observation.data.startDateTime.getTime() > this.startDateTime) &&
            (observation.data.endDateTime.getTime() > this.startDateTime)
        ) {
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
          observation.params.zIndex = counter

          if (this.observationColorByData) {
            observation.params.color = this.observationColorByData.colors[observation.data[this.observationColorByData.key]]
          }

          filteredObservationsList.push(observation)

          counter--
        }
      }

      return filteredObservationsList
    },
  },
  async mounted() {
    for (let key in this.observationColorByData.colors) {
      this.observationsStatus[key] = true
    }
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

      let gainedLinePos = (this.lineHeight * index) - ((this.lineHeight * this.gain) - this.lineHeight) / 2

      let canvas = d3.select(this.$refs["canvas-box"])
          .append('div')
            .attr('style', `height: ${this.lineHeight}px; width: ${this.width}px;`)
            .on('mousemove', (()=>{
              this.secondInCursor = (Math.round(this.scales[index].xScale.invert(d3.pointer(event)[0])) + ((index) * this.sliceRange)) * (1 / this.samplingRate)

              this.cursorPosX = d3.pointer(event)[0]
              this.cursorPosY = this.lineHeight * index

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
              this.observationPointerEvents = 'none'
            }))
            .on('mouseup', (()=>{
              this.cursorIsStretching = false
              this.cursorEndPosX = d3.pointer(event)[0]
              this.$refs.cursor.style.height = `${this.lineHeight}px`

              let startSeconds = ((this.scales[this.cursorStartLineIndex].xScale.invert(this.cursorStartPosX) + (this.cursorStartLineIndex * this.sliceRange)) * (1 / this.samplingRate))
              let endSeconds = ((this.scales[index].xScale.invert(this.cursorEndPosX) + (index * this.sliceRange)) * (1 / this.samplingRate))

              let data = {}
              data[this.startDateTimeKey] = this.getDateTimeBySeconds(startSeconds)
              data[this.endDateTimeKey] = this.getDateTimeBySeconds(endSeconds)
              data['type'] = 'I'
              this.$emit('selectObservation', data)
              this.observationPointerEvents = 'all'
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
          .xScale(this.scales[index].xScale)
          .yScale(this.scales[index].yScale)
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
  grid-area: filters;
}
.filter{
  width: fit-content;
  padding: 5px 10px;
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
  background-color: rgba(91, 68, 68, 0.62);
}
.stretching-cursor{
  width: 100%;
  top: v-bind(cursorStartPosY + 'px');
  left: 0;
  clip-path: polygon(v-bind(cursorForm));
}
.observation{
  pointer-events: v-bind(observationPointerEvents);
  position: absolute;
  width: 100%;
  background-color: v-bind(observationDefaultColor);
  opacity: v-bind(observationOpacity);
}
.observation:hover{
  opacity: calc(v-bind(observationOpacity) + 0.2);
}
</style>