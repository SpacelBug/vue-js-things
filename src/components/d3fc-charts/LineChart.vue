<template>
  <div ref="target">
    <h4>{{chartCaption}}</h4>
    <svg v-if="type === 'svg'">
      <g ref="group"></g>
    </svg>
    <canvas v-else ref="canvas"/>
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

    width: 400,
    height: 400,
    type: {type: String, default: 'svg'},
    chartCaption: {type: String, default: 'LineChart'}
  },
  data() { return {
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
          .range([0, this.height])
    }
  },
  mounted() {
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
  },
  methods: {
    async plotSvg() {
      console.log('plot svg', this.chartData, this.xScale.domain(), this.yScale.domain())


      let line = fc.seriesSvgLine()
          .crossValue(d => d[this.xName])
          .mainValue(d => d[this.yName])
          .xScale(this.xScale)
          .yScale(this.yScale)


      d3.select(this.$refs.group)
          .datum(this.chartData)
          .call(line)
    },
    plotCanvas() {
      let canvas = this.$refs.canvas

      console.log('plot canvas', this.chartData, this.xScale.domain(), this.yScale.domain())

      let ctx = canvas.getContext('2d')

      let line = fc.seriesCanvasLine()
          .crossValue(d => d[this.xName])
          .mainValue(d => d[this.yName])
          .xScale(this.xScale)
          .yScale(this.yScale)
          .context(ctx)

      line(this.chartData)
    },
    plotWebGl() {
      let canvas = this.$refs.canvas

      console.log('plot webgl', this.chartData, this.xScale.domain(), this.yScale.domain())

      let ctx = canvas.getContext('webgl')

      let line = fc.seriesWebglLine()
          .crossValue(d => d[this.xName])
          .mainValue(d => d[this.yName])
          .xScale(this.xScale)
          .yScale(this.yScale)
          .context(ctx)

      line(this.chartData)
    },
  }
}
</script>

<style scoped>
</style>