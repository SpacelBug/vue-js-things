<template>
  <div class="pages">
    <router-link :to="{ name: 'simple-components'}">Simple components</router-link>
    <router-link :to="{ name: 'other-components'}">Other components</router-link>
  </div>

  <router-view/>
</template>

<script>
export default {
  name: "ComponentsView",
}
</script>

<style scoped>
a{
  color: var(--font-color);
  text-decoration: none;
}
.pages{
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 32px;
}
</style>