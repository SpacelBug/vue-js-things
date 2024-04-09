<template>
  <div id="VueUploader">
    <input type="file" ref="download" @input="inputFiles">

    <div class="uploader-button" @click="$refs.download.click()">
      <div class="uploader-button-caption">
        <slot>
          Выберите файл
        </slot>
      </div>
      <div class="uploader-button-icon"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VueUploader",
  emits: ['inputFile'],
  props: {
    backgroundColor: {type: String, default: 'grey'},
    border: {type: String, default: 'none'},
  },
  data() { return {

  }},
  methods: {
    inputFiles() {
      let file = event.dataTransfer ? event.dataTransfer.files : event.target.files[0]
      this.$emit('inputFile', file)
    }
  }
}
</script>

<style scoped>
input{
  display: none;
}
.uploader-button{
  cursor: pointer;
  user-select: none;
  padding: 8px 16px;
  background-color: v-bind(backgroundColor);
  border: v-bind(border);
}
</style>