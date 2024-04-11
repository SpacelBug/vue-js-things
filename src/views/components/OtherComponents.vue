<template>
  <div class="components-list">
    <div class="component-name" @click="showingComponentName = 'ImageFilter'">ImageFilter</div>
  </div>

  <div class="main-box">

    <div class="component-box" v-if="showingComponentName === 'ImageFilter'">
      <div class="component-box-component">
        <h3>Image Filter</h3>
        <image-filter :src="require('@/components/other/image-filter/test-image.png')"></image-filter>
      </div>
      <div class="component-box-description">
        <h2>Компонент Image Filter</h2>
        <pre>
          props:
            required:
              src - путь к изображению
            optional:
              width - ширина изображения (задается строкой как css свойство ("400px"))
              height - высота изображения (задается строкой как css свойство ("400px"))

              backgroundColor
              additionalColor
              activeColor
              textColor
              border
              boxShadow
        </pre>
      </div>
    </div>

  </div>
</template>

<script>
import ImageFilter from "@/components/other/image-filter/ImageFilter";

export default {
  name: "OtherComponents",
  components: {
    ImageFilter
  },
  data() { return {
    showingComponentName: null,
  }}
}
</script>

<style scoped>
.components-list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  padding: 32px;
}
.component-name{
  user-select: none;
  cursor: pointer;
}
.main-box{
  padding: 32px;
}
.component-box{
  display: flex;
  flex-direction: row;
  gap: 32px;
  padding: 16px;
}
</style>