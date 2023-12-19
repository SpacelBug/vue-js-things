<template id="app">
  <div class="header">
    <h2>D3 js graphs</h2>
    <div class="pages">
      <router-link to="graphs">Graphs</router-link>
      <router-link to="examples">D3FC train</router-link>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>

export default {
  name: "App",
  components: {

  },
  data() { return {

    }
  }
}
</script>

<style>
body{
  background-color: #2d2c2c;
  color: white;
  margin: 0;
}
h2{
  margin: 0;
  padding: 16px;
}
.header{
  background-color: #212020;
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
  color: white;
}
</style>
