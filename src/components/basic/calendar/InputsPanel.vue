<template>
  <div :class="['date-input-button', {'transparent-background': !['day', 'hour', 'min', 'sec'].includes(accuracy)}]" ref="inputButton">
    <div class="inputs" v-if="isShowInputsPanel">
      <div v-if="inputType === 'datetime' || inputType === 'date'">
        <div v-if="['day', 'hour', 'min', 'sec'].includes(accuracy)" class="inputs-date">
          <div class="date-input">
            <input type="number"
                 ref="year"
                 class="button-inputs year-input"
                 max="9999"
                 :value="modelValue.getFullYear().toString().padStart(4, '0')"
                 @keydown="onInputKeyDown"
                 @input="onDateInput"
                 @focusin="selectInputText"
                 @keydown.right="focusNextElementInList(inputs)"
                 @keydown.left="focusPreviousElementInList(inputs)"
                 @keydown.enter="(e)=>{e.target.blur()}">
          </div>
          <div class="date-input">
            <input v-if="['month', 'day', 'hour', 'min', 'sec'].includes(accuracy)"
                 type="number"
                 ref="month"
                 class="button-inputs"
                 max="12"
                 :value="(modelValue.getMonth() + 1).toString().padStart(2, '0')"
                 @keydown="onInputKeyDown"
                 @input="onDateInput"
                 @focusin="selectInputText"
                 @keydown.right="focusNextElementInList(inputs)"
                 @keydown.left="focusPreviousElementInList(inputs)"
                 @keydown.enter="(e)=>{e.target.blur()}">
          </div>
          <div class="date-input">
            <input v-if="['day', 'hour', 'min', 'sec'].includes(accuracy)" type="number"
                 ref="day"
                 class="button-inputs"
                 :max="new Date(new Date().setFullYear(modelValue.getFullYear(), modelValue.getMonth() + 1, 0)).getDate()"
                 :value="modelValue.getDate().toString().padStart(2, '0')"
                 @keydown="onInputKeyDown"
                 @input="onDateInput"
                 @focusin="selectInputText"
                 @keydown.right="focusNextElementInList(inputs)"
                 @keydown.left="focusPreviousElementInList(inputs)"
                 @keydown.enter="(e)=>{e.target.blur()}">
          </div>
        </div>
        <div v-else class="date-caption" @click="$emit('calendarIconClick')">
          <div class="month" v-if="accuracy === 'month'">{{ monthNames[modelValue.getMonth()] }}</div>
          <div class="year">{{ modelValue.getFullYear() }}</div>
        </div>
      </div>

      <div v-if="(inputType === 'datetime' || inputType === 'time') && ['hour', 'min', 'sec'].includes(accuracy)" class="inputs-time">
        <div class="time-input">
          <input
              ref="hours"
              type="number"
              class="button-inputs"
              max="23"
              :value="modelValue.getHours().toString().padStart(2, '0')"
              @keydown="onInputKeyDown"
              @input="onTimeInput"
              @focusin="selectInputText"
              @keydown.right="focusNextElementInList(inputs)"
              @keydown.left="focusPreviousElementInList(inputs)"
              @keydown.enter="(e)=>{e.target.blur()}">
        </div>
        <div v-if="(accuracy === 'min') || (accuracy ===  'sec')" class="time-input">
          <input
              ref="minutes"
              type="number"
              class="button-inputs"
              max="59"
              :value="modelValue.getMinutes().toString().padStart(2, '0')"
              @keydown="onInputKeyDown"
              @input="onTimeInput"
              @focusin="selectInputText"
              @keydown.right="focusNextElementInList(inputs)"
              @keydown.left="focusPreviousElementInList(inputs)"
              @keydown.enter="(e)=>{e.target.blur()}">
        </div>
        <div v-if="accuracy === 'sec'" class="time-input">
          <input
              ref="seconds"
              type="number"
              class="button-inputs"
              max="59"
              :value="modelValue.getSeconds().toString().padStart(2, '0')"
              @keydown="onInputKeyDown"
              @input="onTimeInput"
              @focusin="selectInputText"
              @keydown.right="focusNextElementInList(inputs)"
              @keydown.left="focusPreviousElementInList(inputs)"
              @keydown.enter="(e)=>{e.target.blur()}">
        </div>
      </div>
    </div>
    <div :class="['calendar-icon', {'disabled-icon': !['day', 'hour', 'min', 'sec'].includes(accuracy)}]" @click="$emit('calendarIconClick')"/>
  </div>
</template>

<script>
export default {
  name: "InputHeader",
  emits: ['calendarIconClick'],
  props: {
    isShowInputsPanel: Boolean,
    modelValue: Object,
    accuracy: String,
    inputType: String,

    mainColor: String,
    backgroundColor: String,
    additionalColor: String,
    activeColor: String,
  },
  data() { return {
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
  }},
  computed: {
    inputBoundingClientRect: function () {
      return this.$refs.inputButton.getBoundingClientRect()
    },
    inputs: function () {
      return [
        this.$refs.year,
        this.$refs.month,
        this.$refs.day,
        this.$refs.hours,
        this.$refs.minutes,
        this.$refs.seconds
      ]
    }
  },
  updated() {
    console.log('updated')
  },
  methods: {
    onInputKeyDown() {
      if (isNaN(event.key)) {
        if ((event.key === 'Backspace') || ( event.key === 'Delete')) {
          event.target.value = null
        } else {
          event.preventDefault()
        }
      }
    },
    checkInputtedValue() {
      // проверка на максимальное значение
      let value = event.target.value
      let max = event.target.getAttribute('max')

      if (Number(value) > Number(max)){
        value = max
      }

      if (event.target === this.$refs.year) {
        if (Number(value).toString().length === 4) {
          this.focusNextElementInList(this.inputs)
        }
      } else {
        let firstDigit = Math.floor(Number(max) / 10)
        if (
            (Number(value) > firstDigit) ||
            (value.length >= 2)
        ) {
          this.focusNextElementInList(this.inputs)
        }
      }

      return value
    },
    onTimeInput() {
      event.target.value = this.checkInputtedValue()

      let newTime = new Date(this.modelValue)
      newTime.setHours(
          this.$refs.hours ? Number(this.$refs.hours.value) : 0,
          this.$refs.minutes ? Number(this.$refs.minutes.value) : 0,
          this.$refs.seconds ? Number(this.$refs.seconds.value) : 0
      )
      this.$emit('update:modelValue', newTime)
    },
    onDateInput() {
      event.target.value = this.checkInputtedValue()

      if (event.target.value !== '0') {
        let newDate = new Date(this.modelValue)

        newDate.setFullYear(
            this.$refs.year ? Number(this.$refs.year.value) : 0,
            this.$refs.month ? Number(this.$refs.month.value - 1) : 0,
            this.$refs.day ? Number(this.$refs.day.value) : 1
        )

        this.$emit('update:modelValue', newDate)
      }
    },
    focusNextElementInList(elems) {
      event.preventDefault()
      if ((elems.indexOf(event.target) + 1 <= elems.length) && (elems[elems.indexOf(event.target) + 1] !== undefined)) {
        elems[elems.indexOf(event.target) + 1].focus()
      } else {
        elems[elems.indexOf(event.target)].blur()
      }
    },
    focusPreviousElementInList(elems) {
      event.preventDefault()
        if ((elems.indexOf(event.target) - 1 >= 0) && (elems[elems.indexOf(event.target) - 1] !== undefined)) {
          elems[elems.indexOf(event.target) - 1].focus()
        }
    },
    selectInputText() {
      event.target.select()
    },
  }
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  appearance: none;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  -moz-appearance: textfield;
}
/***Input button***/
.date-input-button{
  display: flex;
  gap: 12px;
  flex-direction: row;
  background: v-bind(backgroundColor);
  border-radius: 5px;
  padding: 10px 24px;
}
.transparent-background{
  background: transparent;
}
.inputs{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
}
.inputs-date{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.date-input{
  display: flex;
  align-items: center;
}
.date-input::before{
  display: block;
  content: '-';
}
.date-input:first-child::before{
  display: none;
}
.date-caption{
  display: flex;
  flex-direction: row;
  gap: 8px;
  font-weight: bolder;
  font-size: 16px;
  text-transform: uppercase;
}
.inputs-time{
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.time-input{
  display: flex;
  align-items: center;
}
.time-input::before{
  display: block;
  content: ':';
}
.time-input:first-child::before{
  display: none;
}
.button-inputs{
  -webkit-user-select: all;
  user-select: all;
  border: none;
  height: 100%;
  width: 2ch;
  box-shadow: none;
  background-color: transparent;
  text-align: center;
  outline: none;
  border-radius: 0;
}
.year-input{
  width: 2.4em;
}
.calendar-icon{
  cursor: pointer;
  background-color: v-bind(additionalColor);
  height: 19px;
  width: 19px;
  aspect-ratio: 1/1;
  mask-image: url("calendar.svg");
  mask-size: contain;
}
.disabled-icon{
  background-color: v-bind(additionalColor);
  opacity: 0.7;
}
.date-input-button:hover .disabled-icon{
  background-color: v-bind(mainColor);
}
.date-input-button:hover .date-caption{
  color: v-bind(mainColor);
}
</style>