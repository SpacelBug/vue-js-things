<template>
  <linechart-canvas :data="linechartData" :x-name="'date'" :y-name="'close'"/>
</template>

<script>
import LinechartCanvas from "@/components/LinechartCanvas";

export default {
  name: "Graphs",
  components: {
    LinechartCanvas
  },
  data() { return {
      linechartData: [
        { date: '24-Apr-07', close: 60.241222 },
        { date: '25-Apr-07', close: 75.35231313 },
        { date: '26-Apr-07', close: 98.83134 },
        { date: '27-Apr-07', close: 99.9335352 },
        { date: '30-Apr-07', close: 85.8353530 },
        { date: '1-May-07', close: 99.452357 },
        { date: '2-May-07', close: 110.4352357 },
        { date: '3-May-07', close: 80.47253 },
        { date: '4-May-07', close: 99.4523537 },
        { date: '5-May-07', close: 66.42357 },
      ]
    }
  }
}
</script>

<style scoped>

</style>