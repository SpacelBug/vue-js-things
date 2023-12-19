<template>
<div>
  <div class="menu">
    <div class="menu-button" @click="chosenMenuOption = 'Примеры'">Примеры</div>
    <div class="menu-button" @click="chosenMenuOption = 'Перевод'">Перевод</div>
  </div>
  <chart-examples v-if="chosenMenuOption === 'Примеры'"/>
  <guide-translate v-if="chosenMenuOption === 'Перевод'"/>
</div>
</template>

<script>
import ChartExamples from "@/views/train/ChartExamples";
import GuideTranslate from "@/views/train/GuideTranslate";

export default {
  name: "TrainD3fc",
  components: {
    ChartExamples,
    GuideTranslate
  },
  data() { return {
      chosenMenuOption: null,
    }
  }
}
</script>

<style scoped>
.menu{
  display: flex;
  flex-direction: row;
  gap: 10px;
  font-weight: bolder;
  font-size: 16px;
  padding: 16px 8px;
  background-color: #212020;
  border-top: solid 1px white;
}
.menu-button{
  cursor: pointer;
  color: white;
  text-decoration: underline;
}
</style>