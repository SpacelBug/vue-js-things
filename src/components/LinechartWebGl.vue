<template>
  <div ref="graph">
    <h3>{{chartCaption}}</h3>
    <canvas :width="width" :height="height" ref="canvas"></canvas>
  </div>
</template>

<script>
import * as d3 from "d3"
import * as fc from "d3fc"

export default {
  name: "LinechatWebDl.vue",
  props: {
    data: Array,
    xName: String,
    yName: String,
    height: {type: Number, default: 500},
    width: {type: Number, default: 500},
    chartCaption: {type: String, default: 'Line Chart (WebGl)'}
  },
  mounted() {
    this.plot()
  },
  methods: {
    plot() {
      let data = [
        {value: 1, time: new Date('2023-04-01 00:00:00')},
        {value: 2, time: new Date('2023-04-02 00:00:00')},
        {value: 3, time: new Date('2023-04-03 00:00:00')},
        {value: -1, time: new Date('2023-04-04 00:00:00')},
        {value: 1, time: new Date('2023-04-05 00:00:00')},
        {value: -2, time: new Date('2023-04-06 00:00:00')},
      ]

      let xScale = d3.scaleTime()
          .domain([data[0].time, data[data.length - 1].time])
          .range([0, this.width]);

      let yScale = d3.scaleLinear()
          .domain(d3.extent(data.map((d)=>{return d.value})))
          .range([this.height, 0]);

      this.$refs.canvas.width = this.width;
      this.$refs.canvas.height = this.height;
      const gl = this.$refs.canvas.getContext('webgl');

      // the webgl series component that renders data, transformed
      // using D3 scales, onto a WebGL context
      const webglLine = fc.seriesWebglLine()
          .xScale(xScale)
          .yScale(yScale)
          .mainValue(d => d.value)
          .crossValue(d => d.time)
          .context(gl);

      webglLine(data);
    }
  },
}
</script>

<style scoped>

</style>