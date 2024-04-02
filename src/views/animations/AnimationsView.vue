<template>
  <div class="animations-view-main-box">

  <div class="animation-box" ref="box">
    <h3 class="animation-name">Right fade</h3>
    <div class="animation-example">
      <transition appear name="right-fade">
        <div v-if="isShowRightFade" class="square" ref="square"/>
      </transition>
    </div>
    <button @click="isShowRightFade = !isShowRightFade"> Hide/Show </button>
  </div>

  </div>
</template>

<script>
export default {
  name: "AnimationsView",
  data () { return {
    isShowRightFade: true
  }},
  computed: {
  }
}
</script>

<style scoped>
/***Animations***/
.right-fade-enter-from{
  margin-left: 50px;
  opacity: 0;
}
.right-fade-enter-active{
  transition: all 0.5s ease;
}
.left-fade-enter-to{
  margin-left: 0;
  opacity: 1;
}
.right-fade-leave-from{
  opacity: 1;
}
.right-fade-leave-active {
}
.right-fade-leave-to {
  opacity: 0;
}
/***PageStyles***/
.animations-view-main-box{
  padding: 32px;
}
.animation-box{
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  background-color: #4d4d4d;
}
.square{
  height: 100px;
  width: 100px;
  background-color: #ad1010;
}
</style>