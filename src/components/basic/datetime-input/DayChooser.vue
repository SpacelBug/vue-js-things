<template>
  <div class="calendar-box">
    <div class="dates-box">

      <div class="day-names">
        <div class="day-name">Пн</div>
        <div class="day-name">Вт</div>
        <div class="day-name">Ср</div>
        <div class="day-name">Чт</div>
        <div class="day-name">Пт</div>
        <div class="day-name">Сб</div>
        <div class="day-name">Вс</div>
      </div>

      <transition :name="transitionName" appear mode="out-in">
        <div class="day-numbers-list" v-if="calendarList.length > 0">
          <div v-for="(date, index) in calendarList" key="index">
            <div
              :title="date"
              :class="['date-cell',{'date-cell-active': checkDates(date, modelValue), 'date-cell-deactivated': date.getMonth() !== modelValue.getMonth()}]"
              @mousedown="selectDate(date)"
            >
              {{ date.getDate() }}
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "DayChooser",
  emits: ['update:modelValue'],
  props: {
    modelValue: Date,

    mainColor: String,
    backgroundColor: String,
    additionalColor: String,
    activeColor: String,
  },
  data() {
    return {
      calendarList: [],
      oldModelValue: this.modelValue,

      transitionName: 'right-fade'
    }
  },
  watch: {
    async modelValue(value) {
      if (this.oldModelValue.getMonth() !== value.getMonth()) {
        this.transitionName = value.getTime() > this.oldModelValue.getTime() ? 'right-fade' : 'left-fade'
        await (this.calendarList = [])
        this.oldModelValue = value
      }

      this.calendarList = this.getCalendarDates(this.modelValue)
    }
  },
  mounted() {
    this.calendarList = this.getCalendarDates(this.modelValue)
  },
  methods: {
    checkDates(firstDate, secondDate) {
      if (
          (firstDate.getDate() === secondDate.getDate()) &&
          (firstDate.getMonth() === secondDate.getMonth()) &&
          (firstDate.getFullYear() === secondDate.getFullYear())
      ) {
        return true
      } else {
        return false
      }
    },
    // Create array of dates
    getCalendarDates(date = new Date()) {
      const today = new Date(date)

      let firstDayOfCalendar = new Date(today)
      firstDayOfCalendar.setDate(1)
      firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay())

      let dates = []

      for (let dayCounter = 0; dayCounter < 42; dayCounter++) {
        dates.push(new Date(firstDayOfCalendar))
        firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() + 1)
      }

      return dates
    },
    async selectDate(date) {
      this.$emit('update:modelValue', new Date(date))
    },
  }
}
</script>

<style scoped>
/***Animations***/
.right-fade-enter-from{
  opacity: 0;
  transform: translateX(10px);
}
.right-fade-enter-active{
  transition: all 0.2s ease;
}
.right-fade-enter-to{
  opacity: 1;
}
.right-fade-leave-from{
  opacity: 1;
}
.right-fade-leave-active{
  transition: all 0.2s ease;
}
.right-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.left-fade-enter-from{
  opacity: 0;
  transform: translateX(-10px);
}
.left-fade-enter-active{
  transition: all 0.2s ease;
}
.left-fade-enter-to{
  opacity: 1;
}
.left-fade-leave-from{
  opacity: 1;
}
.left-fade-leave-active{
  transition: all 0.2s ease;
}
.left-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
/***Container for day chooser***/
.calendar-box{
  position: absolute;
  top: 0;
}
/**Box of days**/
.dates-box{
  display: flex;
  flex-direction: column;
  background: v-bind(additionalColor);
  border-radius: 5px;
  padding: 0 8px 0 0;
}
/*Days week name*/
.day-names{
  display: grid;
  grid-gap: 4px;
  grid-template-columns: repeat(7, 1fr);
}
.day-name{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  aspect-ratio: 1/1;
}
/*Cell of a day with date number*/
.day-numbers-list{
  display: grid;
  grid-gap: 4px;
  grid-template-columns: repeat(7, 1fr);
}
.date-cell{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 35px;
  border-radius: 100%;
  color: black;
  transition: all 0.3s ease;
}
.date-cell:hover{
  background-color: v-bind(activeColor);
}
.date-cell-active{
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  background-color: v-bind(activeColor);
}
.date-cell-active:hover{
  background-color: v-bind(activeColor);
}
.date-cell-deactivated{
  opacity: 0.6;
}
</style>