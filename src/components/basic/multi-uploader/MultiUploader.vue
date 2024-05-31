<template>
  <div class="uploader-main-box">
    <input type="file" ref="download" @input="inputFiles">

    <div class="main-button" @click="isShowDownloadList = !isShowDownloadList" ref="mainButton">
      Загрузить файлы
    </div>

    <transition name="fade" appear>
      <div  v-show="isShowDownloadList" class="download-list" :style="`${panelPos}: 0`">
        <div
            :class="{'download-list-drop-area-images': type === 'images', 'download-list-drop-area-files': type !== 'images'}"
            ref="dropArea"
            @drop="inputFiles"
            @mouseenter="$refs.dropArea.focus()"
            @mouseleave="$refs.dropArea.blur()"
        >
          <div class="download-list-plus-button" @click="$refs.download.click()">Новый файл</div>
          <transition-group name="fade-down" appear>
            <div v-for="(file, index) in downloadingFiles" class="download-list-file" @click="removePreloadedFile(index)" :key="file">
                <img v-if="type === 'images'" :src="createUrl(file)">
                <template v-else>{{ file.name }}</template>
            </div>
          </transition-group>
          <div v-if="downloadingFiles.length === 0" class="download-list-placeholder">Перетащите файлы суда</div>
        </div>

        <div class="download-box-buttons">
          <div class="download-box-cancel" @click="isShowDownloadList = false; downloadingFiles = []">Отмена</div>
          <div class="download-box-download" @click="upload">Загрузить</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "FileLoader",
  emits: ['cancel', 'upload'],
  props: {
    type: {type: String, default: 'images'},

    border: {type: String, default: 'none'},
    backgroundColor: {type: String, default: 'grey'},
    additionalColor: {type: String, default: 'darkgrey'},
  },
  data() { return {
    isShowDownloadList: false,
    downloadingFiles: [],
    panelPos: null,
  }},
  mounted() {
    document.addEventListener('dragover', ()=>{event.preventDefault()})
    document.addEventListener('dragend', ()=>{event.preventDefault()})
    document.addEventListener('drop', ()=>{event.preventDefault()})

    if (this.$refs.mainButton.getBoundingClientRect().x > (document.body.clientWidth / 2)) {
      this.panelPos = 'right'
    } else {
      this.panelPos = 'left'
    }
  },
  unmounted() {
    document.removeEventListener('dragover', ()=>{event.preventDefault()})
    document.removeEventListener('dragend', ()=>{event.preventDefault()})
    document.removeEventListener('drop', ()=>{event.preventDefault()})
  },
  methods: {
    inputFiles() {
      let files = event.dataTransfer ? event.dataTransfer.files : event.target.files

      for (let file of files) {
        let fileNames = this.downloadingFiles.map((file)=>{return file.name})

        if (fileNames.includes(file.name)) {
          alert('File already exist')
        } else {
          if (this.type === 'images') {
            if (file.type.split('/')[0] === 'image') {
              this.downloadingFiles.push(file)
            } else {
              alert(`File ${file.name} is not an image`)
            }
          } else {
            this.downloadingFiles.push(file)
          }
        }
      }
    },
    upload() {
      if (this.downloadingFiles.length > 0) {
        this.$emit('upload', this.downloadingFiles)
      } else {
        alert('Have no files')
      }
    },
    clearFilesList() {
      this.downloadingFiles = []
    },
    createUrl(image) {
      return URL.createObjectURL(image)
    },
    removePreloadedFile(index) {
      this.downloadingFiles.splice(index, 1)
    }
  },
}
</script>

<style scoped>
/***Animation***/
.fade-enter-from{
  opacity: 0;
}
.fade-enter-active{
  transition: all 0.3s ease;
}
.fade-enter-to{
  opacity: 1;
}
.fade-leave-from{
  opacity: 1;
}
.fade-leave-active{
  transition: all 0.3s ease;
}
.fade-leave-to{
  opacity: 0;
}
.fade-down-move{
  transition: all 0.3s ease;
}
.fade-down-enter-from{
  opacity: 0;
  transform: translateY(30px);
}
.fade-down-enter-active{
  transition: all 0.3s ease;
}
.fade-down-enter-to{
  opacity: 1;
}
.fade-down-leave-from{
  opacity: 1;
}
.fade-down-leave-active{
  transition: all 0.3s ease;
}
.fade-down-leave-to{
  opacity: 0;
}
/******/
.uploader-main-box{
  position: relative;
}
.main-button{
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
  width: fit-content;
  padding: 8px 16px;
  background-color: v-bind(backgroundColor);
}
.download-list{
  position: absolute;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background-color: v-bind(backgroundColor);
  padding: 15px;
  border: v-bind(border);
  border-radius: 5px;
  width: fit-content;
}
.download-list-drop-area-images{
  outline: none;
  position: relative;
  user-select: none;
  display: grid;
  grid-auto-rows: max-content;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  padding: 10px;
  height: 280px;
  width: 250px;
  overflow-y: auto;
  border-radius: 5px;
  background-color: v-bind(additionalColor);
}
.download-list-drop-area-files{
  display: flex;
  flex-direction: column;
  gap: 10px;
  outline: none;
  position: relative;
  user-select: none;
  height: 280px;
  width: 250px;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 5px;
  background-color: v-bind(additionalColor);
}
.download-list-placeholder{
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  width: 100%;
  overflow: hidden;
  font-weight: bolder;
}
.download-box-buttons{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  height: 50px;
}
.download-box-buttons > div{
  cursor: pointer;
  padding: 4px 16px;
  border: v-bind(border);
  border-radius: 4px;
}
.download-list-plus-button{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
  border: v-bind(border);
  border-radius: 5px;
}
.download-list-file{
  position: relative;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.download-list-file:hover::before{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: rgba(30, 30, 30, 0.8);
  width: 100%;
  height: 100%;
  content: 'Удалить';
}
.download-list-file img{
  width: 100%;
  aspect-ratio: 1/1;
  border: v-bind(border);
  border-radius: 5px;
}
input{
  display: none;
}
.download-list-file img{
  width: 100%;
}
</style>