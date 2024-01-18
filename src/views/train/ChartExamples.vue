<template>
  <div class="chart-selector">
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.LineChartSvg">LineChart SVG</div>
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.LineChartCanvas">LineChart Canvas</div>
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.LineChartWebGl">LineChart WebGL</div>
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.TimeSeriesSvg">TimeSeriesChart SVG</div>
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.TimeSeriesCanvas">TimeSeriesChart Canvas</div>
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.TimeSeriesWebGl">TimeSeriesChart WebGL</div>
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.MultiTimeSeriesSvg">MultiTimeSeries SVG</div>
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.MultiTimeSeriesCanvas">MultiTimeSeries Canvas</div>
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.MultiTimeSeriesWebGl">MultiTimeSeries WebGl</div>
    <div :class="['chart-selector-button']" @click="selectedChart = $refs.HelicorderVueCanvas">Helicorder Canvas</div>
  </div>
  <div class="main-box">

    <div class="chart-example-container" ref="LineChartSvg">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.LineChartSvg">
        <line-chart
            :chart-data="chartData"
            :type="'svg'"
            :chart-caption="'LineChart (svg)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container" ref="LineChartCanvas">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.LineChartCanvas">
        <line-chart
            :chart-data="chartData"
            :type="'canvas'"
            :chart-caption="'LineChart (canvas)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container" ref="LineChartWebGl">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.LineChartWebGl">
        <line-chart
            :chart-data="chartData"
            :type="'webgl'"
            :chart-caption="'LineChart (webgl)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container" ref="TimeSeriesSvg">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.TimeSeriesSvg">
        <time-series-chart
            :chart-data="timeChartData"
            :type="'svg'"
            :chart-caption="'TimeSeriesChart (svg)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container" ref="TimeSeriesCanvas">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.TimeSeriesCanvas">
        <time-series-chart
            :chart-data="timeChartData"
            :type="'canvas'"
            :chart-caption="'TimeSeriesChart (canvas)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container" ref="TimeSeriesWebGl">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.TimeSeriesWebGl">
        <time-series-chart
            :chart-data="timeChartData"
            :type="'webgl'"
            :chart-caption="'TimeSeriesChart (webgl)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container" ref="MultiTimeSeriesSvg">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.MultiTimeSeriesSvg">
        <sliced-time-series
            :chart-data="multiTimeChartData"
            :sampling-rate="200"
            :start-date-time="new Date()"
            :width = "1600"
            :type="'svg'"
            :chart-caption="'MultiTimeSeriesChart (svg)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container" ref="MultiTimeSeriesCanvas">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.MultiTimeSeriesCanvas">
        <sliced-time-series
            :chart-data="multiTimeChartData"
            :sampling-rate="200"
            :start-date-time="new Date()"
            :width = "1600"
            :type="'canvas'"
            :chart-caption="'MultiTimeSeriesChart (Canvas)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container" ref="MultiTimeSeriesWebGl">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.MultiTimeSeriesWebGl">
        <sliced-time-series
            :chart-data="multiTimeChartData"
            :sampling-rate="200"
            :start-date-time="new Date()"
            :width = "1600"
            :type="'webgl'"
            :chart-caption="'MultiTimeSeriesChart (webgl)'"
            :show-plotting-time="true"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>

    <div class="chart-example-container" ref="HelicorderVueCanvas">
      <div class="chart-example-container-chart" v-if="selectedChart === $refs.HelicorderVueCanvas">
        <helicorder-vue
            :chart-data="helicorderData"
            :minutes-in-a-row="5"
            :sampling-rate="200"
            :start-date-time="new Date()"
            :width = "1600"
            :type="'canvas'"
            :chart-caption="'HelicorderVue (canvas)'"/>
      </div>
      <div class="chart-example-container-code"></div>
    </div>
  </div>
</template>

<script>
import LineChart from "@/components/d3fc-charts/LineChart";
import TimeSeriesChart from "@/components/d3fc-charts/TimeSeriesChart";
import SlicedTimeSeries from "@/components/d3fc-charts/SlicedTimeSeries";
import HelicorderVue from "@/components/d3fc-charts/HelicorderVue";

export default {
  name: "ChartExamples",
  components: {
    LineChart,
    TimeSeriesChart,
    SlicedTimeSeries,
    HelicorderVue
  },
  data () { return {
      selectedChart: null,
      chartData: Array.from({length: 1000000}, (_, i) => ({x: i, y: Math.random()})),
      timeChartData: Array.from({length: 1000000}, (_, i) => (Math.random())),
      multiTimeChartData: [
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
        Array.from({length: 24000 * 5}, (_, i) => (Math.random())),
      ],
      helicorderData: Array.from({length: 24000 * 5 * 12}, (_, i) => (Math.random())),
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.chart-selector{
  display: flex;
  gap: 20px;
  font-size: 16px;
  padding: 24px;
}
.chart-selector-button{
  cursor: pointer;
}
.main-box{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>