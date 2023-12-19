<template>
  <div class="main-box">
    <div class="chart-example-container">
      <div class="chart-example-container-chart">
        <line-chart
            :chart-data="chartData"
            :type="'svg'"
            :chart-caption="'LineChart (svg)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container">
      <div class="chart-example-container-chart">
        <line-chart
            :chart-data="chartData"
            :type="'canvas'"
            :chart-caption="'LineChart (canvas)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container">
      <div class="chart-example-container-chart">
        <line-chart
            :chart-data="chartData"
            :type="'svg'"
            :chart-caption="'LineChart (webgl)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container">
      <div class="chart-example-container-chart">
        <time-series-chart
            :chart-data="timeChartData"
            :type="'canvas'"
            :chart-caption="'TimeSeriesChart (svg)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container">
      <div class="chart-example-container-chart">
        <time-series-chart
            :chart-data="timeChartData"
            :type="'webgl'"
            :chart-caption="'TimeSeriesChart (canvas)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container">
      <div class="chart-example-container-chart">
        <time-series-chart
            :chart-data="timeChartData"
            :type="'webgl'"
            :chart-caption="'TimeSeriesChart (webgl)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>
  </div>
</template>

<script>
import LineChart from "@/components/d3fc-charts/LineChart";
import TimeSeriesChart from "@/components/d3fc-charts/TimeSeriesChart";

export default {
  name: "ChartExamples",
  components: {
    LineChart,
    TimeSeriesChart
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
      ],
      timeChartData: [1,2,5,4,6,7,3,5,6,7,9,6,4,32,3,7,3,2,3,3,14,12,34,12,1,23,23,4,23,14]
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