<template>
  <div ref="target">
    <h4>{{chartCaption}}</h4>
    <svg v-if="type === 'svg'" :width="width" :height="height" ref="svg" class="svg-container"/>
    <div v-else :width="width" :height="height" ref="canvas-box" class="canvas-container"/>
    <div>Current time: {{cursorDateTime}}</div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as fc from 'd3fc'

export default {
  name: "TimeSeriesChart",
  props: {
    chartData: Array,
    samplingRate: Number,
    startDateTime: new Date(),
    xName: {type: String, default: 'x'},
    yName: {type: String, default: 'y'},

    width: {type: Number, default: 400},
    height: {type: Number, default: 400},
    type: {type: String, default: 'svg'},
    chartCaption: {type: String, default: 'TimeSeriesChart'},
    chartStrokeColor: {type: String, default: '#5185b9'},
  },
  data() { return {
      plottingTime: null,
      secondInCursor: null
    }
  },
  computed: {
    cursorDateTime() {
      let date = new Date(this.startDateTime)
      
      date.setSeconds(date.getSeconds() + Math.round(this.secondInCursor))
      
      return date
    },
  },
  mounted() {
    this.plot()
  },
  methods: {
    async plot() {

      let index = 0

      let promises = [...Array(this.chartData.length).keys()].map(async (index)=>{

        console.log('promise: ', index)

        setTimeout(async ()=> {
          if (this.type === 'svg') {
            await this.drawSvgLine(this.chartData[index], index)
          } else if (this.type === 'canvas') {
            await this.drawCanvasLine(this.chartData[index], index)
          } else if (this.type === 'webgl') {
            await this.drawWebGlLine(this.chartData[index], index)
          }
        }, 0)

      })

      await Promise.all(promises)


    },
    async drawSvgLine(data, index) {
      let lineHeight = this.height/this.chartData.length

      let group = d3.select(this.$refs.svg)
          .append('g')
          .attr("transform", `translate(${0},${lineHeight*index})`)
          .on('mousemove', (()=>{
            this.secondInCursor = xScale.invert(d3.pointer(event)[0]) * 1 / this.samplingRate * (index + 1)
          }))

      let xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.width])
      let yScale = d3.scaleLinear()
            .domain(d3.extent(data))
            .range([lineHeight, 0])

      let line = fc.seriesSvgLine()
        .mainValue(d => d)
        .crossValue((_, i) => i)
        .xScale(xScale)
        .yScale(yScale)
        .decorate((selection) => {
            selection.enter()
                .style('stroke', this.chartStrokeColor);
        })

      group
          .datum(data)
          .call(line)

    },
    async drawCanvasLine(data, index) {
      let lineHeight = this.height/this.chartData.length

      let xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.width])
      let yScale = d3.scaleLinear()
            .domain(d3.extent(data))
            .range([lineHeight, 0])

      let canvas = d3.select(this.$refs["canvas-box"]).append('canvas')
          .attr('width', this.width)
          .attr('height', lineHeight)
          .on('mousemove', (()=>{
            this.secondInCursor = xScale.invert(d3.pointer(event)[0]) * 1 / this.samplingRate * (index + 1)
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
    },
    async drawWebGlLine(data, index) {
      let lineHeight = this.height/this.chartData.length

      let canvas = d3.select(this.$refs["canvas-box"]).append('canvas')
          .attr('width', this.width)
          .attr('height', lineHeight)
          .on('mousemove', (()=>{
            this.secondInCursor = xScale.invert(d3.pointer(event)[0]) * 1 / this.samplingRate * (index + 1)
          }))
          .node()

      let ctx = canvas.getContext('webgl')

      let xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.width])
      let yScale = d3.scaleLinear()
            .domain(d3.extent(data))
            .range([lineHeight, 0])

      let line = fc.seriesWebglLine()
          .mainValue(d => d)
          .crossValue((_, i) => i)
          .xScale(xScale)
          .yScale(yScale)
          .context(ctx)
          .decorate((program, data) => {
              fc.webglStrokeColor()
                  .value((_, i) => {
                const rgba = d3.color(this.chartStrokeColor);
                return [rgba.r / 255, rgba.g / 255, rgba.b / 255, rgba.opacity];
                })
                .data(data)(program);
          });

      line(data)
    }
  }
}
</script>

<style scoped>
.svg-container{
  display: flex;
  flex-direction: column;
}
.canvas-container{
  display: flex;
  flex-direction: column;
}
</style>