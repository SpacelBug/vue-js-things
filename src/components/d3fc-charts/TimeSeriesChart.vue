<template>
  <div ref="target">
    <h4>{{chartCaption}}<template v-if="plottingTime && showPlottingTime"> ({{ plottingTime }}ms)</template></h4>
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
  name: "TimeSeriesChart",
  props: {
    chartData: Array,
    xName: {type: String, default: 'x'},
    yName: {type: String, default: 'y'},

    width: {type: Number, default: 400},
    height: {type: Number, default: 400},
    type: {type: String, default: 'svg'},
    chartCaption: {type: String, default: 'TimeSeriesChart'},
    chartStrokeColor: {type: String, default: '#5185b9'},

    showPlottingTime: {type: Boolean, default: false},
  },
  data() { return {
      plottingTime: null,
    }
  },
  computed: {
    xScale() {
      return d3.scaleLinear()
          .domain([0, this.chartData.length])
          .range([0, this.width])
    },
    yScale() {
      return d3.scaleLinear()
          .domain(d3.extent(this.chartData))
          .range([this.height, 0])
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
          .mainValue(d => d)
          .crossValue((_, i) => i)
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
          .mainValue(d => d)
          .crossValue((_, i) => i)
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
          .mainValue(d => d)
          .crossValue((_, i) => i)
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