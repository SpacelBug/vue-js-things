<template>
  <h4>{{chartCaption}}</h4>
  <div ref="target" class="main-container">
    <svg v-if="type === 'svg'" :width="width" :height="height" ref="svg" class="svg-container"/>
    <div v-else :width="width" :height="height" ref="canvas-box" class="canvas-container"/>
    <div class="cursor" ref="cursor"></div>
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
      cursorPosX: null,
      cursorPosY: null,

      currentLineIndex: null
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
    }
  },
  mounted() {
    this.plot()
  },
  methods: {
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
  top: v-bind(cursorPosY + 'px');
  left: v-bind(cursorPosX + 'px');
  height: v-bind(lineHeight + 'px');
  width: 2px;
  background-color: red;
}
</style>