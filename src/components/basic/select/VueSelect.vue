<template>
  <div
      id="VueSelect"
      tabindex="0"
      @focusout="isShowOptions = false"
      @focusin="isShowOptions = true"
  >
    <div class="select-button">
      <div v-if="modelValue" class="value">{{ modelValue }}</div>
      <div v-else class="placeholder"> {{ placeholder }} </div>
      <div :class="['arrow-head-down-icon', {'arrow-head-down-icon-rotate': isShowOptions}]"/>
    </div>
    <transition name="options" appear>
      <div
          class="select-options"
          v-if="isShowOptions"
      >
        <div
            v-for="option in options"
            :class="['select-option', {'active': modelValue === option}]"
            @click="select"
        >
          {{ option }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "VueSelect",
  props: {
    modelValue: {type: String, default: null},
    options: {type: Array, default: new Array([])},
    placeholder: {type: String, default: 'Select value'},

    backgroundColor: {type: String, default: 'grey'},
    activeColor: {type: String, default: 'lightgrey'},
    border: {type: String, default: 'none'},
    boxShadow: {type: String, default: 'none'},
    optionsBoxHeight: {type: Number, default: 280}
  },
  data() { return {
    isShowOptions: false
  }},
  methods: {
    select() {
      this.$el.blur()
      this.$emit('update:modelValue', event.target.innerText)
    }
  }
}
</script>

<style scoped>
#VueSelect{
  position: relative;
  user-select: none;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: v-bind(optionsBoxHeight + 'px');
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
  background-color: v-bind($el.style.color);
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