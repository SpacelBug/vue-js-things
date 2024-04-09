<template>
  <div class="time-chooser">
    <div class="time-chooser-time-input-box">
      <TransitionGroup tag="div"
                       class="time-scroller"
                       :name="transitionName"
                       @wheel.passive="changeHours">
        <div
            v-for="(hour, index) in hoursList"
            :class="['time-cell',{'current-time-cell': index === 2}]"
            :key="hour">
          {{ hour.toString().padStart(2, '0') }}
        </div>
        <div class="time-scroller-active-cell" :key="-1"/>
      </TransitionGroup>
      <template v-if="(accuracy === 'min') || (accuracy === 'sec')">
        <div class="time-divider">:</div>
        <TransitionGroup tag="div"
                         class="time-scroller"
                         :name="transitionName"
                         @wheel.passive="changeMinutes">
          <div
              v-for="(minute, index) in minutesList"
              :class="['time-cell',{'current-time-cell': index === 2}]"
              :key="minute">
            {{ minute.toString().padStart(2, '0') }}
          </div>
          <div class="time-scroller-active-cell" :key="-1"/>
        </TransitionGroup>
      </template>
      <template v-if="accuracy === 'sec'">
        <div class="time-divider">:</div>
        <TransitionGroup tag="div"
                         class="time-scroller"
                         :name="transitionName"
                         @wheel.passive="changeSeconds">
          <div
              v-for="(second, index) in secondsList"
              :class="['time-cell',{'current-time-cell': index === 2}]"
              :key="second">
            {{ second.toString().padStart(2, '0') }}
          </div>
          <div class="time-scroller-active-cell" :key="-1"/>
        </TransitionGroup>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimeChooser",
  emits: ['update:modelValue'],
  props: {
    modelValue: Object,
    accuracy: String,

    mainColor: String,
    backgroundColor: String,
    additionalColor: String,
    activeColor: String,
  },
  data() { return {
    hoursList: [],
    minutesList: [],
    secondsList: [],

    transitionName: 'scroll-down'
  }},
  mounted() {
    this.hoursList = this.getTimeNumbersList(this.modelValue.getHours(), 24)
    this.minutesList = this.getTimeNumbersList(this.modelValue.getMinutes(), 60)
    this.secondsList = this.getTimeNumbersList(this.modelValue.getSeconds(), 60)
  },
  methods: {
    changeTimeNumbersList(list, max) {
      if (event.deltaY > 0) {
        let newValue = (list[list.length - 1] + 1) < max - 1 ? list[list.length - 1] + 1 : 0
        this.transitionName = 'scroll-down'
        list.splice(0, 1)
        list.push(newValue)
      } else {
        let newValue = (list[0] - 1) < 0 ? max - 1 : list[0] - 1
        this.transitionName = 'scroll-up'
        list.pop()
        list.unshift(newValue)
      }
    },
    getTimeNumbersList(current, max) {
      let list = []

      for (let number = current - 2; number < current + 3; number++) {
        if (number < 0) {
          list.push(max + number)
        } else if (number > max - 1) {
          list.push(number - max)
        } else {
          list.push(number)
        }
      }

      return list
    },
    changeHours() {
      let currentIndex = this.hoursList.indexOf(this.modelValue.getHours())
      let value = event.deltaY > 0 ? this.hoursList[currentIndex + 1] : this.hoursList[currentIndex - 1]

      this.changeTimeNumbersList(this.hoursList, 24)

      this.modelValue.setHours(value)
      this.$emit('update:modelValue', new Date(this.modelValue))
    },
    changeMinutes() {
      let currentIndex = this.minutesList.indexOf(this.modelValue.getMinutes())
      let value = event.deltaY > 0 ? this.minutesList[currentIndex + 1] : this.minutesList[currentIndex - 1]

      this.changeTimeNumbersList(this.minutesList, 60)

      this.modelValue.setMinutes(value)
      this.$emit('update:modelValue', new Date(this.modelValue))
    },
    changeSeconds() {
      let currentIndex = this.secondsList.indexOf(this.modelValue.getSeconds())
      let value = event.deltaY > 0 ? this.secondsList[currentIndex + 1] : this.secondsList[currentIndex - 1]

      this.changeTimeNumbersList(this.secondsList, 60)

      this.modelValue.setSeconds(value)
      this.$emit('update:modelValue', new Date(this.modelValue))
    }
  }
}
</script>

<style scoped>
/***Animations***/
.scroll-down-move{
  transition: all 0.1s linear;
}
.scroll-down-enter-from{
  opacity: 0;
  transform: translateY(30px);
}
.scroll-down-enter-active{
  transition: all 0.1s linear;
  bottom: 0;
}
.scroll-down-enter-to{
  opacity: 1;
}
.scroll-down-leave-from{
  opacity: 1;
}
.scroll-down-leave-active{
  position: absolute;
  top: 0;
  transition: all 0.1s linear;
}
.scroll-down-leave-to{
  transform: translateY(-30px);
  opacity: 0;
}
.scroll-up-move{
  transition: all 0.1s linear;
}
.scroll-up-enter-from{
  opacity: 0;
  transform: translateY(-30px);
}
.scroll-up-enter-active{
  transition: all 0.1s linear;
  bottom: 0;
}
.scroll-up-enter-to{
  opacity: 1;
}
.scroll-up-leave-from{
  opacity: 1;
}
.scroll-up-leave-active{
  position: absolute;
  bottom: 0;
  transition: all 0.1s linear;
}
.scroll-up-leave-to{
  transform: translateY(30px);
  opacity: 0;
}
/******/
.time-chooser{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.time-chooser-time-input-box{
  padding: 16px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: v-bind(additionalColor);
  border-radius: 5px;
}
.time-cell{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 64px;
  font-size: 14px;
  color: #5F6B7A;
}
.current-time-cell{
  color: black;
}
.time-scroller{
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 5px;
  justify-content: center;
}
.time-scroller-active-cell{
  border-top: solid 1px v-bind(activeColor);
  border-bottom: solid 1px v-bind(activeColor);
  height: 32px;
  width: 100%;
  position: absolute;
  pointer-events: none;
}
.time-divider{
  display: flex;
  justify-content: center;
  width: 24px;
  height: 100%;
}
</style>