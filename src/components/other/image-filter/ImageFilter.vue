<template>
  <div id="ImageFilter">
    <div class="filter-panel">
      <div class="filter">
        <div class="filter-name">Greyscale</div>
        <input type="range" v-model="filters.greyscale" min="0" max="100" @input="applyFilter">
      </div>
      <div class="filter">
        <div class="filter-name">Sepia</div>
        <input type="range" v-model="filters.sepia" min="0" max="100" @input="applyFilter">
      </div>
      <div class="filter">
        <div class="filter-name">Invert</div>
        <input type="range" v-model="filters.invert" min="0" max="100" @input="applyFilter">
      </div>
      <div class="filter">
        <div class="filter-name">Blur</div>
        <input type="range" v-model="filters.blur" min="0" max="100" @input="applyFilter">
      </div>
      <div class="filter">
        <div class="filter-name">Hue rotate</div>
        <input type="range" v-model="filters.hueRotate" min="0" max="360" @input="applyFilter">
      </div>
      <div class="filter">
        <div class="filter-name">Contrast</div>
        <input type="range" v-model="filters.contrast" min="0" max="3" step="0.1" @input="applyFilter">
      </div>
      <div class="filter">
        <div class="filter-name">Saturate</div>
        <input type="range" v-model="filters.saturate" min="0" max="3" step="0.1" @input="applyFilter">
      </div>
      <div class="filter">
        <div class="filter-name">Brightness</div>
        <input type="range" v-model="filters.brightness" min="0" max="3" step="0.1" @input="applyFilter">
      </div>
      <div class="filter">
        <div class="filter-name">Drop shadow</div>
        <input type="number" v-model="filters.dropShadow.x" @input="applyFilter">
        <input type="number" v-model="filters.dropShadow.y" @input="applyFilter">
        <input type="number" v-model="filters.dropShadow.blur" @input="applyFilter">
        <input type="color" v-model="filters.dropShadow.color" @input="applyFilter">
      </div>
      <div class="undo-filters-button" @click="setDefault">
        Revert
      </div>
    </div>

    <img :src="src" alt="Not found" ref="image">

    <canvas ref="canvas"></canvas>

    <div class="download-button" @mousedown="download">Download Image</div>
  </div>
</template>

<script>
export default {
  name: "ImageFilter",
  props: {
    src: {required: true, type: String},

    width: {type: String, default: '400px'},
    height: {type: String, default: 'auto'},

    backgroundColor: {type: String, default: 'grey'},
    additionalColor: {type: String, default: 'darkgrey'},
    activeColor: {type: String, default: 'lightgrey'},
    textColor: {type: String, default: 'white'},
    border: {type: String, default: 'none'},
    boxShadow: {type: String, default: 'none'},
  },
  data() { return {
    filters: {
      greyscale: 0,
      sepia: 0,
      blur: 0,
      invert: 0,
      hueRotate: 0,
      dropShadow: {x: 0, y: 0, blur: 0, color: '#111111'},
      saturate: 1,
      contrast: 1,
      brightness: 1,
    },
  }},
  mounted() {
    this.applyFilter()
  },
  methods: {
    setDefault() {
      this.filters = {
        greyscale: 0,
        sepia: 0,
        blur: 0,
        invert: 0,
        hueRotate: 0,
        dropShadow: {x: 0, y: 0, blur: 0, color: '#111111'},
        saturate: 1,
        contrast: 1,
      }
      this.applyFilter()
    },
    applyFilter() {

      // getting the context where to apply the changes
      let ctx = this.$refs.canvas.getContext('2d');
      this.$refs.canvas.width = this.$refs.image.getBoundingClientRect().width
      this.$refs.canvas.height = this.$refs.image.getBoundingClientRect().height

      // creating the filter from sliders values
      ctx.filter = `
        grayscale(${this.filters.greyscale}%)
        sepia(${this.filters.sepia}%)
        invert(${this.filters.invert}%)
        blur(${this.filters.blur}px)
        contrast(${this.filters.contrast})
        brightness(${this.filters.brightness})
        saturate(${this.filters.saturate})
        drop-shadow(${this.filters.dropShadow.x}px ${this.filters.dropShadow.y}px ${this.filters.dropShadow.blur}px ${this.filters.dropShadow.color})
        hue-rotate(${this.filters.hueRotate}deg)`
      // console.log(ctx.filter);

      ctx.drawImage(this.$refs.image, 0, 0, this.$refs.image.getBoundingClientRect().width, this.$refs.image.getBoundingClientRect().height);
    },
    // triggered by clicking on the download button
    download() {
      // keeping the same image quality
      let data = this.$refs.canvas.toDataURL("image/png", 1);

      // create temporary link
      let tmpLink = document.createElement('a');
      tmpLink.download = 'edited_image.png'; // set the name of the download file
      tmpLink.href = data;

      // temporarily add link to body and initiate the download
      document.body.appendChild(tmpLink);
      tmpLink.click();
      document.body.removeChild(tmpLink);
    }
  }
}
</script>

<style scoped>
#ImageFilter{
  display: grid;
  grid-gap: 16px;
  grid-template: "side-bar image preview"
                 ". . download-link";
}
img{
  width: v-bind(width);
  height: v-bind(height);
  grid-area: image;
}
.download-button{
  grid-area: download-link;
  cursor: pointer;
}
canvas{
  grid-area: preview;
}
.filter-panel{
  display: flex;
  flex-direction: column;
  grid-area: side-bar;
  gap: 16px;
  padding: 8px;
  background-color: v-bind(backgroundColor);
}
.filter input[type='number']{
  outline: none;
  width: 3ch;
  background-color: transparent;
  border: none;
  box-shadow: none;
  color: v-bind(textColor);
}
.undo-filters-button{
  user-select: none;
  cursor: pointer;
  padding: 8px 16px;
  background-color: v-bind(additionalColor);
  text-align: center;
}
</style>