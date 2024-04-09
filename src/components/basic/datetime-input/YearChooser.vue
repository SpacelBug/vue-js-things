<template>
  <div class="year-chooser-main-box">
    <div class="year-chooser-years-box">
      <div class="left-arrow-head" @click="formNewYearsList(listOfYears[0] - 27)"/>
      <div
          v-for="year in listOfYears"
          :class="['year-cell', {'year-cell-active': year === modelValue.getFullYear()}]"
          @click="onYearClick(year)">
        {{ year }}
      </div>
      <div class="right-arrow-head" @click="formNewYearsList(listOfYears[listOfYears.length - 1])"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "YearChooser",
  emits: ['update:modelValue'],
  props: {
    modelValue: {type: Object, default: new Date()},

    mainColor: String,
    backgroundColor: String,
    additionalColor: String,
    activeColor: String,
  },
  data() {
    return {
      listOfYears: []
    }
  },
  watch: {
    modelValue() {
      if (!this.listOfYears.includes(this.modelValue.getFullYear())) {
        if ((this.modelValue.getFullYear() + 1) === this.listOfYears[0]) {
          this.formNewYearsList(this.listOfYears[0] - 28)
        } else {
          this.formNewYearsList(this.modelValue.getFullYear())
        }
      }
    }
  },
  mounted() {
    let endYear = 0
    let startYear = 0

    if (
        ((this.modelValue.getFullYear() <= (new Date().getFullYear()) - 14)) ||
        (this.modelValue.getFullYear() > new Date().getFullYear())
    ) {
      endYear = this.modelValue.getFullYear() + 13
      startYear = this.modelValue.getFullYear() - 14
    } else {
      startYear = new Date().getFullYear() - 27
      endYear = new Date().getFullYear()
    }

    for (let year = startYear; year <= endYear; year++) {
     this.listOfYears.push(year)
    }
  },
  methods: {
    formNewYearsList(startYear) {
      let listOfYears = []

      for (let year = startYear; year <= startYear + 27; year++) {
        listOfYears.push(year)
      }

      this.listOfYears = listOfYears
    },
    onYearClick(year) {
      let date = this.modelValue
      date.setFullYear(year)

      this.$emit('update:modelValue', new Date(date))
    },
  }
}
</script>

<style scoped>
.year-chooser-main-box{
  background: v-bind(additionalColor);
  justify-items: center;
}
.year-chooser-years-box{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 4px;
  grid-area: years-box;
  justify-items: center;
  align-items: center;
  font-size: 14px;
  font-weight: lighter;
  border-radius: 5px;
}
.year-cell{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 50px;
  border-radius: 4px;
}
.year-cell:hover{
  background-color: v-bind(activeColor);
  transition: all 0.3s ease;
}
.year-cell-active{
  background-color: v-bind(activeColor);
  color: white;
}
.year-cell-active:hover{
  color: white;
  background-color: v-bind(activeColor);
}
.right-arrow-head{
  cursor: pointer;
  background-color: v-bind(mainColor);
  height: 30px;
  width: 30px;
  aspect-ratio: 1/1;
  mask-image: url("right-arrow-head.svg");
  mask-size: contain;
}
.left-arrow-head{
  cursor: pointer;
  background-color: v-bind(mainColor);
  height: 30px;
  width: 30px;
  aspect-ratio: 1/1;
  mask-image: url("left-arrow-head.svg");
  mask-size: contain;
}
</style>