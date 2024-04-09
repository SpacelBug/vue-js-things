<template>
  <div class="date-input">

    <inputs-panel :is-show-inputs-panel="isShowInputsPanel"
                  :model-value="modelValue"
                  :accuracy="accuracy"
                  :input-type="inputType"
                  :mainColor="mainColor"
                  :backgroundColor="backgroundColor"
                  :additionalColor="additionalColor"
                  :activeColor="activeColor"
                  @update:modelValue = "(value)=>{$emit('update:modelValue', value)}"
                  @calendarIconClick="onCalendarIconClick"
                  ref="inputs"/>

    <transition name="fade" appear>
      <div v-if="isShowCalendar"
           ref="calendar"
           class="main-datetime-input-box"
           :style="`${calendarPos}: 0;`"
           tabindex="0"
           @wheel.prevent>

        <div class="datetime-choosers">

          <div :class="['datetime-headers', {'datetime-headers-single': (inputType === 'time') || (inputType === 'date')}]">

            <div v-if="inputType === 'datetime' || inputType === 'date'" class="date-chooser-header">
              <div class="arrows arrow-left" @click="preMonth"/>
              <transition :name="captionTransitionName" mode="out-in">
                <div class="calendar-header-caption" :key="choosingDate.getMonth() + choosingDate.getFullYear()">
                  <div v-if="accuracy !== 'year'"
                       @click="isShowMonthChooser = true; isShowYearChooser = false">
                    {{ monthNames[choosingDate.getMonth()] }}
                  </div>
                  <div @click="isShowYearChooser = true; isShowMonthChooser = false">
                    {{ choosingDate.getFullYear() }}
                  </div>
                </div>
              </transition>
              <div class="arrows arrow-right" @click="nextMonth"/>
            </div>

            <div v-if="(inputType === 'datetime' || inputType === 'time') && !['year', 'month', 'day'].includes(accuracy)" class="time-chooser-header">
              <div>{{choosingDate.getHours().toString().padStart(2, '0')}}</div>
              <div v-if="(accuracy === 'min') || (accuracy === 'sec')">:{{choosingDate.getMinutes().toString().padStart(2, '0')}}</div>
              <div v-if="accuracy === 'sec'">:{{choosingDate.getSeconds().toString().padStart(2, '0')}}</div>
            </div>

            <img class="cancel-button" src="./cross.svg" @click="closeCalendar">
          </div>

          <div class="date-time-choosers">

            <div v-if="inputType === 'datetime' || inputType === 'date'" class="date-chooser">
              <div class="date-chooser-blocks">
                <transition name="fade" mode="out-in">
                  <year-chooser
                      v-if="isShowYearChooser || (accuracy === 'year')"
                      v-model="choosingDate"
                      :mainColor="mainColor"
                      :backgroundColor="backgroundColor"
                      :additionalColor="additionalColor"
                      :activeColor="activeColor"
                      @update:modelValue="isShowYearChooser = false"/>

                  <month-chooser
                      v-else-if="isShowMonthChooser || (accuracy === 'month')"
                      v-model="choosingDate"
                      :mainColor="mainColor"
                      :backgroundColor="backgroundColor"
                      :additionalColor="additionalColor"
                      :activeColor="activeColor"
                      @update:modelValue="isShowMonthChooser = false"/>

                  <day-chooser
                      v-else
                      v-model="choosingDate"
                      :mainColor="mainColor"
                      :backgroundColor="backgroundColor"
                      :additionalColor="additionalColor"
                      :activeColor="activeColor"
                      ref="dayChooser"/>
                </transition>
              </div>
            </div>

            <time-chooser
                v-if="(inputType === 'datetime' || inputType === 'time') && !['year', 'month', 'day'].includes(accuracy)"
                :mainColor="mainColor"
                :backgroundColor="backgroundColor"
                :additionalColor="additionalColor"
                :activeColor="activeColor"
                :accuracy="accuracy" class="time-chooser"
                v-model="choosingDate"/>
          </div>

          <div class="date-input-footer">
            <div class="submit-button" @click="onSubmitClick">
              Установить
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import YearChooser from "@/components/basic/calendar/YearChooser";
import MonthChooser from "@/components/basic/calendar/MonthChooser";
import DayChooser from "@/components/basic/calendar/DayChooser";
import TimeChooser from "@/components/basic/calendar/TimeChooser";
import InputsPanel from "@/components/basic/calendar/InputsPanel";

export default {
  name: "CustomCalendar",
  emits: ['update:modelValue'],
  components: {
    MonthChooser,
    DayChooser,
    YearChooser,
    TimeChooser,
    InputsPanel,
  },
  props: {
    modelValue: {type: Date, default: new Date()},

    mainColor: {type: String, default: 'dimgrey'},
    backgroundColor: {type: String, default: 'grey'},
    additionalColor: {type: String, default: 'darkgrey'},
    activeColor: {type: String, default: 'lightgrey'},

    inputType: {type: String, default: 'datetime'},
    accuracy: {type: String, default: 'min'}, // может быть равна одной из след. строк: year, month, day, hour, min, sec
    isShowInputsPanel: {type: Boolean, default: true}
  },
  data() { return {
      selectedInput: null,
      choosingDate: new Date(this.modelValue),
      isShowCalendar: false,
      isShowYearChooser: false,
      isShowMonthChooser: false,
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
    captionTransitionName: 'right-fade',
    }
  },
  computed: {
    calendarPos() {
      if (this.$refs.inputs.inputBoundingClientRect.x > (document.body.clientWidth / 2)) {
        return 'right'
      } else {
        return 'left'
      }
    }
  },
  methods: {
    // when click on input-button
    onCalendarIconClick() {
      this.choosingDate = new Date(this.modelValue)

      this.isShowCalendar = !this.isShowCalendar
    },
    closeCalendar() {
      this.isShowCalendar = false
      this.isShowYearChooser = false
      this.isShowMonthChooser = false
    },
    async changeMonth(value) {
      let date = new Date(this.choosingDate)
      let dayNumber = this.choosingDate.getDate()
      let monthNumber = this.accuracy === 'year' ? date.getMonth() + (value * 12) : date.getMonth() + value
      let maxDayNumber = new Date(date.getFullYear(), monthNumber + 1, 0).getDate()

      if (dayNumber > maxDayNumber) {
        dayNumber = maxDayNumber
      }

      date.setFullYear(date.getFullYear(), monthNumber, dayNumber)

      this.choosingDate = new Date(date)
    },
    preMonth() {
      this.captionTransitionName = 'left-fade'
      this.changeMonth(-1)
    },
    nextMonth() {
      this.captionTransitionName = 'right-fade'
      this.changeMonth(1)
    },
    onSubmitClick() {
      this.$emit('update:modelValue', this.choosingDate)
      this.closeCalendar()
    },
  },
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
.fade-enter-from{
  opacity: 0;
}
.fade-enter-active{
  transition: all 0.2s ease;
}
.fade-enter-to{
  opacity: 1;
}
.fade-leave-from{
  opacity: 1;
}
.fade-leave-active{
  transition: all 0.2s ease;
}
.fade-leave-to {
  opacity: 0;
}
/******/
.datetime-choosers{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 16px;
}
.date-input{
  position: relative;
  display: grid;
  justify-items: center;
}
/***Main container for all choosers***/
.main-datetime-input-box{
  display: flex;
  position: absolute;
  user-select: none;
  top: 40px;
  z-index: 99;
  overflow: hidden;
  background: v-bind(backgroundColor);
  box-shadow: 2px 2px 4px 0px #00000040;
  color: black;
  outline: none;
  border-radius: 5px;
  height: 410px;
}
.date-time-choosers{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  gap: 16px;
}
.date-time-choosers-single{
  display: flex;
  flex-direction: column;
  height: 328px;
}
.date-time-choosers-only-time{
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
  padding: 16px;
}
.date-time-choosers-only-date{
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
  padding: 16px;
}
.date-chooser{
  position: relative;
  display: flex;
  height: 270px;
  width: 280px;
  justify-content: center;
  align-items: center;
}
.time-chooser{
  background: v-bind(backgroundColor);
  margin: auto;
}
/**Caption block**/
.datetime-headers{
  display: flex;
  height: 50px;
  gap: 16px;
  padding: 0 16px;
  background: v-bind(mainColor);
  grid-area: datetime-header;
}
.time-chooser-header{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  text-transform: uppercase;
  grid-area: time-header;
  width: 100%;
}
.time-chooser-header div{
  display: flex;
  align-items: center;
}
.date-chooser-header{
  display: grid;
  grid-template-columns: 25px 150px 25px;
  justify-content: center;
  align-items: center;
  justify-items: center;
  font-size: 14px;
  font-weight: lighter;
  text-transform: uppercase;
  text-align: center;
  grid-area: date-header;
  height: 50px;
  min-width: 280px;
  max-width: 280px;
}
.calendar-header-caption{
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-weight: bolder;
  gap: 8px;
}
.calendar-header-caption > div:hover{
  cursor: pointer;
  color: v-bind(activeColor);
  transition: all 0.3s ease;
}
/*Arrows in caption*/
.arrows:hover{
  cursor: pointer;
  border-color: v-bind(activeColor);
  transition: all 0.3s ease;
}
.arrow-right{
  border: solid v-bind(backgroundColor);
  border-width: 0 1px 1px 0;
  display: inline-block;
  height: 8px;
  width: 8px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}
.arrow-left{
  border: solid v-bind(backgroundColor);
  border-width: 0 1px 1px 0;
  display: inline-block;
  height: 8px;
  width: 8px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}
.date-chooser-blocks{
  display: flex;
  align-items: center;
  justify-content: center;
}
.submit-button{
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: v-bind(mainColor);
  padding: 8px 32px 8px 32px;
  font-weight: 500;
  border-radius: 5px;
  color: white;
}
.date-input-footer{
  padding-top: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-area: footer;
}
.cancel-button{
  position: absolute;
  cursor: pointer;
  height: 30px;
  width: 30px;
  top: 10px;
  right: 5px;
  filter: grayscale(1);
  transition: all 0.3s ease;
  opacity: 0.1;
}
.cancel-button:hover{
  opacity: 0.5;
}
.time-input{
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>