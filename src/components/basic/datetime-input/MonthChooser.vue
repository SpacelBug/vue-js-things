<template>
  <div class="month-list">
    <div class="month-name-cell"
         v-for="(monthName, index) in monthNames"
         :class="{'active-month': index === modelValue.getMonth()}"
         @click="onMonthListClick(index)">
      {{monthName}}
    </div>
  </div>
</template>

<script>
export default {
  name: "MonthChooser",
  emits: ['update:modelValue'],
  props: {
    modelValue: Object,

    mainColor: String,
    backgroundColor: String,
    additionalColor: String,
    activeColor: String,
  },
  data () { return {
      monthNames: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
        ],
    }
  },
  methods: {
    onMonthListClick(index) {
      let date = this.modelValue
      let dayNumber = this.modelValue.getDate()
      let maxDayNumber = new Date(date.getFullYear(), index + 1, 0).getDate()

      if (dayNumber > maxDayNumber) {
        dayNumber = maxDayNumber
      }

      date.setFullYear(date.getFullYear(), index, dayNumber)

      this.$emit('update:modelValue', new Date(date))
    },
  }
}
</script>

<style scoped>
.month-list{
  margin-bottom: 16px 0;
  padding: 22px 0;
  display: grid;
  justify-items: center;
  align-content: center;
  grid-template-columns: repeat(3, 87px);
  grid-gap: 8px;
  border-radius: 5px;
  background: v-bind(additionalColor);
}
.month-name-cell{
  cursor: pointer;
  text-transform: uppercase;
  display: flex;
  color: black;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 35px;
  border-radius: 5px;
}
.month-name-cell:hover{
  background-color: v-bind(activeColor);
  transition: all 0.3s ease;
}
.active-month{
  background-color: v-bind(additionalColor);
  color: white;
}
.active-month:hover{
  color: white;
  background-color: v-bind(mainColor);
}
</style>