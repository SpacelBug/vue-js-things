<template id="app">
  <div class="header">
    <h2>Vue JS V3 components</h2>
    <div class="pages">
      <router-link to="graphs">D3FC graphs</router-link>
      <router-link to="animations">Animations</router-link>
      <router-link to="components">Components</router-link>
      <router-link to="themes">Themes</router-link>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>

export default {
  name: "App",
  components: {

  },
  beforeMount() {
    this.$store.dispatch('themeModule/getColors')
  },
  data() { return {

    }
  }
}
</script>

<style>
body{
  background-color: var(--bg-color);
  color: var(--font-color);
  margin: 0;
}
h2{
  margin: 0;
  padding: 16px;
}
.header{
  background-color: var(--bg-color);
}
.pages{
  display: flex;
  flex-direction: row;
  gap: 20px;
  font-weight: bolder;
  padding: 16px 16px;
}
.pages a{
  font-size: 18px;
  color: var(--font-color)
}
</style>
