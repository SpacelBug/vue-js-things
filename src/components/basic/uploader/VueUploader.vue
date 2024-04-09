<template>
  <div id="VueUploader">
    <input type="file" ref="download" @input="inputFiles">

    <transition name="fade" appear>
      <div class="preloaded-file" v-if="file">
        <div class="preloaded-file-name" :title="file.name">Файл: {{ file.name }}</div>
        <div class="cross-icon" @click="cancelFile"/>
      </div>

      <div v-else class="uploader-button" @click="$refs.download.click()">
        <div class="uploader-button-caption">
          <slot>
            Выбрать файл
          </slot>
        </div>
        <div class="plus-icon"/>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: "VueUploader",
  emits: ['inputFile', 'cancelFile'],
  props: {
    backgroundColor: {type: String, default: 'grey'},
    textColor: {type: String, default: 'white'},
    border: {type: String, default: 'none'},
  },
  data() { return {
    file: null,
  }},
  methods: {
    inputFiles() {
      this.file = event.dataTransfer ? event.dataTransfer.files : event.target.files[0]
      this.$emit('inputFile', this.file)
    },
    cancelFile() {
      this.file = null
      this.$emit('cancelFile')
    }
  }
}
</script>

<style scoped>
/***Animations***/
.fade-enter-from{
  opacity: 0
}
.fade-enter-active{
  transition: all 0.3s ease
}
.fade-enter-to{
  opacity: 1
}
.fade-leave-from{
  opacity: 1
}
.fade-leave-active{
  position: absolute;
  transition: all 0.3s ease
}
.fade-leave-to{
  opacity: 0
}
/******/
#VueUploader{
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  color: v-bind(textColor);
}
input{
  display: none;
}
.uploader-button{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 8px 16px;
  background-color: v-bind(backgroundColor);
  border: v-bind(border);
  width: 100%;
}
.uploader-button:hover{
  opacity: 0.9;
}
.preloaded-file{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;
  padding: 8px 16px;
  background-color: v-bind(backgroundColor);
  border: v-bind(border);
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
.plus-icon{
  cursor: pointer;
  background-color: v-bind(textColor);
  height: 15px;
  aspect-ratio: 1/1;
  mask-image: url("plus.svg");
  mask-size: contain;
}
</style>