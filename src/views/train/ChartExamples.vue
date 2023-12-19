<template>
  <div class="main-box">
    <div class="chart-example-container">
      <div class="chart-example-container-chart">
        <line-chart
            :chart-data="chartData"
            :type="'svg'"
            :chart-caption="'LineChart (svg)'"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container">
      <div class="chart-example-container-chart">
        <line-chart
            :chart-data="chartData"
            :type="'canvas'"
            :chart-caption="'LineChart (canvas)'"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container">
      <div class="chart-example-container-chart">
        <line-chart
            :chart-data="chartData"
            :type="'webgl'"
            :chart-caption="'LineChart (webgl)'"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>
  </div>
</template>

<script>
import LineChart from "@/components/d3fc-charts/LineChart";

export default {
  name: "ChartExamples",
  components: {
    LineChart,
  },
  data () { return {
      chartData: [
          {x: 0, y: 1},
          {x: 1, y: 5},
          {x: 2, y: 6},
          {x: 3, y: 1},
          {x: 4, y: 5},
          {x: 5, y: 2},
          {x: 6, y: 1},
          {x: 7, y: 5},
          {x: 8, y: 6},
          {x: 9, y: 1},
          {x: 10, y: 5},
          {x: 11, y: 2},
      ]
    }
  }
}
</script>

<style scoped>
.main-box{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>