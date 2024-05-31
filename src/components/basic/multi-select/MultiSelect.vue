<template>
  <div
      id="MultiSelect"
      tabindex="0"
      @focusout="isShowOptions = false"
      @focusin="isShowOptions = true"
  >
    <div class="select-button">
      <div v-if="modelValue" class="value" :title="modelValue.join(', ')">{{ modelValue.join(', ') }}</div>
      <div v-else class="placeholder">{{ placeHolder }}</div>
      <div :class="['arrow-head-down-icon', {'arrow-head-down-icon-rotate': isShowOptions}]"/>
    </div>
    <transition name="options" appear>
      <div class="options" v-if="isShowOptions">
        <div
            v-for="(option, index) in options"
            :class="['option', {'active': selectedOptionsIndexes.has(Number(index))}]"
            @click="onOptionClick(index)"
        >
          {{ option }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "MultiSelect",
  props: {
    modelValue: {type: Array, default: null},
    options: {type: Array, default: new Array([])},

    placeHolder: {type: String, default: "Select values"},

    backgroundColor: {type: String, default: "grey"},
    activeColor: {type: String, default: "lightgrey"},
    border: {type: String, default: "none"},
    boxShadow: {type: String, default: "none"},
    optionsBoxHeight: {type: Number, default: 280},
  },
  computed: {
    selectedOptions() {
      let selectedOptions = Array.from(this.selectedOptionsIndexes).map((index)=>{
        return this.options[index]
      })
      return selectedOptions.length > 0 ? selectedOptions : null
    },
  },
  data() { return {
    selectedOptionsIndexes: new Set(),
    isShowOptions: false,
  }},
  methods: {
    onOptionClick(index) {
      this.selectedOptionsIndexes.has(index) ? this.selectedOptionsIndexes.delete(index) : this.selectedOptionsIndexes.add(index)
      this.$emit('update:modelValue', this.selectedOptions)
    }
  }
}
</script>

<style scoped>
#MultiSelect{
  position: relative;
  user-select: none;
}
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
.value{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/***OptionsClasses***/
.options{
  position: absolute;
  z-index: 1;
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
.option{
  cursor: pointer;
  padding: 4px 16px;
}
.active{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.active::after{
  display: block;
  content: '';
  height: 8px;
  width: 8px;
  border-radius: 8px;
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