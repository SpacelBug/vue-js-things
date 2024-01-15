<template>
  <div ref="target">
    <h4>{{chartCaption}}<template v-if="plottingTime && showPlottingTime"> ({{ plottingTime }}ms for {{chartData.length}} points)</template></h4>
    <svg v-if="type === 'svg'" :width="width" :height="height">
      <g ref="group"></g>
    </svg>
    <canvas v-else ref="canvas" :width="width" :height="height"/>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as fc from 'd3fc'

export default {
  name: "LineChartSvg",
  props: {
    chartData: Array,
    xName: {type: String, default: 'x'},
    yName: {type: String, default: 'y'},

    width: {type: Number, default: 400},
    height: {type: Number, default: 400},
    type: {type: String, default: 'svg'},
    chartCaption: {type: String, default: 'LineChart'},
    chartStrokeColor: {type: String, default: '#5185b9'},

    showPlottingTime: {type: Boolean, default: false},
    showAxis: {type: Boolean, default: true},
    showGrid: {type: Boolean, default: true}
  },
  data() { return {
      plottingTime: null,
    }
  },
  computed: {
    xScale() {
      return d3.scaleLinear()
          .domain(d3.extent(this.chartData.map((d)=>{return d[this.xName]})))
          .range([0, this.width])
    },
    yScale() {
      return d3.scaleLinear()
          .domain(d3.extent(this.chartData.map((d)=>{return d[this.yName]})))
          .range([this.height, 0])
    },
    xAxis() {
      return fc.axisBottom(this.xScale)
          .tickCenterLabel(true)
    },
    yAxis() {
      return fc.axisLeft(this.yScale)
          .tickCenterLabel(true)
    }
  },
  mounted() {
    let startTime = new Date().getTime()
    switch (this.type) {
      case 'svg':
        this.plotSvg()
        break;
      case 'canvas':
        this.plotCanvas()
        break;
      case 'webgl':
        this.plotWebGl()
    }
    this.plottingTime = (new Date().getTime() - startTime)
  },
  methods: {
    async plotSvg() {
      let line = fc.seriesSvgLine()
          .crossValue(d => d[this.xName])
          .mainValue(d => d[this.yName])
          .xScale(this.xScale)
          .yScale(this.yScale)
          .decorate((selection) => {
              selection.enter()
                  .style('stroke', this.chartStrokeColor);
          })

      d3.select(this.$refs.group)
          .datum(this.chartData)
          .call(line)
    },
    plotCanvas() {
      let canvas = this.$refs.canvas

      let ctx = canvas.getContext('2d')

      let line = fc.seriesCanvasLine()
          .crossValue(d => d[this.xName])
          .mainValue(d => d[this.yName])
          .xScale(this.xScale)
          .yScale(this.yScale)
          .context(ctx)
          .decorate((context, datum, index) => {
              context.strokeStyle = this.chartStrokeColor;
          });

      line(this.chartData)
    },
    plotWebGl() {
      let canvas = this.$refs.canvas

      let ctx = canvas.getContext('webgl')

      let line = fc.seriesWebglLine()
          .crossValue(d => d[this.xName])
          .mainValue(d => d[this.yName])
          .xScale(this.xScale)
          .yScale(this.yScale)
          .context(ctx)
          .decorate((program, data) => {
              fc.webglStrokeColor()
                  .value((_, i) => {
                const rgba = d3.color(this.chartStrokeColor);
                return [rgba.r / 255, rgba.g / 255, rgba.b / 255, rgba.opacity];
                })
                .data(data)(program);
          });

      line(this.chartData)
    },
  }
}
</script>

<style scoped>
</style>