<template>
  <div id="EditableList">
    <input class="input-new-element" placeholder="..." ref="input" @keydown.enter="addNewElement">

    <transition-group name="list" class="list" appear tag="ul">
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
    orientation: {type: String, default: 'column'},

    textColor: {type: String, default: "white"},
    backgroundColor: {type: String, default: "grey"},
    border: {type: String, default: "none"},
    boxShadow: {type: String, default: "none"},
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
      console.log(index)

      this.$emit('update:modelValue', newList)
    }
  }
}
</script>

<style scoped>
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
.list-elem{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
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
</style>