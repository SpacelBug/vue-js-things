<template>
  <div ref="graph">
    <h3>{{chartCaption}}</h3>
    <canvas :width="width" :height="height" ref="canvas"></canvas>
  </div>
</template>

<script>
import * as d3 from "d3"

export default {
  name: "LinechartCanvas",
  props: {
    data: Array,
    xName: String,
    yName: String,
    height: {type: Number, default: 500},
    width: {type: Number, default: 500},
    chartCaption: {type: String, default: 'Line Chart (canvas)'}
  },
  data() {
    return {
      canvas: null,
      context: null,
    }
  },
  mounted() {
    this.context = this.$refs.canvas.getContext('2d');

    this.setScales()
    this.setLine()
    this.plot()
  },
  methods: {
    setScales() {
      this.xScale = d3.scaleTime()
        .range([0, this.width])
        .domain([new Date(this.data[0][this.xName]), new Date(this.data[this.data.length - 1][this.xName])])

      this.yScale = d3.scaleLinear()
        .range([this.height, 0])
        .domain([0, d3.max(this.data, d => d[this.yName])]);
    },
    setLine() {
      this.line = d3.line()
        .x(d => this.xScale(new Date(d[this.xName])))
        .y(d => this.yScale(d[this.yName]))
        .curve(d3.curveStep)
        .context(this.context)
    },
    plot() {
      this.context.beginPath();
      this.line(this.data);
      this.context.lineWidth = 1.5;
      this.context.strokeStyle = 'steelblue';
      this.context.stroke();
    },
  }
}
</script>

<style scoped>

</style>