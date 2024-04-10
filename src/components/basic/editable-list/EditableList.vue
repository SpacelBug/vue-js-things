<template>
  <div id="EditableList">
    <input class="input-new-element" placeholder="..." ref="input" @keydown.enter="addNewElement">

    <transition-group
        :name="transitionName"
        :class="{'list': orientation === 'column', 'list-row': orientation === 'row'}"
        appear
        tag="ul"
    >
      <div v-for="(elem, index) in modelValue" class="list-elem" :key="elem">
        {{ elem }}
        <div class="cross-icon" @click="removeElement(index)"></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "EditableList",
  props: {
    modelValue: {type: Array, default: new Array([])},
    orientation: {type: String, default: 'row'},

    textColor: {type: String, default: "white"},
    backgroundColor: {type: String, default: "grey"},
    border: {type: String, default: "none"},
    boxShadow: {type: String, default: "none"},
  },
  computed: {
    transitionName() {
      return this.orientation === 'column' ? 'list' : 'list-row'
    }
  },
  methods: {
    addNewElement() {
      let newList = this.modelValue
      newList.push(this.$refs.input.value)

      this.$refs.input.value = null
      this.$emit('update:modelValue', newList)
    },
    removeElement(index) {
      let newList = this.modelValue
      newList.splice(index, 1)

      this.$emit('update:modelValue', newList)
    }
  }
}
</script>

<style scoped>
/******/
input{
  cursor: pointer;
  outline: none;
  border: v-bind(border);
  background-color: v-bind(backgroundColor);
  color: v-bind(textColor);
  box-shadow: v-bind(boxShadow);
}
#EditableList{
  color: v-bind(textColor)
}
.list{
  position: relative;
  padding: 0;
}
.list-row{
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 0;
  gap: 16px;
}
.list-elem{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
}
/***Icons***/
.cross-icon{
  cursor: pointer;
  background-color: v-bind(textColor);
  height: 15px;
  aspect-ratio: 1/1;
  mask-image: url("cross.svg");
  mask-size: contain;
}
/***Animations***/
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}

.list-row-move,
.list-row-enter-active {
  transition: all 0.5s ease;
}

.list-row-enter-from{
  transform: translateX(30px);
}
.list-row-leave-to {
  opacity: 0;
  display: none;
}
.list-row-leave-active {
  position: absolute;
  display: none;
}
</style>