<template>
  <div
      id="FilteredSelect"
      tabindex="0"
      @focusout="isShowOptions = false"
      @focusin="isShowOptions = true"
  >
    <div class="select-button">
      <input class="value" v-model="inputtedValue" placeholder="..." @keydown.enter="inputKeyDownEnter" ref="input">
      <div class="place-holder"></div>
      <div :class="['arrow-head-down-icon', {'arrow-head-down-icon-rotate': isShowOptions}]"/>
    </div>

    <transition name="options" appear>
      <div class="select-options" v-if="isShowOptions" :key="filteredOptions.length">
        <div class="select-option" v-for="option in filteredOptions" @mousedown.prevent="optionClick(option)">
          {{option}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "FilteredSelect",
  props: {
    modelValue: {type: String, default: null},
    options: {type: Array, default: new Array([])},

    backgroundColor: {type: String, default: 'grey'},
    activeColor: {type: String, default: 'lightgrey'},
    border: {type: String, default: 'none'},
    boxShadow: {type: String, default: 'none'},
    optionsBoxHeight: {type: Number, default: 280},
    textColor: {type: String, default: 'white'},
  },
  data() { return {
    inputtedValue: this.modelValue,
    isShowOptions: false,
  }},
  watch: {
    modelValue() {
      this.inputtedValue = this.modelValue
    }
  },
  computed: {
    filteredOptions() {
      let newList = []

      if (this.inputtedValue) {
        for (let option of this.options) {
          if (option.includes(this.inputtedValue)) {
            newList.push(option)
          }
        }
      } else {
        newList = this.options
      }

      return newList
    }
  },
  methods: {
    inputKeyDownEnter() {
      event.target.blur()
      this.$el.blur()
      this.$emit('update:modelValue', this.filteredOptions[0])
    },
    optionClick(option) {
      this.$el.blur()
      this.$refs.input.blur()
      this.$emit('update:modelValue', option)
    }
  }
}
</script>

<style scoped>
#FilteredSelect{
  position: relative;
  user-select: none;
  color: v-bind(textColor);
}
input{
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  box-shadow: none;
  border: none;
  outline: none;
  color: v-bind(textColor);
}
/***ButtonClasses***/
.select-button{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: v-bind(backgroundColor);
  border: v-bind(border);
  box-shadow: v-bind(boxShadow);
  height: fit-content;
  width: 100%;
  cursor: pointer;
  padding: 4px 16px;
}
/***OptionsClasses***/
.select-options{
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: v-bind(optionsBoxHeight + 'px');
  background-color: v-bind(backgroundColor);
  border: v-bind(border);
  box-shadow: v-bind(boxShadow);
  width: calc(100% + 16px * 2);
  padding: 0;
  overflow-y: auto;
}
.select-option{
  cursor: pointer;
  padding: 4px 16px;
}
.select-option:hover{
  background-color: v-bind(activeColor);
  opacity: 0.8;
}
.active{
  background-color: v-bind(activeColor);
}
.keyboard-selected{
  background-color: v-bind(activeColor);
  opacity: 0.8;
}
/***Animations***/
.options-enter-from{
  max-height: 0;
}
.options-enter-active{
  transition: all 0.3s ease;
  overflow: hidden;
}
.options-enter-to{
  max-height: v-bind(optionsBoxHeight + 'px');
}
.options-leave-from{
  max-height: v-bind(optionsBoxHeight + 'px');
}
.options-leave-active{
  transition: all 0.3s ease;
  overflow: hidden;
}
.options-leave-to{
  max-height: 0;
}
/***Icons***/
.arrow-head-down-icon{
  cursor: pointer;
  background-color: v-bind(textColor);
  height: 15px;
  width: 15px;
  aspect-ratio: 1/1;
  mask-image: url("arrow-head-down.svg");
  mask-size: contain;
}
.arrow-head-down-icon-rotate{
  transform: rotate(180deg);
}
</style>