<template>
  <div id="ThemeView">
    <h1>Theme</h1>
    <div class="current-colors-box">
      <h2>Current theme colors</h2>
      <button @click="$store.dispatch('themeModule/changeTheme', 'default')">
        Default
      </button>
      <button @click="$store.dispatch('themeModule/changeTheme', 'light')">
        Light
      </button>
    </div>
    <div class="preview-box">
      <div class="preview-element">
        <div class="preview-element-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto deleniti doloremque eaque eos eum eveniet excepturi, expedita ipsam iste minus mollitia odit optio provident quos repellat tempore. Facere, repellat!
        </div>
        <div class="preview-element-buttons">
          <div class="preview-element-button">Ok</div>
          <div class="preview-element-button">Cancel</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ColorPicker from "@/components/basic/color-picker/ColorPicker";

export default {
  name: "ThemeView",
  components: {
    ColorPicker,
  },
  data() { return {
    colors: {},
    newColors: {},
  }},
  mounted() {
    let style = getComputedStyle(document.body)
    this.colors = {
      '--bg-color': style.getPropertyValue('--bg-color'),
      '--panel-color': style.getPropertyValue('--panel-color'),
      '--border-color': style.getPropertyValue('--border-color'),
      '--primary-color': style.getPropertyValue('--primary-color'),
      '--additional-color': style.getPropertyValue('--additional-color'),
      '--contrast-color': style.getPropertyValue('--contrast-color'),
      '--font-color': style.getPropertyValue('--font-color'),
      '--contrast-font-color': style.getPropertyValue('--contrast-font-color'),
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.current-colors-box{
  display: flex;
  flex-direction: column;
  padding: 32px;
  margin: 16px;
  gap: 16px;
  background-color: var(--primary-color);
}
.current-color{
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.current-color-name{
  width: 250px;
  height: 20px;
}
.current-color-value{
  height: 20px;
  width: 20px;
}
.preview-box{
  display: flex;
  flex-direction: column;
  padding: 32px;
  margin: 16px;
  gap: 16px;
  background-color: var(--primary-color);
}
.preview-element{
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: var(--font-color);
  width: 450px;
  height: fit-content;
  padding: 16px;
  border: var(--panel-border);
  background-color: var(--bg-color);
}
.preview-element-buttons{
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.preview-element-button{
  width: 80px;
  height: 20px;
  background-color: var(--primary-color);
  border: var(--panel-border);
}
.preview-element-button:hover{
  background-color: var(--contrast-color);
}
</style>