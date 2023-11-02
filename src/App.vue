<template id="app">
  <h2>D3 js graphs</h2>

  <graphs-view/>
</template>

<script>
import GraphsView from "@/views/GraphsView";

export default {
  name: "App",
  components: {
    GraphsView
  },
  data() { return {

    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
